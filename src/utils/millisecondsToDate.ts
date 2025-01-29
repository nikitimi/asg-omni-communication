export default function millisecondsToDate(milliseconds: number) {
  const date = new Date();
  date.setTime(milliseconds);
  return date.toLocaleDateString();
}
