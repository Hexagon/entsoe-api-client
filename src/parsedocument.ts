import { parse } from "../deps.js";
import { PsrType } from "./parameters/psrtype.js";
import { BusinessType } from "./parameters/businesstype.js";
import { ProcessType } from "./parameters/processtype.js";
import { DocumentType } from "./parameters/documenttype.js";
import { ISO8601DurToSec } from "./duration.ts";

// --- Root Source Document
interface SourceDocument {
  Publication_MarketDocument?: SourcePublicationDocument;
  GL_MarketDocument?: SourceGLDocument;
  Unavailability_MarketDocument?: SourceUnavailabilityDocument;
  Acknowledgement_MarketDocument?: SourceAcknowledmentDocument;
}

// --- Source generics
interface SourceReasonDetails {
  code: string;
  text: string;
}
interface SourcePsrType {
  psrType: string;
}
interface SourceNominalPowerEntry {
  "@unit": string;
  "#text": string;
}
interface SourceTimeInterval {
  start: string;
  end: string;
}
interface SourcePoint {
  position: number;
  "price.amount"?: number;
  quantity?: number;
}
interface SourcePeriod {
  timeInterval: SourceTimeInterval;
  Point: SourcePoint[];
  resolution: string;
}

// --- Base for typed sub-document
interface SourceBaseDocument {
  mRID: string;
  revisionNumber: number;
  createdDateTime?: string;
  type: string;
  "process.processType"?: string;
}

// --- Acknowledment Document
interface SourceAcknowledmentDocument extends SourceBaseDocument {
  Reason: SourceReasonDetails;
}

// --- Publication Document
interface SourcePublicationEntry {
  Period: SourcePeriod | SourcePeriod[];
  businessType?: string;
  "price_Measure_Unit.name"?: string,
  "currency_Unit.name"?: string,
}

interface SourcePublicationDocument extends SourceBaseDocument {
  TimeSeries: SourcePublicationEntry[] | SourcePublicationEntry;
}

// --- GL Document
interface SourceGLEntry {
  "outBiddingZone_Domain.mRID"?: unknown;
  "inBiddingZone_Domain.mRID"?: unknown;
  "quantity_Measure_Unit.name"?: string;
  businessType?: string;
  MktPSRType?: SourcePsrType;
  Period: SourcePeriod | SourcePeriod[];
}
interface SourceGLDocument extends SourceBaseDocument {
  TimeSeries: SourceGLEntry[] | SourceGLEntry;
}

// --- UnavailabilityDocument
interface SourceUnavailabilityEntry extends SourceBaseDocument {
  businessType?: string;
  "start_DateAndOrTime.date"?: string;
  "start_DateAndOrTime.time"?: string;
  "end_DateAndOrTime.date"?: string;
  "end_DateAndOrTime.time"?: string;
  "production_RegisteredResource.name"?: string;
  "production_RegisteredResource.location.name"?: string;
  "production_RegisteredResource.pSRType.powerSystemResources.name"?: string;
  "production_RegisteredResource.pSRType.powerSystemResources.nominalP"?: SourceNominalPowerEntry;
  "production_RegisteredResource.pSRType.psrType"?: string;
  Reason?: SourceReasonDetails;
  Available_Period?: SourcePeriod | SourcePeriod[];
}
interface SourceUnavailabilityDocument extends SourceBaseDocument {
  TimeSeries: SourceUnavailabilityEntry[] | SourceUnavailabilityEntry;
}

/* NEW OUTPUT TYPES */

/* --- Generics */
interface Point {
  startDate: Date;
  endDate: Date;
  position: number;
  price?: number;
  quantity?: number;
}

interface Period {
  startDate: Date,
  endDate: Date,
  points: Point[];
  resolution: string;
  resolutionSeconds?: number;
}

interface BaseDocument {
  mRID: string;
  revision: number;
  rootType?: string;
  created?: Date;
  documentType: string;
  documentTypeDescription?: string;
  processType?: string;
  processTypeDescription?: string;
  businessType?: string;
  businessTypeDescription?: string;
}

interface BaseEntry {
  businessType?: string,
  businessTypeDescription?: string,
  periods: Period[];
}

