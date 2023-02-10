/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Document Type used for getting description
 * @readonly
 * @enum {string}
 */
const DocumentTypes = {
  /** Finalised schedule */
  A09: "Finalised schedule",
  /** Aggregated energy data report */
  A11: "Aggregated energy data report",
  /** Acquiring system operator reserve schedule */
  A15: "Acquiring system operator reserve schedule",
  /** Bid document */
  A24: "Bid document",
  /** Allocation result document */
  A25: "Allocation result document",
  /** Capacity document */
  A26: "Capacity document",
  /** Agreed capacity */
  A31: "Agreed capacity",
  /** Reserve bid document */
  A37: "Reserve bid document",
  /** Reserve allocation result document */
  A38: "Reserve allocation result document",
  /** Price Document */
  A44: "Price Document",
  /** Estimated Net Transfer Capacity */
  A61: "Estimated Net Transfer Capacity",
  /** Redispatch notice */
  A63: "Redispatch notice",
  /** System total load */
  A65: "System total load",
  /** Installed generation per type */
  A68: "Installed generation per type",
  /** Wind and solar forecast */
  A69: "Wind and solar forecast",
  /** Load forecast margin */
  A70: "Load forecast margin",
  /** Generation forecast */
  A71: "Generation forecast",
  /** Reservoir filling information */
  A72: "Reservoir filling information",
  /** Actual generation */
  A73: "Actual generation",
  /** Wind and solar generation */
  A74: "Wind and solar generation",
  /** Actual generation per type */
  A75: "Actual generation per type",
  /** Load unavailability */
  A76: "Load unavailability",
  /** Production unavailability */
  A77: "Production unavailability",
  /** Transmission unavailability */
  A78: "Transmission unavailability",
  /** Offshore grid infrastructure unavailability */
  A79: "Offshore grid infrastructure unavailability",
  /** Generation unavailability */
  A80: "Generation unavailability",
  /** Contracted reserves */
  A81: "Contracted reserves",
  /** Accepted offers */
  A82: "Accepted offers",
  /** Activated balancing quantities */
  A83: "Activated balancing quantities",
  /** Activated balancing prices */
  A84: "Activated balancing prices",
  /** Imbalance prices */
  A85: "Imbalance prices",
  /** Imbalance volume */
  A86: "Imbalance volume",
  /** Financial situation */
  A87: "Financial situation",
  /** Cross border balancing */
  A88: "Cross border balancing",
  /** Contracted reserve prices */
  A89: "Contracted reserve prices",
  /** Interconnection network expansion */
  A90: "Interconnection network expansion",
  /** Counter trade notice */
  A91: "Counter trade notice",
  /** Congestion costs */
  A92: "Congestion costs",
  /** DC link capacity */
  A93: "DC link capacity",
  /** Non EU allocations */
  A94: "Non EU allocations",
  /** Configuration document */
  A95: "Configuration document",
  /** Flow-based allocations */
  B11: "Flow-based allocations",
  /** Aggregated netted external TSO schedule document */
  B17: "Aggregated netted external TSO schedule document",
  /** Bid Availability Documen */
  B45: "Bid Availability Document",
};

/**
 * Helper function to find document type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the document type (Example: "Bid Availability Document")
 *
 * @returns - Document Type (example: B45)
 */
const DocumentType = (name: string): string | undefined => {
  const foundDocumentTypes: [string, string] | undefined = Object.entries(DocumentTypes).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundDocumentTypes ? foundDocumentTypes[0] : undefined;
};

export { DocumentType, DocumentTypes };
