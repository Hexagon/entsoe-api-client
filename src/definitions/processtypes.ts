/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Process.Type with description
 * @readonly
 * @enum {string}
 */
const ProcessTypes = {
  /** Day ahead */
  A01: "Day ahead",
  /** Intra day incremental */
  A02: "Intra day incremental",
  /** Realised */
  A16: "Realised",
  /** Intraday total */
  A18: "Intraday total",
  /** Week ahead */
  A31: "Week ahead",
  /** Month ahead */
  A32: "Month ahead",
  /** Year ahead */
  A33: "Year ahead",
  /** Synchronisation process */
  A39: "Synchronisation process",
  /** Intraday process */
  A40: "Intraday process",
  /** Replacement reserve */
  A46: "Replacement reserve",
  /** Manual frequency restoration reserve */
  A47: "Manual frequency restoration reserve",
  /** Automatic frequency restoration reserve */
  A51: "Automatic frequency restoration reserve",
  /** Frequency containment reserve */
  A52: "Frequency containment reserve",
  /** Frequency restoration reserve */
  A56: "Frequency restoration reserve",
  /** Scheduled activation mFRR */
  A60: "Scheduled activation mFRR",
  /** Direct activation mFRR */
  A61: "Direct activation mFRR",
  /** Central Selection aFRR */
  A67: "Central Selection aFRR",
  /** Local Selection aFRR */
  A68: "Local Selection aFRR",
};

/**
 * Helper function to find process type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the process type
 *
 * @returns - Process type identifier
 */
const ProcessType = (name: string): string | undefined => {
  const foundProcessTypes: [string, string] | undefined = Object.entries(ProcessTypes).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundProcessTypes ? foundProcessTypes[0] : undefined;
};

export { ProcessType, ProcessTypes };
