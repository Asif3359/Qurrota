export const normalizeCsvInput = (raw: string): string => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((s: unknown) => String(s)).join(', ');
  } catch {
    // not JSON; fall through
  }
  return raw;
};

export const displayCsv = (val: unknown): string => {
    if (Array.isArray(val)) return (val as unknown[]).map((s) => String(s)).join(', ');
    if (val == null) return '';
    const s = String(val);
    return normalizeCsvInput(s);
  };