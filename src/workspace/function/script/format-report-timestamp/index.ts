export function formatReportTimestamp(checkedAt: string): string {
  const date = new Date(checkedAt);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid report date: ${checkedAt}`);
  }

  const year = date.getFullYear().toString();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}${month}${day}-${hour}${minute}`;
}