interface PublicationDocumentEntry extends BaseEntry {
  currency?: string,
  unit?: string,
}
interface PublicationDocument extends BaseDocument {
  timeseries: PublicationDocumentEntry[];
}
interface GLDocumentEntry extends BaseEntry {
  mktPsrType?: string;
  mktPsrTypeDescription?: string;
  outBiddingZone?: unknown;
  inBiddingZone?: unknown;
  quantityMeasureUnit?: string;
}
interface GLDocument extends BaseDocument {
  timeseries: GLDocumentEntry[];
}

interface UnavailabilityEntry extends BaseEntry {
  startDate: Date,
  endDate: Date,
  resourceName?: string;
  resourceLocation?: string;
  psrName?: string;
  psrType?: string;
  psrNominalPower?: string;
  psrNominalPowerUnit?: string;
  reasonCode?: string;
  reasonText?: string;
}
interface UnavailabilityDocument extends BaseDocument {
  timeseries: UnavailabilityEntry[];
}

/* NEW PARSING FUNCTIONS */
const ParsePeriod = (period: SourcePeriod) : Period => {

    // Extract start and end of whole period, then determine number of seconds of each interval
    const 
      baseDate = Date.parse(period.timeInterval.start),
      baseEndDate = Date.parse(period.timeInterval.end),
      periodLengthS = ISO8601DurToSec(period.resolution),
      periodLengthSSafe = periodLengthS || 1;

    // Prepare period object
    const outputPeriod : Period = {
      startDate: new Date(baseDate),
      endDate: new Date(baseEndDate),
      points: [],
      resolution: period.resolution,
      resolutionSeconds: periodLengthSSafe
    };
    
    const points : SourcePoint[] = Array.isArray(period.Point) ? period.Point : [period.Point];

    for (let i = 0; i < points.length; i++) {
      // Determine current position, and next position (if there is one)
      const 
        currentPos = points[i].position - 1,
        nextPos = points[i+1] ? points[i+1].position - 1 : undefined;

      // Add point to output, if there is no next position, use base end date for period as point end date
      const outputPoint : Point = {
        startDate: new Date(baseDate + (currentPos) * periodLengthSSafe * 1000),
        endDate: nextPos ? new Date(baseDate + nextPos * periodLengthSSafe * 1000) : new Date(baseEndDate),
        position: points[i].position
      }

      // Add quanitity or price, or both?
      if (points[i]["price.amount"]) {
        outputPoint.price = points[i]["price.amount"];
      }
      if (points[i].quantity) {
        outputPoint.quantity = points[i].quantity;
      }
      outputPeriod.points.push(outputPoint);
    }
    
    return outputPeriod;

};

const ParseBaseDocument = (d: SourceBaseDocument) : BaseDocument => {
  const document : BaseDocument = {
    mRID: d.mRID,
    revision: d.revisionNumber,
    created: d.createdDateTime ? new Date(Date.parse(d.createdDateTime)) : void 0,
    documentType: d.type,
    documentTypeDescription: d.type ? (DocumentType as Record<string,string>)[d.type] : void 0,
    processType: d["process.processType"],
    processTypeDescription: d["process.processType"] ? (ProcessType as Record<string,string>)[d["process.processType"]] : void 0,
  }
  return document;
};

