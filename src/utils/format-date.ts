import dayjs from "dayjs";

export function formatDate(
  date: Date | undefined | null,
  format: string = "DD/MM/YYYY"
) {
  return dayjs(date).format(format);
}
