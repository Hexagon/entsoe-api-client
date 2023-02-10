/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Business.Type with description
 * @readonly
 * @enum {string}
 */
const BusinessTypes = {
  /** General Capacity Information */
  A25: "General Capacity Information",
  /** Already allocated capacity (AAC) */
  A29: "Already allocated capacity (AAC)",
  /** Requested capacity (without price) */
  A43: "Requested capacity (without price)",
  /** System Operator redispatching */
  A46: "System Operator redispatching",
  /** Planned maintenance */
  A53: "Planned maintenance",
  /** Unplanned outage */
  A54: "Unplanned outage",
  /** Internal redispatch */
  A85: "Internal redispatch",
  /** Frequency containment reserve */
  A95: "Frequency containment reserve",
  /** Automatic frequency restoration reserve */
  A96: "Automatic frequency restoration reserve",
  /** Manual frequency restoration reserve */
  A97: "Manual frequency restoration reserve",
  /** Replacement reserve */
  A98: "Replacement reserve",
  /** Interconnector network evolution */
  B01: "Interconnector network evolution",
  /** Interconnector network dismantling */
  B02: "Interconnector network dismantling",
  /** Counter trade */
  B03: "Counter trade",
  /** Congestion costs */
  B04: "Congestion costs",
  /** Capacity allocated (including price) */
  B05: "Capacity allocated (including price)",
  /** Auction revenue */
  B07: "Auction revenue",
  /** Total nominated capacity */
  B08: "Total nominated capacity",
  /** Net position */
  B09: "Net position",
  /** Congestion income */
  B10: "Congestion income",
  /** Production unit */
  B11: "Production unit",
  /** Area Control Error */
  B33: "Area Control Error",
  /** Offer */
  B74: "Offer",
  /** Need */
  B75: "Need",
  /** Procured capacity */
  B95: "Procured capacity",
  /** Shared Balancing Reserve Capacity */
  C22: "Shared Balancing Reserve Capacity",
  /** Share of reserve capacity */
  C23: "Share of reserve capacity",
  /** Actual reserve capacity */
  C24: "Actual reserve capacity",
};

/**
 * Helper function to find business type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the business type (Example: "Shared Balancing Reserve Capacity")
 *
 * @returns - Business Type (example: C22)
 */
const BusinessType = (name: string): string | undefined => {
  const foundBusinessTypes: [string, string] | undefined = Object.entries(BusinessTypes).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundBusinessTypes ? foundBusinessTypes[0] : undefined;
};

export { BusinessType, BusinessTypes };
