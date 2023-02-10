/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e DocStatus with description
 * @readonly
 * @enum {string}
 */
const DocStatus = {
  /** Intermediate */
  A01: "Intermediate",
  /** Final */
  A02: "Final",
  /** Active */
  A05: "Active",
  /** Cancelled */
  A09: "Cancelled",
  /** Withdrawn */
  A13: "Withdrawn",
  /** Estimated */
  X01: "Estimated",
};

export { DocStatus };
