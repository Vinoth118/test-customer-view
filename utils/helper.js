export const ucFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const parseDate = (isoDateStr) => {
  const date = new Date(isoDateStr);
  const day = date.toLocaleString("default", { weekday: "long" });
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const dayOfMonth = date.getDate();
  return `${day}, ${month} ${dayOfMonth}`;
};


export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}