import { isToday, isYesterday, format } from "date-fns";

export const formatWhenDateWas = (date: number) => {
    const dateObj = new Date(date * 1000);
    let timeAgo: string;
    if (isToday(dateObj)) {
        timeAgo = "Today";
    } else if (isYesterday(dateObj)) {
        timeAgo = "Yesterday";
    } else {
        timeAgo = `Earlier on ${dateObj.toLocaleDateString()}`;
    }
    return `${timeAgo} at ${format(dateObj, "pp").toLowerCase()}`;
};
