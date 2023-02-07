/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for Balancing_MarketDocument
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
  SourceCodingSchemeTextEntry,
  SourcePeriod,
  SourceTimeInterval,
  TimeInterval,
} from "./common.ts";

/** Spefifics for source Balancing_MarketDocument, extending SourceBaseDocument */
interface SourceBalancingDocument extends SourceBaseDocument {
  "period.timeInterval"?: SourceTimeInterval;
  "area_Domain.mRID"?: SourceCodingSchemeTextEntry;
  TimeSeries: SourceBalancingEntry[] | SourceBalancingEntry;
}
interface SourceBalancingEntry {
  businessType?: string;
  "flowDirection.direction"?: string;
  "quantity_Measure_Unit.name"?: string;
  curveType?: string;
  Period: SourcePeriod | SourcePeriod[];
}

/** Specifics for parsed Balancing document */
interface BalancingDocument extends BaseDocument {
  areaDomainId?: string;
  timeseries: BalancingDocumentEntry[];
}

interface BalancingDocumentEntry extends BaseEntry {
  quantityMeasureUnit?: string;
  flowDirection?: string;
  curveType?: string;
}

/**
 * Parses everything below to the root node of a source Balancing_MarketDocument
 *
 * @private
 *
 * @param d - Everything below to the root node of a source Balancing_MarketDocument
 *
 * @returns - Typed, cleaned and validated Balancing document
 */
const ParseBalancing = (d: SourceBalancingDocument): BalancingDocument => {
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Balancing document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  // Parse Balancing-specific version of timeInterval
  let timeInterval: TimeInterval | undefined = void 0;
  if (d["period.timeInterval"]?.start && d["period.timeInterval"].end) {
    timeInterval = {
      start: new Date(Date.parse(d["period.timeInterval"]?.start)),
      end: new Date(Date.parse(d["period.timeInterval"]?.end)),
    };
  }

  const document: BalancingDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "balancing",
    areaDomainId: d["area_Domain.mRID"]?.["#text"],
    timeInterval,
    timeseries: [],
  });

  for (const ts of tsArray) {
    const tsEntry: BalancingDocumentEntry = {
      quantityMeasureUnit: ts["quantity_Measure_Unit.name"],
      curveType: ts.curveType,
      businessType: ts.businessType,
      flowDirection: ts["flowDirection.direction"],
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

export type { BalancingDocument, BalancingDocumentEntry, SourceBalancingDocument, SourceBalancingEntry };

export { ParseBalancing };
