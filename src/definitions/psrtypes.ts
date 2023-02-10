/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e PsrType with description
 * @readonly
 * @enum {string}
 */
const PsrTypes = {
  A03: "Mixed",
  A04: "Generation",
  A05: "Load",
  B01: "Biomass",
  B02: "Fossil Brown coal/Lignite",
  B03: "Fossil Coal-derived gas",
  B04: "Fossil Gas",
  B05: "Fossil Hard coal",
  B06: "Fossil Oil",
  B07: "Fossil Oil shale",
  B08: "Fossil Peat",
  B09: "Geothermal",
  B10: "Hydro Pumped Storage",
  B11: "Hydro Run-of-river and poundage",
  B12: "Hydro Water Reservoir",
  B13: "Marine",
  B14: "Nuclear",
  B15: "Other renewable",
  B16: "Solar",
  B17: "Waste",
  B18: "Wind Offshore",
  B19: "Wind Onshore",
  B20: "Other",
  B21: "AC Link",
  B22: "DC Link",
  B23: "Substation",
  B24: "Transformer",
};

/**
 * Helper function to find Psr type by name
 *
 * @public
 * @category Helpers
 *
 * @param identifier - Name of the Psr type (Example: "Shared Balancing Reserve Capacity")
 *
 * @returns - Psr Type (example: C22)
 */
const PsrType = (name: string): string | undefined => {
  const foundPsrTypes: [string, string] | undefined = Object.entries(PsrTypes).find(([_key, value]) =>
    value.toLowerCase().trim() == name.toLowerCase().trim()
  );
  return foundPsrTypes ? foundPsrTypes[0] : undefined;
};

export { PsrType, PsrTypes };
