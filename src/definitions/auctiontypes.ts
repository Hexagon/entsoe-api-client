/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Auction.Type with description
 * @readonly
 * @enum {string}
 */
const AuctionTypes = {
  /** Implicit */
  A01: "Implicit",
  /** Explicit */
  A02: "Explicit",
};

/**
 * Helper function to find Auction type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the Auction type (Example: "Shared Balancing Reserve Capacity")
 *
 * @returns - Auction Type (example: C22)
 */
const AuctionType = (name: string): string | undefined => {
  const foundAuctionTypes: [string, string] | undefined = Object.entries(AuctionTypes).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundAuctionTypes ? foundAuctionTypes[0] : undefined;
};

export { AuctionType, AuctionTypes };