const ParsePublication = (d: SourcePublicationDocument) : PublicationDocument => {
    
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Publication document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];
  
  const document : PublicationDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "publication",
    timeseries: []
  });

  for(const ts of tsArray) {
    const tsEntry : PublicationDocumentEntry = {
      currency: ts["currency_Unit.name"],
      unit: ts["price_Measure_Unit.name"],
      businessType: ts.businessType,
      businessTypeDescription: ts.businessType ? (BusinessType as Record<string,string>)[ts.businessType] : void 0,
      periods: []
    };
    const periodArray = Array.isArray(ts.Period) ? ts.Period : (ts.Period ? [ts.Period] : []);
    for(const inputPeriod of (periodArray as SourcePeriod[])) {
      tsEntry.periods.push(ParsePeriod(inputPeriod));
    }
    document.timeseries.push(tsEntry);
  }

  return document;
};
const ParseGL = (d: SourceGLDocument) : GLDocument => {
   
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("GL document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];
  
  const document : GLDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "gl",
    timeseries: []
  });

  for(const ts of tsArray) {
    const tsEntry : GLDocumentEntry = {
      outBiddingZone: ts["outBiddingZone_Domain.mRID"],
      inBiddingZone: ts["inBiddingZone_Domain.mRID"],
      mktPsrType: ts.MktPSRType?.psrType,
      businessType: ts.businessType,
      businessTypeDescription: ts.businessType ? (BusinessType as Record<string,string>)[ts.businessType] : void 0,
      mktPsrTypeDescription: ts.MktPSRType?.psrType ? (PsrType as Record<string,string>)[ts.MktPSRType?.psrType] : void 0,
      quantityMeasureUnit: ts["quantity_Measure_Unit.name"],
      periods: []
    };
    const periodArray = Array.isArray(ts.Period) ? ts.Period : (ts.Period ? [ts.Period] : []);
    for(const inputPeriod of (periodArray as SourcePeriod[])) {
      tsEntry.periods.push(ParsePeriod(inputPeriod));
    }
    document.timeseries.push(tsEntry);
  }
  return document;
};
const ParseUnavailability = (d: SourceUnavailabilityDocument) : UnavailabilityDocument => {
  
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Unavalibility document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  const document : UnavailabilityDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "unavailability",
    timeseries: []
  });

  for(const outage of tsArray) {
      
    let startDate;
    if (outage["start_DateAndOrTime.date"]) {
        if (outage["start_DateAndOrTime.time"]) {
            startDate = new Date(Date.parse(outage["start_DateAndOrTime.date"] + "T" + outage["start_DateAndOrTime.time"]));
        } else {
            startDate = new Date(Date.parse(outage["start_DateAndOrTime.date"] + "T00:00:00Z"));
        }
    }
    let endDate;
    if (outage["end_DateAndOrTime.date"]) {
        if (outage["end_DateAndOrTime.time"]) {
            endDate = new Date(Date.parse(outage["end_DateAndOrTime.date"] + "T" + outage["start_DateAndOrTime.time"]));
        } else {
            endDate = new Date(Date.parse(outage["end_DateAndOrTime.date"] + "T00:00:00Z"));
        }
    }

    const ts : UnavailabilityEntry = Object.assign(ParseBaseDocument(d),{
      startDate: startDate as Date,
      endDate: endDate as Date,
      rootType: "unavailability",
      resourceName: outage["production_RegisteredResource.name"],
      resourceLocation: outage["production_RegisteredResource.location.name"],
      businessType: outage.businessType,
      businessTypeDescription: outage.businessType ? (BusinessType as Record<string,string>)[outage.businessType] : void 0,
      psrName: outage["production_RegisteredResource.pSRType.powerSystemResources.name"],
      psrNominalPowerUnit: outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["@unit"] : void 0,
      psrNominalPower: outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["#text"] : "0",
      psrType: outage["production_RegisteredResource.pSRType.psrType"] ? (PsrType as Record<string,string>)[outage["production_RegisteredResource.pSRType.psrType"] as string] : void 0,
      reasonCode: outage.Reason?.code,
      reasonText: outage.Reason?.text,
      periods: []
    });
    const availablePeriodArray = Array.isArray(outage.Available_Period) ? outage.Available_Period : (outage.Available_Period ? [outage.Available_Period] : []);
    for(const avail of (availablePeriodArray as SourcePeriod[])) {
      ts.periods.push(ParsePeriod(avail));
    }
    document.timeseries.push(ts);
  }
  return document;
};

const ParseDocument = (xmlDocument: string): PublicationDocument | GLDocument | UnavailabilityDocument  => {

  // Parse XML
  const doc = parse(xmlDocument) as SourceDocument;

  // Check document type
  if (doc.Publication_MarketDocument) {
    return ParsePublication(doc.Publication_MarketDocument);

  } else if (doc.GL_MarketDocument) {
    return ParseGL(doc.GL_MarketDocument);
    
  } else if (doc.Unavailability_MarketDocument) {
    return ParseUnavailability(doc.Unavailability_MarketDocument);
    
  } else if (doc.Acknowledgement_MarketDocument) {
    const invalidRootNode = doc.Acknowledgement_MarketDocument;
    throw new Error(
      `Request failed. Code '${invalidRootNode.Reason.code}', Reason '${invalidRootNode.Reason.text}'`,
    );

  } else {
    throw new Error("Unknown XML document structure received");
  }

};

export type { PublicationDocument, UnavailabilityDocument, GLDocument }
export { ParseDocument };
