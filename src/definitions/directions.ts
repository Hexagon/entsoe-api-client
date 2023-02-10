/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Direction with description
 * @readonly
 * @enum {string}
 */
const Directions = {
  /** Up */
  A01: "Up",
  /** Down */
  A02: "Down",
};

/**
 * Helper function to find direction id by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the direction (Example: "Down")
 *
 * @returns - Direction id (example: A02)
 */
const Direction = (name: string): string | undefined => {
  const foundDirections: [string, string] | undefined = Object.entries(Directions).find(([_key, value]) => value.toLowerCase().trim() == name.toLowerCase().trim());
  return foundDirections ? foundDirections[0] : undefined;
};

export { Directions, Direction };
