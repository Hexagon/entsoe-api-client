/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for Unavailability_MarketDocument
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import { BusinessTypes } from "../definitions/businesstypes.ts";
import { CurveTypes } from "../definitions/curvetypes.ts";
import { PsrTypes } from "../definitions/psrtypes.ts";
import {
  BaseDocument,
  BaseEntry,
  ParseBaseDocument,
  ParsePeriod,
  SourceBaseDocument,
  SourcePeriod,
  SourceReasonDetails,
  SourceTimeInterval,
  SourceUnitTextEntry,
  TimeInterval,
} from "./common.ts";

/**
 * Source Unavailability_MarketDocument document, extending SourceBaseDocument
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceUnavailabilityDocument extends SourceBaseDocument {
  "unavailability_Time_Period.timeInterval"?: SourceTimeInterval;
  TimeSeries: SourceUnavailabilityEntry[] | SourceUnavailabilityEntry;
}

/**
 * Source Unavailability_MarketDocument TimeSeries Entry
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceUnavailabilityEntry extends SourceBaseDocument {
  businessType?: string;
  curveType?: string;
  "start_DateAndOrTime.date"?: string;
  "start_DateAndOrTime.time"?: string;
  "end_DateAndOrTime.date"?: string;
  "end_DateAndOrTime.time"?: string;
  "production_RegisteredResource.name"?: string;
  "production_RegisteredResource.location.name"?: string;
  "production_RegisteredResource.pSRType.powerSystemResources.name"?: string;
  "production_RegisteredResource.pSRType.powerSystemResources.nominalP"?: SourceUnitTextEntry;
  "production_RegisteredResource.pSRType.psrType"?: string;
  Reason?: SourceReasonDetails;
  Available_Period?: SourcePeriod | SourcePeriod[];
}

/**
 * Parsed Unavailability document, extendíng BaseDocument
 *
 * @public
 * @category Document Interfaces
 */
interface UnavailabilityDocument extends BaseDocument {
  timeseries: UnavailabilityEntry[];
}

/**
 * Parsed Unavailability document timeseries entry
 *
 * @public
 * @category Document Interfaces
 */
interface UnavailabilityEntry extends BaseEntry {
  startDate: Date;
  endDate: Date;
  curveType?: string;
  curveTypeDescription?: string;
  resourceName?: string;
  resourceLocation?: string;
  psrName?: string;
  psrType?: string;
  psrNominalPower?: string;
  psrNominalPowerUnit?: string;
  reasonCode?: string;
  reasonText?: string;
}

/**
 * Parses everything below to the root node of a source Unavailability_MarketDocument
 *
 * @private
 *
 * @param d - Everything below to the root node of a source Unavailability_MarketDocument
 *
 * @returns - Typed, cleaned and validated Unavailability document
 */
const ParseUnavailability = (d: SourceUnavailabilityDocument): UnavailabilityDocument => {
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Unavalibility document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  // Parse GL-specific version of timeInterval
  let timeInterval: TimeInterval | undefined = void 0;
  if (
    d["unavailability_Time_Period.timeInterval"]?.start &&
    d["unavailability_Time_Period.timeInterval"].end
  ) {
    timeInterval = {
      start: new Date(Date.parse(d["unavailability_Time_Period.timeInterval"]?.start)),
      end: new Date(Date.parse(d["unavailability_Time_Period.timeInterval"]?.end)),
    };
  }

  const document: UnavailabilityDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "unavailability",
    timeInterval,
    timeseries: [],
  });

  for (const outage of tsArray) {
    let startDate;
    if (outage["start_DateAndOrTime.date"]) {
      if (outage["start_DateAndOrTime.time"]) {
        startDate = new Date(
          Date.parse(outage["start_DateAndOrTime.date"] + "T" + outage["start_DateAndOrTime.time"]),
        );
      } else {
        startDate = new Date(Date.parse(outage["start_DateAndOrTime.date"] + "T00:00:00Z"));
      }
    }
    let endDate;
    if (outage["end_DateAndOrTime.date"]) {
      if (outage["end_DateAndOrTime.time"]) {
        endDate = new Date(
          Date.parse(outage["end_DateAndOrTime.date"] + "T" + outage["start_DateAndOrTime.time"]),
        );
      } else {
        endDate = new Date(Date.parse(outage["end_DateAndOrTime.date"] + "T00:00:00Z"));
      }
    }

    const ts: UnavailabilityEntry = Object.assign(ParseBaseDocument(d), {
      startDate: startDate as Date,
      endDate: endDate as Date,
      rootType: "unavailability",
      resourceName: outage["production_RegisteredResource.name"],
      resourceLocation: outage["production_RegisteredResource.location.name"],
      businessType: outage.businessType,
      businessTypeDescription: outage.businessType ? (BusinessTypes as Record<string, string>)[outage.businessType] : void 0,
      curveType: outage.curveType,
      curveTypeDescription: outage.curveType ? (CurveTypes as Record<string, string>)[outage.curveType] : void 0,
      psrName: outage["production_RegisteredResource.pSRType.powerSystemResources.name"],
      psrNominalPowerUnit: outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]
        ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["@unit"]
        : void 0,
      psrNominalPower: outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]
        ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["#text"]
        : "0",
      psrType: outage["production_RegisteredResource.pSRType.psrType"]
        ? (PsrTypes as Record<string, string>)[
          outage["production_RegisteredResource.pSRType.psrType"] as string
        ]
        : void 0,
      reasonCode: outage.Reason?.code,
      reasonText: outage.Reason?.text,
      periods: [],
    });
    const availablePeriodArray = Array.isArray(outage.Available_Period)
      ? outage.Available_Period
      : (outage.Available_Period ? [outage.Available_Period] : []);
    for (const avail of (availablePeriodArray as SourcePeriod[])) {
      ts.periods?.push(ParsePeriod(avail, outage.curveType));
    }
    document.timeseries.push(ts);
  }
  return document;
};

export type { SourceUnavailabilityDocument, SourceUnavailabilityEntry, UnavailabilityDocument, UnavailabilityEntry };

export { ParseUnavailability };
