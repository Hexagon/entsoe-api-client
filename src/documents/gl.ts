/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for GL_MarketDocument
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import {
  BaseDocument,
  BaseEntry,
  ParseBaseDocument,
  ParsePeriod,
  SourceBaseDocument,
  SourceCodingSchemeTextEntry,
  SourcePeriod,
  SourcePsrType,
  SourceTimeInterval,
  TimeInterval,
} from "./common.ts";
import { BusinessType } from "../parameters/businesstype.js";
import { PsrType } from "../parameters/psrtype.js";

/** Spefifics for source GL_MarketDocument, extending SourceBaseDocument */
interface SourceGLDocument extends SourceBaseDocument {
  "time_Period.timeInterval"?: SourceTimeInterval;
  TimeSeries: SourceGLEntry[] | SourceGLEntry;
}

interface SourceGLEntry {
  "outBiddingZone_Domain.mRID"?: SourceCodingSchemeTextEntry;
  "inBiddingZone_Domain.mRID"?: SourceCodingSchemeTextEntry;
  "quantity_Measure_Unit.name"?: string;
  businessType?: string;
  objectAggregation?: string;
  curveType?: string;
  MktPSRType?: SourcePsrType;
  Period: SourcePeriod | SourcePeriod[];
}

/** Specifics for parsed GL document */
interface GLDocument extends BaseDocument {
  timeseries: GLDocumentEntry[];
}
interface GLDocumentEntry extends BaseEntry {
  mktPsrType?: string;
  mktPsrTypeDescription?: string;
  outBiddingZone?: string;
  inBiddingZone?: string;
  quantityMeasureUnit?: string;
  objectAggregation?: string;
  curveType?: string;
}
/**
 * Parses everything below to the root node of a source GL_MarketDocument
 *
 * @private
 *
 * @param d - Everything below to the root node of a source GL_MarketDocument
 *
 * @returns - Typed, cleaned and validated GL document
 */
const ParseGL = (d: SourceGLDocument): GLDocument => {
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("GL document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  // Parse GL-specific version of timeInterval
  let timeInterval: TimeInterval | undefined = void 0;
  if (d["time_Period.timeInterval"]?.start && d["time_Period.timeInterval"].end) {
    timeInterval = {
      start: new Date(Date.parse(d["time_Period.timeInterval"]?.start)),
      end: new Date(Date.parse(d["time_Period.timeInterval"]?.end)),
    };
  }

  const document: GLDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "gl",
    timeInterval,
    timeseries: [],
  });

  for (const ts of tsArray) {
    const tsEntry: GLDocumentEntry = {
      outBiddingZone: ts["outBiddingZone_Domain.mRID"]?.["#text"],
      inBiddingZone: ts["inBiddingZone_Domain.mRID"]?.["#text"],
      curveType: ts.curveType,
      objectAggregation: ts.objectAggregation,
      mktPsrType: ts.MktPSRType?.psrType,
      businessType: ts.businessType,
      businessTypeDescription: ts.businessType ? (BusinessType as Record<string, string>)[ts.businessType] : void 0,
      mktPsrTypeDescription: ts.MktPSRType?.psrType ? (PsrType as Record<string, string>)[ts.MktPSRType?.psrType] : void 0,
      quantityMeasureUnit: ts["quantity_Measure_Unit.name"],
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

export type { GLDocument, GLDocumentEntry, SourceGLDocument, SourceGLEntry };
export { ParseGL };
