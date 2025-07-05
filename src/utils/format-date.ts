import dayjs from "dayjs";

export function formatDate(value: Date, format: string = "DD/MM/YYYY") {
  return dayjs(value).format(format);
}
