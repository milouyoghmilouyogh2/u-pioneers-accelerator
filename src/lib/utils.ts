export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STEP_TITLES_FALLBACK = 16;

export function computeProgress(answeredCount: number) {
  return Math.min(100, Math.round((answeredCount / STEP_TITLES_FALLBACK) * 100));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function initialsOf(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}
