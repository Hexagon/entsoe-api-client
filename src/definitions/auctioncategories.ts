/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Auction.Category with description
 * @readonly
 * @enum {string}
 */
const AuctionCategories = {
  /** Base */
  A01: "Base",
  /** Peak */
  A02: "Peak",
  /** Off Peak */
  A03: "Off Peak",
  /** Hourly */
  A04: "Hourly",
};

/**
 * Helper function to find Auction Category by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the Auction Category (Example: "Hourly")
 *
 * @returns - Auction Category (example: A04)
 */
const AuctionCategory = (name: string): string | undefined => {
  const foundAuctionCategories: [string, string] | undefined = Object.entries(AuctionCategories).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundAuctionCategories ? foundAuctionCategories[0] : undefined;
};

export { AuctionCategories, AuctionCategory };
