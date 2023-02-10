/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for Configuration_MarketDocument
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import {
  BaseDocument,
  BaseEntry,
  GeneratingUnit,
  MRIDEntry,
  ParseBaseDocument,
  SourceBaseDocument,
  SourceCodingSchemeTextEntry,
  SourceGeneratingUnit,
  SourcePsrType,
} from "./common.ts";
import { BusinessType } from "../definitions/businesstype.js";

/**
 * Specifics for source Configuration_MarketDocument, extending SourceBaseDocument
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceConfigurationDocument extends SourceBaseDocument {
  TimeSeries: SourceConfigurationEntry[] | SourceConfigurationEntry;
}
/**
 * Specifics for source Configuration_MarketDocument TimeSeries entries
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceConfigurationEntry {
  businessType?: string;
  "implementation_DateAndOrTime.date"?: string;
  "implementation_DateAndOrTime.time"?: string;
  "biddingZone_Domain.mRID"?: SourceCodingSchemeTextEntry;
  "registeredResource.mRID"?: SourceCodingSchemeTextEntry;
  "ControlArea_Domain"?: MRIDEntry;
  "Provider_MarketParticipant"?: MRIDEntry;
  "registeredResource.name"?: string;
  "registeredResource.location.name"?: string;
  "MktPSRType"?: SourcePsrType;
  "GeneratingUnit_PowerSystemResources"?: SourceGeneratingUnit[];
}

/**
 * Parsed Configuration document
 *
 * @public
 * @category Document Interfaces
 */
interface ConfigurationDocument extends BaseDocument {
  timeseries: ConfigurationEntry[];
}
/**
 * Parsed Configuration timeseries entries
 *
 * @public
 * @category Document Interfaces
 */
interface ConfigurationEntry extends BaseEntry {
  implementationDate?: Date;
  biddingZoneDomain?: string;
  businessType?: string;
  businessTypeDescription?: string;
  registeredResourceId?: string;
  registeredResourceName?: string;
  registeredResourceLocation?: string;
  controlAreaDomain?: string;
  providerMarketParticipant?: string;
  psrType?: string;
  psrNominalPower?: string;
  psrNominalPowerUnit?: string;
  psrHighvoltageLimit?: string;
  psrHighvoltageLimitUnit?: string;
  generatingUnit?: GeneratingUnit[];
}

/**
 * Parses everything below to the root node of a source Configuration_MarketDocument
 *
 * @private
 *
 * @param d - Everything below to the root node of a source Configuration_MarketDocument
 *
 * @returns - Typed, cleaned and validated Unavailability document
 */
const ParseConfiguration = (d: SourceConfigurationDocument): ConfigurationDocument => {
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Unavalibility document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  const document: ConfigurationDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "configuration",
    timeseries: [],
  });

  for (const configuration of tsArray) {
    let implementationDate;
    if (configuration["implementation_DateAndOrTime.date"]) {
      if (configuration["implementation_DateAndOrTime.time"]) {
        implementationDate = new Date(
          Date.parse(
            configuration["implementation_DateAndOrTime.date"] + "T" +
              configuration["implementation_DateAndOrTime.time"],
          ),
        );
      } else {
        implementationDate = new Date(
          Date.parse(configuration["implementation_DateAndOrTime.date"] + "T00:00:00Z"),
        );
      }
    }
    const ts: ConfigurationEntry = Object.assign(ParseBaseDocument(d), {
      implementationDate,
      businessType: configuration.businessType,
      businessTypeDescription: configuration.businessType ? (BusinessType as Record<string, string>)[configuration.businessType] : void 0,
      biddingZoneDomain: configuration["biddingZone_Domain.mRID"]?.["#text"],
      registeredResourceId: configuration["registeredResource.mRID"]?.["#text"],
      registeredResourceName: configuration["registeredResource.name"],
      registeredResourceLocation: configuration["registeredResource.location.name"],
      controlAreaDomain: configuration.ControlArea_Domain?.mRID?.["#text"],
      providerMarketParticipant: configuration["Provider_MarketParticipant"]?.mRID?.["#text"],
      psrType: configuration.MktPSRType?.psrType,
      psrHighvoltageLimit: configuration.MktPSRType
        ?.["production_PowerSystemResources.highVoltageLimit"]?.["#text"],
      psrHighvoltageLimitUnit: configuration.MktPSRType
        ?.["production_PowerSystemResources.highVoltageLimit"]?.["@unit"],
      psrNominalPower: configuration.MktPSRType?.["nominalIP_PowerSystemResources.nominalP"]
        ?.["#text"],
      psrNominalPowerUnit: configuration.MktPSRType?.["nominalIP_PowerSystemResources.nominalP"]
        ?.["@unit"],
      generatingUnit: [],
    });
    if (configuration.GeneratingUnit_PowerSystemResources?.length) {
      for (const gu of configuration.GeneratingUnit_PowerSystemResources) {
        const guResult = {
          nominalPower: gu.nominalP?.["#text"],
          nominalPowerUnit: gu.nominalP?.["@unit"],
          name: gu.name,
          locationName: gu["generatingUnit_Location.name"],
          psrType: gu["generatingUnit_PSRType.psrType"],
          id: gu.mRID?.["#text"],
        };
        ts.generatingUnit?.push(guResult);
      }
    }
    document.timeseries.push(ts);
  }
  return document;
};

export type { ConfigurationDocument, ConfigurationEntry, SourceConfigurationDocument, SourceConfigurationEntry };
export { ParseConfiguration };
