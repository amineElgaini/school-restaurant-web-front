export function getNextWeekWorkDays() {
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday, 1 is Monday...

  // Distance to next Monday:
  // If Sun (0) -> 1 day (tomorrow)
  // If Mon-Sat (1-6) -> (8 - day) days
  const diff = day === 0 ? 1 : 8 - day;

  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + diff);

  const days: { label: string; value: string }[] = [];
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  for (let i = 0; i < 5; i++) {
    // Monday to Friday
    const date = new Date(nextMonday);
    date.setDate(nextMonday.getDate() + i);

    const value = date.toISOString().split("T")[0];
    const label = `${formatter.format(date)} (${value})`;

    days.push({ label, value });
  }

  return days;
}
