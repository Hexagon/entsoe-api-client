import { parse } from "https://deno.land/x/xml@2.0.4/mod.ts";
import { PsrType } from "./parameters/psrtype.js";
import { BusinessType } from "./parameters/businesstype.js";
import { ProcessType } from "./parameters/processtype.js";

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
  businessType?: string;
}

// --- Acknowledment Document
interface SourceAcknowledmentDocument extends SourceBaseDocument {
  Reason: SourceReasonDetails;
}

// --- Publication Document
interface SourcePublicationEntry {
  Period: SourcePeriod;
  "outBiddingZone_Domain.mRID"?: string;
  "inBiddingZone_Domain.mRID"?: string;
  MktPSRType?: SourcePsrType;
}

interface SourcePublicationDocument extends SourceBaseDocument {
  TimeSeries: SourcePublicationEntry[] | SourcePublicationEntry;
}

// --- GL Document
interface SourceGLEntry {
}
interface SourceGLDocument extends SourceBaseDocument {
  TimeSeries: SourceGLEntry[] | SourceGLEntry;
}

// --- UnavailabilityDocument
interface SourceUnavailabilityEntry extends SourceBaseDocument {
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
  position: number;
  price?: number;
  quantity?: number;
}

interface Period {
  startDate: Date,
  endDate: Date,
  points: Point[];
  resolution: string;
}

interface BaseDocument {
  mRID: string;
  revision: number;
  created?: Date;
  documentType: string;
  documentTypeDescription: string;
  processType?: string;
  processTypeDescription?: string;
  businessType?: string;
  businessTypeDescription?: string;
}

interface PublicationDocumentEntry {
  outBiddingZone?: string;
  inBiddingZone?: string;
  mktPsrType?: string;
  period: Period[];
}
interface PublicationDocument extends BaseDocument {
  timeseries: PublicationDocumentEntry[];
}

interface GLDocument extends BaseDocument {
  
}

interface UnavailabilityDocument extends BaseDocument {
  startDate: Date,
  endDate: Date,
  businessType?: string;
  resourceName?: string;
  resourceLocation?: string;
  psrName?: string;
  psrType?: string;
  psrNominalPower?: string;
  psrNominalPowerUnit?: string;
  reasonCode?: string;
  reasonText?: string;
  available: Period[];
}

/* NEW PARSING FUNCTIONS */

const ParseBaseDocument = (d: SourceBaseDocument) : BaseDocument => {
  const document : BaseDocument = {
    mRID: d.mRID,
    revision: d.revisionNumber,
    created: d.createdDateTime ? new Date(Date.parse(d.createdDateTime)) : void 0,
    documentType: d.type,
    documentTypeDescription: d.type ? DocumentType[d.type] : void 0,
    processType: d["process.processType"],
    processTypeDescription: d["process.processType"] ? ProcessType[d["process.processType"]] : void 0,
    businessType: d.businessType,
    businessTypeDescription: d.businessType ? BusinessType[d.businessType] : void 0
  }
  return document;
};

const ParsePublication = (d: SourcePublicationDocument) : PublicationDocument => {
    
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Unavalibility document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];
  
  const document : PublicationDocument = Object.assign(ParseBaseDocument(d), {
    timeseries: []
  });

  for(const ts of tsArray) {
    const tsPeriod : Period = {
      startDate: new Date(Date.parse(ts.Period.timeInterval.start)),
      endDate: new Date(Date.parse(ts.Period.timeInterval.end)),
      resolution: ts.Period.resolution,
      points: []
    }
    const tsEntry = {
      outBiddingZone: ts["outBiddingZone_Domain.mRID"],
      inBiddingZone: ts["inBiddingZone_Domain.mRID"],
      mktPsrType: ts.MktPSRType?.psrType,
      period: tsPeriod
    };
    const points : SourcePoint[] = Array.isArray(ts.Period.Point) ? ts.Period.Point : [ts.Period.Point];
    for(const p of ts.Period.Point) {
      tsEntry.period.points.push({
        position: p.position,
        price: p["price.amount"]
      })
    }

  }

  return document;
};
const ParseGL = (d: SourceGLDocument) : GLDocument => {
   
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Unavalibility document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];
  
  const document : GLDocument = Object.assign(ParseBaseDocument(d), {
    timeseries: []
  });

  for(const ts of tsArray) {
    const tsPeriod : Period = {
      startDate: new Date(Date.parse(ts.Period.timeInterval.start)),
      endDate: new Date(Date.parse(ts.Period.timeInterval.end)),
      resolution: ts.Period.resolution,
      points: []
    }
    const tsEntry = {
      outBiddingZone: ts["outBiddingZone_Domain.mRID"],
      inBiddingZone: ts["inBiddingZone_Domain.mRID"],
      mktPsrType: ts.MktPSRType?.psrType,
      period: tsPeriod
    };
    const points : SourcePoint[] = Array.isArray(ts.Period.Point) ? ts.Period.Point : [ts.Period.Point];
    for(const p of ts.Period.Point) {
      tsEntry.period.points.push({
        position: p.position,
        price: p["price.amount"]
      })
    }
  }

  return document;
};
const ParseUnavailability = (d: SourceUnavailabilityDocument) : UnavailabilityDocument => {
  
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Unavalibility document invalid, missing TimeSeries");
  }
  if (Array.isArray(d.TimeSeries) && d.TimeSeries.length > 1) {
    throw new Error("Unavalibility document invalid, only one TimeSeries expected");
  }

  const outage = Array.isArray(d.TimeSeries) ? d.TimeSeries[0] : d.TimeSeries;

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

  const document : UnavailabilityDocument = Object.assign(ParseBaseDocument(d),{
    startDate,
    endDate,
    resourceName: outage["production_RegisteredResource.name"],
    resourceLocation: outage["production_RegisteredResource.location.name"],
    psrName: outage["production_RegisteredResource.pSRType.powerSystemResources.name"],
    psrNominalPowerUnit: outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["@unit"] : void 0,
    psrNominalPower: outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["#text"] : "0",
    psrType: outage["production_RegisteredResource.pSRType.psrType"] ? (PsrType as Record<string,string>)[outage["production_RegisteredResource.pSRType.psrType"] as string] : void 0,
    reasonCode: outage.Reason?.code,
    reasonText: outage.Reason?.text,
    available: []
  });

  const availablePeriodArray = Array.isArray(outage.Available_Period) ? outage.Available_Period : (outage.Available_Period ? [outage.Available_Period] : []);
  for(const avail of (availablePeriodArray as SourcePeriod[])) {

    const availablePeriodEntry: Period = {
      startDate: new Date(Date.parse(avail.timeInterval.start)),
      endDate: new Date(Date.parse(avail.timeInterval.end)),
      points: [],
      resolution: avail.resolution
    };

    const points : SourcePoint[] = Array.isArray(avail.Point) ? avail.Point : [avail.Point];
    for(const point of points) {
        availablePeriodEntry.points.push({
          position: point.position,
          quantity: point.quantity
        });
    }

    document.available.push(availablePeriodEntry);

  }

  return document;
};

const ParseDocument = (xmlDocument: string): PublicationDocument | GLDocument | UnavailabilityDocument | undefined  => {

  // Parse XML
  const doc : SourceDocument = parse(xmlDocument);

  // Check document type
  if (doc.Publication_MarketDocument) {
    return ParsePublication(doc.Publication_MarketDocument);

  } else if (doc.GL_MarketDocument) {
    return ParseGL(doc.GL_MarketDocument);
    return undefined;
    
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

export { ParseDocument };
