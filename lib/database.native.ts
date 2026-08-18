import * as SQLite from 'expo-sqlite';

export type AttendanceRecord = { id: number; eventId: string; eventTitle: string; scannedAt: string };
type EventInput = { eventId: string; title: string; start: string; end: string };
type AttendanceResult = { success: boolean; message: string };

let databasePromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;

function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('attendance.db').then(async (database) => {
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS events (event_id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, starts_at TEXT NOT NULL, ends_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id TEXT NOT NULL, student_id TEXT NOT NULL, scanned_at TEXT NOT NULL, UNIQUE(event_id, student_id));
      `);
      return database;
    });
  }
  return databasePromise;
}

function parseEvent(value: unknown): EventInput | null {
  if (!value || typeof value !== 'object') return null;
  const event = value as Partial<EventInput> & { event?: unknown };
  const eventId = typeof event.eventId === 'string' ? event.eventId : event.event;
  if (typeof eventId !== 'string' || typeof event.title !== 'string' || typeof event.start !== 'string' || typeof event.end !== 'string') return null;
  if (![eventId, event.title, event.start, event.end].every((field) => field.trim().length > 0)) return null;
  return { eventId, title: event.title, start: event.start, end: event.end };
}

export async function createEvent(event: EventInput) {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO events (event_id, title, starts_at, ends_at) VALUES (?, ?, ?, ?) ON CONFLICT(event_id) DO UPDATE SET title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at',
    event.eventId, event.title, event.start, event.end
  );
}

export async function registerAttendance(payload: string, studentId: string): Promise<AttendanceResult> {
  let event: EventInput;
  try {
    const parsed: unknown = JSON.parse(payload);
    const parsedEvent = parseEvent(parsed);
    if (!parsedEvent) return { success: false, message: 'This QR code does not contain a valid event.' };
    event = parsedEvent;
  } catch {
    return { success: false, message: 'This QR code is not valid attendance data.' };
  }

  const startTime = new Date(event.start).getTime();
  const endTime = new Date(event.end).getTime();
  if (Number.isNaN(startTime) || Number.isNaN(endTime) || startTime >= endTime) return { success: false, message: 'This QR code has invalid event dates.' };
  if (Date.now() < startTime || Date.now() > endTime) return { success: false, message: 'Attendance is not currently open for this event.' };

  const database = await getDatabase();
  await createEvent(event);
  try {
    await database.runAsync('INSERT INTO attendance (event_id, student_id, scanned_at) VALUES (?, ?, ?)', event.eventId, studentId, new Date().toISOString());
    return { success: true, message: `Attendance recorded for ${event.title}.` };
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed/i.test(error.message)) return { success: false, message: 'Your attendance for this event is already recorded.' };
    return { success: false, message: 'Could not save attendance. Please try again.' };
  }
}

export async function getAttendanceHistory(studentId: string): Promise<AttendanceRecord[]> {
  const database = await getDatabase();
  return database.getAllAsync<AttendanceRecord>(
    'SELECT attendance.id, attendance.event_id AS eventId, events.title AS eventTitle, attendance.scanned_at AS scannedAt FROM attendance INNER JOIN events ON events.event_id = attendance.event_id WHERE attendance.student_id = ? ORDER BY attendance.scanned_at DESC',
    studentId
  );
}
