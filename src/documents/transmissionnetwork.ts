/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for TransmissionNetwork_MarketDocument
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
  SourceCodingSchemeTextEntry,
  SourcePeriod,
  SourceTimeInterval,
  TimeInterval,
} from "./common.ts";

interface SourceAssetRegisteredResource {
  mRID?: SourceCodingSchemeTextEntry;
  "pSRType.psrType"?: string;
  "location.name"?: string;
}

/**
 * Source TransmissionNetwork_MarketDocument document, extending SourceBaseDocument
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceTransmissionNetworkDocument extends SourceBaseDocument {
  "period.timeInterval"?: SourceTimeInterval;
  TimeSeries: SourceTransmissionNetworkEntry[] | SourceTransmissionNetworkEntry;
}

/**
 * Source TransmissionNetwork_MarketDocument TimeSeries Entry
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceTransmissionNetworkEntry {
  businessType?: string;
  "in_Domain.mRID"?: SourceCodingSchemeTextEntry;
  "out_Domain.mRID"?: SourceCodingSchemeTextEntry;
  "quantity_Measure_Unit.name"?: string;
  curveType?: string;
  Period: SourcePeriod | SourcePeriod[];
  "end_DateAndOrTime.date"?: string;
  "end_DateAndOrTime.time"?: string;
  "Asset_RegisteredResource"?: SourceAssetRegisteredResource;
}

/**
 * Parsed TransmissionNetwork document, extendíng BaseDocument
 *
 * @public
 * @category Document Interfaces
 */
interface TransmissionNetworkDocument extends BaseDocument {
  timeseries: TransmissionNetworkDocumentEntry[];
}

/**
 * Parsed TransmissionNetwork document timeseries entry
 *
 * @public
 * @category Document Interfaces
 */
interface TransmissionNetworkDocumentEntry extends BaseEntry {
  quantityMeasureUnit?: string;
  inDomain?: string;
  outDomain?: string;
  curveType?: string;
  curveTypeDescription?: string;
  endDate?: Date;
  assetRegisteredResourceId?: string;
  assetRegisteredResourcePsrType?: string;
  assetRegisteredResourcePsrTypeDescription?: string;
  assetRegisteredResourceLocationName?: string;
}

/**
 * Parses everything below to the root node of a source TransmissionNetwork_MarketDocument
 *
 * @private
 *
 * @param d - Everything below to the root node of a source TransmissionNetwork_MarketDocument
 *
 * @returns - Typed, cleaned and validated TransmissionNetwork document
 */
const ParseTransmissionNetwork = (d: SourceTransmissionNetworkDocument): TransmissionNetworkDocument => {
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("TransmissionNetwork document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  // Parse TransmissionNetwork-specific version of timeInterval
  let timeInterval: TimeInterval | undefined = void 0;
  if (d["period.timeInterval"]?.start && d["period.timeInterval"].end) {
    timeInterval = {
      start: new Date(Date.parse(d["period.timeInterval"]?.start)),
      end: new Date(Date.parse(d["period.timeInterval"]?.end)),
    };
  }

  const document: TransmissionNetworkDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "transmissionnetwork",
    timeInterval,
    timeseries: [],
  });

  for (const ts of tsArray) {
    let endDate;
    if (ts["end_DateAndOrTime.date"]) {
      if (ts["end_DateAndOrTime.time"]) {
        endDate = new Date(
          Date.parse(
            ts["end_DateAndOrTime.date"] + "T" +
              ts["end_DateAndOrTime.time"],
          ),
        );
      } else {
        endDate = new Date(
          Date.parse(ts["end_DateAndOrTime.date"] + "T00:00:00Z"),
        );
      }
    }
    const tsEntry: TransmissionNetworkDocumentEntry = {
      endDate: endDate,
      quantityMeasureUnit: ts["quantity_Measure_Unit.name"],
      curveType: ts.curveType,
      curveTypeDescription: ts.curveType ? (CurveTypes as Record<string, string>)[ts.curveType] : void 0,
      businessType: ts.businessType,
      inDomain: ts["in_Domain.mRID"]?.["#text"],
      outDomain: ts["out_Domain.mRID"]?.["#text"],
      businessTypeDescription: ts.businessType ? (BusinessTypes as Record<string, string>)[ts.businessType] : void 0,
      assetRegisteredResourceId: ts.Asset_RegisteredResource?.mRID?.["#text"],
      assetRegisteredResourcePsrType: ts.Asset_RegisteredResource?.["pSRType.psrType"],
      assetRegisteredResourcePsrTypeDescription: ts.Asset_RegisteredResource?.["pSRType.psrType"]
        ? (PsrTypes as Record<string, string>)[ts.Asset_RegisteredResource?.["pSRType.psrType"]]
        : void 0,
      assetRegisteredResourceLocationName: ts.Asset_RegisteredResource?.["location.name"],
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

export type { SourceTransmissionNetworkDocument, SourceTransmissionNetworkEntry, TransmissionNetworkDocument, TransmissionNetworkDocumentEntry };

export { ParseTransmissionNetwork };
