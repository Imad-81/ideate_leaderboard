/**
 * Formats milliseconds into a standard motorsport lap time string.
 * e.g. 18427 ms -> "18.427" or "00:18.427" if includeMinutes is true.
 * e.g. 68427 ms -> "1:08.427"
 */
export function formatLapTime(timeMs: number, includeMinutes: boolean = false): string {
  if (!timeMs || timeMs <= 0) return "--:--.---";

  const minutes = Math.floor(timeMs / 60000);
  const remainingMs = timeMs % 60000;
  const seconds = Math.floor(remainingMs / 1000);
  const millis = remainingMs % 1000;

  const paddedMillis = millis.toString().padStart(3, "0");

  if (minutes > 0) {
    const paddedSec = seconds.toString().padStart(2, "0");
    return `${minutes}:${paddedSec}.${paddedMillis}`;
  }

  if (includeMinutes) {
    const paddedSec = seconds.toString().padStart(2, "0");
    return `00:${paddedSec}.${paddedMillis}`;
  }

  // Pure seconds + milliseconds format typical in short sprint / college challenge
  return `${seconds}.${paddedMillis}`;
}

/**
 * Formats time gap relative to the leader.
 * e.g. 0 -> "—"
 * e.g. 485 -> "+0.485"
 * e.g. 1485 -> "+1.485"
 */
export function formatGap(
  gapMs: number | null | undefined,
  isLeader: boolean = false,
  status: string = "FINISHED"
): string {
  if (status !== "FINISHED") {
    return status;
  }

  if (isLeader || gapMs === null || gapMs === undefined || gapMs === 0) {
    return "—";
  }

  const gapSeconds = (gapMs / 1000).toFixed(3);
  return `+${gapSeconds}`;
}

/**
 * Robustly parses user-entered time strings into integer milliseconds.
 * Supports:
 * - "18.427" -> 18427
 * - "00:18.427" or "0:18.427" -> 18427
 * - "1:14.200" -> 74200
 * - "19.5" -> 19500
 * - "20" -> 20000
 */
export function parseTimeToMs(input: string): number | null {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  // Pattern 1: MM:SS.mmm or M:SS.mmm
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":");
    if (parts.length !== 2) return null;

    const min = parseInt(parts[0], 10);
    const secParts = parts[1].split(".");

    if (isNaN(min) || min < 0) return null;

    const sec = parseInt(secParts[0], 10);
    if (isNaN(sec) || sec < 0 || sec >= 60) return null;

    let ms = 0;
    if (secParts.length > 1) {
      const msStr = secParts[1].padEnd(3, "0").slice(0, 3);
      ms = parseInt(msStr, 10);
      if (isNaN(ms)) return null;
    }

    return min * 60000 + sec * 1000 + ms;
  }

  // Pattern 2: SS.mmm or SS
  const num = parseFloat(trimmed);
  if (isNaN(num) || num <= 0) return null;

  // If contains decimal, calculate exact milliseconds
  if (trimmed.includes(".")) {
    const [secStr, decStr] = trimmed.split(".");
    const sec = parseInt(secStr, 10) || 0;
    const ms = parseInt((decStr || "").padEnd(3, "0").slice(0, 3), 10) || 0;
    return sec * 1000 + ms;
  }

  return Math.round(num * 1000);
}
