export function isSameDay(dateString) {
  const today = new Date();
  const date = new Date(dateString);

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

export function formatMoodDate(dateString) {
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getJarFillHeight(entriesLength) {
  return `${Math.min((entriesLength / 10) * 100, 100)}%`;
}

export function getPaperPositions() {
  return [
    "left-2 top-2 rotate-[-10deg]",
    "right-2 top-4 rotate-[8deg]",

    "left-3 top-10 rotate-[4deg]",
    "right-3 top-12 rotate-[-6deg]",

    "left-4 top-18 rotate-[9deg]",
    "right-4 top-20 rotate-[-9deg]",

    "left-3 top-28 rotate-[5deg]",
    "right-2 top-30 rotate-[-7deg]",

    "left-5 top-38 rotate-[7deg]",
    "right-3 top-40 rotate-[-5deg]",

    "left-4 top-48 rotate-[6deg]",
    "right-4 top-50 rotate-[-6deg]",
  ];
}
export function getMoodPaperStyle(entry) {
  return {
    backgroundColor: entry?.moodLabel?.paperColor || "#ffffff",
  };
}

export function getTimeUntilNextDay() {
  const now = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
