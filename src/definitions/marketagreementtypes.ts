/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Contract_MarketAgreement.Type and Type_MarketAgreement.Type with description
 * @readonly
 * @enum {string}
 */
const MarketAgreementTypes = {
  /** Daily */
  A01: "Daily",
  /** Weekly */
  A02: "Weekly",
  /** Monthly */
  A03: "Monthly",
  /** Yearly */
  A04: "Yearly",
  /** Total */
  A05: "Total",
  /** Long term */
  A06: "Long term",
  /** Intraday */
  A07: "Intraday",
  /** Hourly (Type_MarketAgreement.Type only) */
  A13: "Hourly (Type_MarketAgreement.Type only)",
};

/**
 * Helper function to find MarketAgreement type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the MarketAgreement type (Example: "Hourly (Type_MarketAgreement.Type only)")
 *
 * @returns - MarketAgreement Type (example: A13)
 */
const MarketAgreementType = (name: string): string | undefined => {
  const foundMarketAgreementTypes: [string, string] | undefined = Object.entries(MarketAgreementTypes).find(([_key, value]) => value.toLowerCase().trim() == name.toLowerCase().trim());
  return foundMarketAgreementTypes ? foundMarketAgreementTypes[0] : undefined;
};

export { MarketAgreementTypes, MarketAgreementType };
