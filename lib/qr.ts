export type QRPayload = { v: 1; event: string; title?: string; start?: string; end?: string };
export type ParseQRResult = { ok: true; payload: QRPayload } | { ok: false; message: string };

export function buildQRPayload(event: { eventId: string; title: string; start?: string; end?: string }): string {
  const payload: QRPayload = { v: 1, event: event.eventId };
  if (event.title) payload.title = event.title;
  if (event.start) payload.start = event.start;
  if (event.end) payload.end = event.end;
  return JSON.stringify(payload);
}

export function parseQRPayload(raw: string): ParseQRResult {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return { ok: false, message: 'Invalid QR code.' }; }
  if (!parsed || typeof parsed !== 'object') return { ok: false, message: 'Not an attendance QR code.' };
  const value = parsed as Partial<QRPayload>;
  if (value.v !== 1 || typeof value.event !== 'string' || !value.event.trim()) return { ok: false, message: 'Not an attendance QR code.' };
  if ([value.title, value.start, value.end].some((item) => item !== undefined && typeof item !== 'string')) return { ok: false, message: 'Not an attendance QR code.' };
  return { ok: true, payload: value as QRPayload };
}
