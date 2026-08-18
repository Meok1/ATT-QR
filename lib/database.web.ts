export type AttendanceRecord = { id: number; eventId: string; eventTitle: string; scannedAt: string };
type EventInput = { eventId: string; title: string; start: string; end: string };
type AttendanceResult = { success: boolean; message: string };

const storageKey = 'qr-attendance-data';
let memoryData: { events: EventInput[]; attendance: AttendanceRecord[] } = { events: [], attendance: [] };

function readData() {
  if (typeof localStorage === 'undefined') return memoryData;
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? '') as typeof memoryData;
  } catch {
    return memoryData;
  }
}

function writeData(data: typeof memoryData) {
  memoryData = data;
  if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(data));
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
  const data = readData();
  const otherEvents = data.events.filter(({ eventId }) => eventId !== event.eventId);
  writeData({ ...data, events: [...otherEvents, event] });
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

  const data = readData();
  if (data.attendance.some((record) => record.eventId === event.eventId)) return { success: false, message: 'Your attendance for this event is already recorded.' };
  const id = Math.max(0, ...data.attendance.map((record) => record.id)) + 1;
  writeData({ events: [...data.events.filter(({ eventId }) => eventId !== event.eventId), event], attendance: [...data.attendance, { id, eventId: event.eventId, eventTitle: event.title, scannedAt: new Date().toISOString() }] });
  return { success: true, message: `Attendance recorded for ${event.title}.` };
}

export async function getAttendanceHistory(_studentId: string): Promise<AttendanceRecord[]> {
  return [...readData().attendance].sort((a, b) => b.scannedAt.localeCompare(a.scannedAt));
}
