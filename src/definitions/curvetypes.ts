/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Curve Type with description
 * @readonly
 * @enum {string}
 */
const CurveTypes = {
  /** Sequential fixed size block */
  A01: "Sequential fixed size block",
  /** Point */
  A02: "Point",
  /** Variable sized block */
  A03: "Variable sized block",
};

/**
 * Helper function to find Curve type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the Curve type (Example: "Variable sized block")
 *
 * @returns - Curve Type (example: A03)
 */
const CurveType = (name: string): string | undefined => {
  const foundCurveTypes: [string, string] | undefined = Object.entries(CurveTypes).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundCurveTypes ? foundCurveTypes[0] : undefined;
};

export { CurveType, CurveTypes };
