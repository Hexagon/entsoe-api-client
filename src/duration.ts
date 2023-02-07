/**
 * entsoe-api-client
 *
 * @file Helper for ISO8601 durations
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Helper function which parses an ISO8601 duration
 *
 * Supports all time parts, negative values and decimals, example: `PT1.5D1H5M1S`
 *
 * Do currently NOT support the date-part of ISO8601 durations at the moment.
 * Throws when supplied with date-part, example: `P1M1D`
 *
 * Has internal shortcuts for common durations (e.g. PT60M, PT30M etc.), to increase performance.
 *
 * Throws on any type of parsing error.
 *
 * Maninly intended for internal use in this library.
 *
 * @param pt - ISO8601 duration expressed as a string
 * @returns - number of seconds
 */
const ISO8601DurToSec = (pt: string) => {
  // Make sure pt is uppercase and trimmed
  pt = pt.toUpperCase().trim();

  // Common shortcuts
  switch (pt) {
    case "PT60M":
      return 3600;
    case "PT30M":
      return 1800;
    case "PT15M":
      return 900;
    case "PT1M":
      return 60;
    case "P1D":
      return 86400;
  }

  // Generic implementation
  const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

  const matches = pt.match(iso8601DurationRegex);

  if (matches === null) {
    throw new Error("Could not parse ISO8601 duration string '" + pt + "'");
  } else if (
    parseFloat(matches[2]) > 0 || parseFloat(matches[3]) > 0 || parseFloat(matches[4]) > 0 ||
    parseFloat(matches[5]) > 0
  ) {
    throw new Error(
      "Could not parse ISO8601 duration string '" + pt +
        "', only days and smaller specifiers supported in this implementation.",
    );
  } else {
    return (
      (matches[6] === undefined ? 0 : parseFloat(matches[6]) * 3600) +
      (matches[7] === undefined ? 0 : parseFloat(matches[7])) * 60 +
      (matches[8] === undefined ? 0 : parseFloat(matches[8]))
    ) * (matches[1] === undefined ? 1 : -1);
  }
};

export { ISO8601DurToSec };
