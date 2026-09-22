import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

export const APP_TIMEZONE = "Asia/Kolkata";

/**
 * Convert an IST date + time into a UTC Date.
 *
 * Example:
 * 2026-09-22 + 12:00
 * → 2026-09-22T06:30:00.000Z
 */
export const istTimeToUtc = (date, time) => {
    return fromZonedTime(
        `${date} ${time}`,
        APP_TIMEZONE
    );
};

/**
 * Format a UTC Date for display in IST.
 */
export const formatIstDateTime = (date) => {
    return formatInTimeZone(
        date,
        APP_TIMEZONE,
        "dd MMM yyyy, hh:mm a"
    );
};

/**
 * Get the day of week for a date in IST.
 *
 * 0 = Sunday
 * 1 = Monday
 * ...
 * 6 = Saturday
 */
export const getIstDayOfWeek = (date) => {
    const day = formatInTimeZone(
        `${date}T00:00:00`,
        APP_TIMEZONE,
        "i"
    );

    return Number(day) % 7;
};