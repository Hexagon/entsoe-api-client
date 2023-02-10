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
const DocStatuses = {
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

/**
 * Helper function to find document status id by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the document status (Example: "Estimated")
 *
 * @returns - Document status id (example: X01)
 */
const DocStatus = (name: string): string | undefined => {
  const foundDocStatuss: [string, string] | undefined = Object.entries(DocStatuses).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundDocStatuss ? foundDocStatuss[0] : undefined;
};

export { DocStatus, DocStatuses };
