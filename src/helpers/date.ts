/**
 * entsoe-api-client
 *
 * @file Helper for ENTSO-e date formatting
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Converts a Date object to ENTSO-e API date format (YYYY-MM-DDTHH:mmZ)
 *
 * ENTSO-e API requires dates without seconds, in the format YYYY-MM-DDTHH:mmZ
 *
 * @param date - Date object to format
 * @returns - Formatted date string in YYYY-MM-DDTHH:mmZ format
 */
const toEntsoeFormat = (date: Date): string => {
  return date.getUTCFullYear() +
    "-" + String(date.getUTCMonth() + 1).padStart(2, "0") +
    "-" + String(date.getUTCDate()).padStart(2, "0") +
    "T" + String(date.getUTCHours()).padStart(2, "0") +
    ":" + String(date.getUTCMinutes()).padStart(2, "0") + "Z";
};

/**
 * Formats a Date object or ISO 8601 string to ENTSO-e API date format (YYYY-MM-DDTHH:mmZ)
 *
 * Accepts:
 * - Date objects
 * - ISO 8601 strings in YYYY-MM-DDTHH:mmZ format (returned as-is)
 * - Other parseable date strings (converted to ENTSO-e format)
 *
 * @param d - Date object or string to format
 * @param paramName - Parameter name for error messages (e.g., "startDateTime", "startDateTimeUpdate")
 * @returns - Formatted date string in YYYY-MM-DDTHH:mmZ format
 * @throws - Error if the input is not a valid date
 */
const formatEntsoeDate = (d: Date | string, paramName: string): string => {
  if (typeof d === "string") {
    // If already in correct format, return as-is
    const iso = d.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/) ? d : null;
    if (iso) return iso;

    // Try to parse the string as a date
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      return toEntsoeFormat(parsed);
    }
    throw new Error(`${paramName} string must be ISO 8601 UTC (YYYY-MM-DDTHH:mmZ)`);
  } else if (d instanceof Date && !isNaN(d.getTime())) {
    return toEntsoeFormat(d);
  } else {
    throw new Error(`${paramName} not valid, should be Date object or ISO 8601 string`);
  }
};

export { formatEntsoeDate, toEntsoeFormat };
