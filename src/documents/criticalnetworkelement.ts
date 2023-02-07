/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for CriticalNetworkElement_MarketDocument
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import { BusinessType } from "../parameters/businesstype.js";
import {
  BaseDocument,
  BaseEntry,
  ParseBaseDocument,
  ParsePeriod,
  SourceBaseDocument,
  SourcePeriod,
  SourceTimeInterval,
  TimeInterval,
} from "./common.ts";

/** Spefifics for source CriticalNetworkElement_MarketDocument, extending SourceBaseDocument */
interface SourceCriticalNetworkElementDocument extends SourceBaseDocument {
  "time_Period.timeInterval"?: SourceTimeInterval;
  TimeSeries: SourceCriticalNetworkElementEntry[] | SourceCriticalNetworkElementEntry;
}
interface SourceCriticalNetworkElementEntry {
  businessType?: string;
  curveType?: string;
  Period: SourcePeriod | SourcePeriod[];
}

/** Specifics for parsed CriticalNetworkElement document */
interface CriticalNetworkElementDocument extends BaseDocument {
  timeseries: CriticalNetworkElementDocumentEntry[];
}

interface CriticalNetworkElementDocumentEntry extends BaseEntry {
  curveType?: string;
}

/**
 * Parses everything below to the root node of a source CriticalNetworkElement_MarketDocument
 *
 * @private
 *
 * @param d - Everything below to the root node of a source CriticalNetworkElement_MarketDocument
 *
 * @returns - Typed, cleaned and validated CriticalNetworkElement document
 */
const ParseCriticalNetworkElement = (d: SourceCriticalNetworkElementDocument): CriticalNetworkElementDocument => {
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("CriticalNetworkElement document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  // Parse CriticalNetworkElement-specific version of timeInterval
  let timeInterval: TimeInterval | undefined = void 0;
  if (d["time_Period.timeInterval"]?.start && d["time_Period.timeInterval"].end) {
    timeInterval = {
      start: new Date(Date.parse(d["time_Period.timeInterval"]?.start)),
      end: new Date(Date.parse(d["time_Period.timeInterval"]?.end)),
    };
  }

  const document: CriticalNetworkElementDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "criticalnetworkelement",
    timeInterval,
    timeseries: [],
  });

  for (const ts of tsArray) {
    const tsEntry: CriticalNetworkElementDocumentEntry = {
      curveType: ts.curveType,
      businessType: ts.businessType,
      businessTypeDescription: ts.businessType ? (BusinessType as Record<string, string>)[ts.businessType] : void 0,
      periods: [],
    };
    const periodArray = Array.isArray(ts.Period) ? ts.Period : (ts.Period ? [ts.Period] : []);
    for (const inputPeriod of (periodArray as SourcePeriod[])) {
      tsEntry.periods?.push(ParsePeriod(inputPeriod));
    }
    document.timeseries.push(tsEntry);
  }

  return document;
};

export type {
  CriticalNetworkElementDocument,
  CriticalNetworkElementDocumentEntry,
  SourceCriticalNetworkElementDocument,
  SourceCriticalNetworkElementEntry,
};

export { ParseCriticalNetworkElement };
