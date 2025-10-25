/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for CriticalNetworkElement_MarketDocument
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import { BusinessTypes } from "../definitions/businesstypes.ts";
import { CurveTypes } from "../definitions/curvetypes.ts";
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

/**
 * Source CriticalNetworkElement_MarketDocument, extending SourceBaseDocument
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceCriticalNetworkElementDocument extends SourceBaseDocument {
  "time_Period.timeInterval"?: SourceTimeInterval;
  TimeSeries: SourceCriticalNetworkElementEntry[] | SourceCriticalNetworkElementEntry;
}
/**
 * Source CriticalNetworkElement_MarketDocument TimeSeries Entry
 * @private
 * @category Source Document Interfaces
 */
interface SourceCriticalNetworkElementEntry {
  businessType?: string;
  curveType?: string;
  Period: SourcePeriod | SourcePeriod[];
}

/** Parsed CriticalNetworkElement document
 *
 * @public
 * @category Document Interfaces
 */
interface CriticalNetworkElementDocument extends BaseDocument {
  timeseries: CriticalNetworkElementDocumentEntry[];
}
/** Parsed CriticalNetworkElement document timeseries entry
 *
 * @public
 * @category Document Interfaces
 */
interface CriticalNetworkElementDocumentEntry extends BaseEntry {
  curveType?: string;
  curveTypeDescription?: string;
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
      curveTypeDescription: ts.curveType ? (CurveTypes as Record<string, string>)[ts.curveType] : void 0,
      businessType: ts.businessType,
      businessTypeDescription: ts.businessType ? (BusinessTypes as Record<string, string>)[ts.businessType] : void 0,
      periods: [],
    };
    const periodArray = Array.isArray(ts.Period) ? ts.Period : (ts.Period ? [ts.Period] : []);
    for (const inputPeriod of (periodArray as SourcePeriod[])) {
      tsEntry.periods?.push(ParsePeriod(inputPeriod, ts.curveType));
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
