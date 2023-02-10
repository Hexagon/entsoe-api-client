/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e MarketProduct with description
 * @readonly
 * @enum {string}
 */
const MarketProduct = {
  /** Standard */
  A01: "Standard",
  /** Specific */
  A02: "Specific",
  /** Integrated process */
  A03: "Integrated process",
  /** Local */
  A04: "Local",
  /** Standard mFRR DA */
  A05: "Standard mFRR DA",
  /** Standard mFRR SA+DA */
  A07: "Standard mFRR SA+DA",
};

export { MarketProduct };
