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
const MarketProducts = {
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

/**
 * Helper function to find MarketAgreement type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the MarketAgreement type (Example: "Standard mFRR SA+DA")
 *
 * @returns - MarketAgreement Type (example: A07)
 */
const MarketProduct = (name: string): string | undefined => {
  const foundMarketProducts: [string, string] | undefined = Object.entries(MarketProducts).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundMarketProducts ? foundMarketProducts[0] : undefined;
};

export { MarketProduct, MarketProducts };
