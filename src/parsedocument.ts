/**
 * entsoe-api-client
 * 
 * @file Functions to parse and validade raw ENTSO-e documents to nice objects
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

import { XMLParser } from "../deps.ts";
import { PsrType } from "./parameters/psrtype.js";
import { BusinessType } from "./parameters/businesstype.js";
import { ProcessType } from "./parameters/processtype.js";
import { DocumentType } from "./parameters/documenttype.js";
import { ISO8601DurToSec } from "./duration.ts";

/* ------------------------------------------------------------------------------------
 * All interfaces below this point (until next dashed note) is related to 
 * source documents, e.g. the raw parsed xml from ENTSO-e
 * ------------------------------------------------------------------------------------ */

/** Root node of source documents */
interface SourceDocument {
  Publication_MarketDocument?: SourcePublicationDocument;
  GL_MarketDocument?: SourceGLDocument;
  Unavailability_MarketDocument?: SourceUnavailabilityDocument;
  Acknowledgement_MarketDocument?: SourceAcknowledmentDocument;
  Configuration_MarketDocument?: SourceConfigurationDocument;
}

/** Generic sections of a source document */
interface SourceReasonDetails {
  code: string;
  text: string;
}
interface SourcePsrType {
  psrType: string;
  "production_PowerSystemResources.highVoltageLimit"?: SourceUnitTextEntry;
  "nominalIP_PowerSystemResources.nominalP"?: SourceUnitTextEntry;
}
interface SourceUnitTextEntry {
  "@unit": string;
  "#text": string;
}
interface SourceCodingSchemeTextEntry {
  "@codingScheme": string;
  "#text": string;
}
interface MRIDEntry {
  mRID: SourceCodingSchemeTextEntry
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

/** Common base for source documents (below root node) */
interface SourceBaseDocument {
  mRID: string;
  revisionNumber?: number;
  createdDateTime?: string;
  type: string;
  "process.processType"?: string;
}

/** Spefifics for source Acknowledgement_MarketDocument, extending SourceBaseDocument */
interface SourceAcknowledmentDocument extends SourceBaseDocument {
  Reason: SourceReasonDetails;
}

/** Spefifics for source Publication_MarketDocument, extending SourceBaseDocument */
interface SourcePublicationDocument extends SourceBaseDocument {
  TimeSeries: SourcePublicationEntry[] | SourcePublicationEntry;
}

interface SourcePublicationEntry {
  Period: SourcePeriod | SourcePeriod[];
  businessType?: string;
  "price_Measure_Unit.name"?: string,
  "currency_Unit.name"?: string,
}

/** Spefifics for source GL_MarketDocument, extending SourceBaseDocument */
interface SourceGLDocument extends SourceBaseDocument {
  TimeSeries: SourceGLEntry[] | SourceGLEntry;
}

interface SourceGLEntry {
  "outBiddingZone_Domain.mRID"?: unknown;
  "inBiddingZone_Domain.mRID"?: unknown;
  "quantity_Measure_Unit.name"?: string;
  businessType?: string;
  MktPSRType?: SourcePsrType;
  Period: SourcePeriod | SourcePeriod[];
}

/** Spefifics for source Unavailability_MarketDocument, extending SourceBaseDocument */
interface SourceUnavailabilityDocument extends SourceBaseDocument {
  TimeSeries: SourceUnavailabilityEntry[] | SourceUnavailabilityEntry;
}
interface SourceUnavailabilityEntry extends SourceBaseDocument {
  businessType?: string;
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

/** Spefifics for source Configuration_MarketDocument, extending SourceBaseDocument */
interface SourceConfigurationDocument extends SourceBaseDocument {
  "sender_MarketParticipant.mRID"?: SourceCodingSchemeTextEntry;
  "sender_MarketParticipant.marketRole.type"?: string;
  "receiver_MarketParticipant.mRID"?: SourceCodingSchemeTextEntry;
  "receiver_MarketParticipant.marketRole.type"?: string;
  TimeSeries: SourceConfigurationEntry[] | SourceConfigurationEntry;
}
interface SourceGeneratingUnit {
  mRID?: SourceCodingSchemeTextEntry,
  name?: string,
  nominalP?: SourceUnitTextEntry,
  "generatingUnit_PSRType.psrType"?: string,
  "generatingUnit_Location.name"?: string
}
interface SourceConfigurationEntry extends SourceBaseDocument {
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

/* ------------------------------------------------------------------------------------
 * All interfaces below this point (until next dashed note) is related to 
 * output documents, e.g. the cleaned and validated output objects generated by parsing
 * input.
 * ------------------------------------------------------------------------------------ */

/** Common sections of output/parsed document */
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
  revision?: number;
  rootType?: "configuration" | "gl" | "unavailability" | "publication";
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
  periods?: Period[];
}

/** Specifics for parsed Publication document */
interface PublicationDocument extends BaseDocument {
  timeseries: PublicationDocumentEntry[];
}

interface PublicationDocumentEntry extends BaseEntry {
  currency?: string,
  unit?: string,
}

/** Specifics for parsed GL document */
interface GLDocument extends BaseDocument {
  timeseries: GLDocumentEntry[];
}
interface GLDocumentEntry extends BaseEntry {
  mktPsrType?: string;
  mktPsrTypeDescription?: string;
  outBiddingZone?: unknown;
  inBiddingZone?: unknown;
  quantityMeasureUnit?: string;
}

/** Specifics for parsed Unavailability document */
interface UnavailabilityDocument extends BaseDocument {
  timeseries: UnavailabilityEntry[];
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

/** Specifics for parsed Configuration document */
interface ConfigurationDocument extends BaseDocument {
  senderMarketParticipantId?: string;
  senderMarketParticipantRoleType?: string;
  receiverMarketParticipantId?: string;
  receiverMarketParticipantRoleType?: string;
  timeseries: ConfigurationEntry[];
}
interface GeneratingUnit {
  id?: string,
  name?: string,
  nominalPower?: string,
  nominalPowerUnit?: string,
  psrType?: string,
  locationName?: string
}
interface ConfigurationEntry extends BaseEntry {
  implementationDate?: Date,
  biddingZoneDomain?: string,
  businessType?: string,
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

/* ------------------------------------------------------------------------------------
 * Below this point is all functions related to parsing/validating source documents
 * ------------------------------------------------------------------------------------ */

/**
 * Internal helper function to parse a Period-section of a source document, common to all source document types
 * 
 * @private
 * 
 * @param period - Period section from a source XML document represented by an object
 * @returns - Parsed and validated Period object
 */
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

/**
 * Parses the common features below the root node of any source document
 * 
 * @private
 * 
 * @param d - The common features below the root node of any source document represented by an object
 * @returns - Parsed base document
 */
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

/**
 * Parses everything below to the root node of a source Publication_MarketDocument
 * 
 * @private
 * 
 * @param d - Everything below to the root node of a source Publication_MarketDocument
 * 
 * @returns - Typed, cleaned and validated publication document
 */
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
      tsEntry.periods?.push(ParsePeriod(inputPeriod));
    }
    document.timeseries.push(tsEntry);
  }

  return document;
};

/**
 * Parses everything below to the root node of a source GL_MarketDocument
 * 
 * @private
 * 
 * @param d - Everything below to the root node of a source GL_MarketDocument
 * 
 * @returns - Typed, cleaned and validated GL document
 */
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
      tsEntry.periods?.push(ParsePeriod(inputPeriod));
    }
    document.timeseries.push(tsEntry);
  }
  return document;
};

/**
 * Parses everything below to the root node of a source Unavailability_MarketDocument
 * 
 * @private
 * 
 * @param d - Everything below to the root node of a source Unavailability_MarketDocument
 * 
 * @returns - Typed, cleaned and validated Unavailability document
 */
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
      ts.periods?.push(ParsePeriod(avail));
    }
    document.timeseries.push(ts);
  }
  return document;
};

/**
 * Parses everything below to the root node of a source Configuration_MarketDocument
 * 
 * @private
 * 
 * @param d - Everything below to the root node of a source Configuration_MarketDocument
 * 
 * @returns - Typed, cleaned and validated Unavailability document
 */
const ParseConfiguration = (d: SourceConfigurationDocument) : ConfigurationDocument => {
  
  // Check that TimeSeries is ok
  if (!d.TimeSeries) {
    throw new Error("Unavalibility document invalid, missing TimeSeries");
  }

  const tsArray = Array.isArray(d.TimeSeries) ? d.TimeSeries : [d.TimeSeries];

  const document : ConfigurationDocument = Object.assign(ParseBaseDocument(d), {
    rootType: "configuration",  
    senderMarketParticipantId: d["sender_MarketParticipant.mRID"]?.["#text"],
    senderMarketParticipantRoleType: d["sender_MarketParticipant.marketRole.type"],
    receiverMarketParticipantId: d["receiver_MarketParticipant.mRID"]?.["#text"],
    receiverMarketParticipantRoleType: d["receiver_MarketParticipant.marketRole.type"],
    timeseries: []
  });

  for(const configuration of tsArray) {
      
    let implementationDate;
    if (configuration["implementation_DateAndOrTime.date"]) {
        if (configuration["implementation_DateAndOrTime.time"]) {
          implementationDate = new Date(Date.parse(configuration["implementation_DateAndOrTime.date"] + "T" + configuration["implementation_DateAndOrTime.time"]));
        } else {
          implementationDate = new Date(Date.parse(configuration["implementation_DateAndOrTime.date"] + "T00:00:00Z"));
        }
    }
    const ts : ConfigurationEntry = Object.assign(ParseBaseDocument(d),{
      implementationDate,
      businessType: configuration.businessType,
      businessTypeDescription: configuration.businessType ? (BusinessType as Record<string,string>)[configuration.businessType] : void 0,
      biddingZoneDomain: configuration["biddingZone_Domain.mRID"]?.["#text"],
      registeredResourceId: configuration["registeredResource.mRID"]?.["#text"],
      registeredResourceName: configuration["registeredResource.name"],
      registeredResourceLocation: configuration["registeredResource.location.name"],
      controlAreaDomain: configuration.ControlArea_Domain?.mRID?.["#text"],
      providerMarketParticipant: configuration["Provider_MarketParticipant"]?.mRID?.["#text"],
      psrType: configuration.MktPSRType?.psrType,
      psrHighvoltageLimit: configuration.MktPSRType?.["production_PowerSystemResources.highVoltageLimit"]?.["#text"],
      psrHighvoltageLimitUnit: configuration.MktPSRType?.["production_PowerSystemResources.highVoltageLimit"]?.["@unit"],
      psrNominalPower: configuration.MktPSRType?.["nominalIP_PowerSystemResources.nominalP"]?.["#text"],
      psrNominalPowerUnit: configuration.MktPSRType?.["nominalIP_PowerSystemResources.nominalP"]?.["@unit"],
      generatingUnit: []
    });
    if (configuration.GeneratingUnit_PowerSystemResources?.length) for(const gu of configuration.GeneratingUnit_PowerSystemResources) {
      const guResult = {
        nominalPower: gu.nominalP?.["#text"],
        nominalPowerUnit: gu.nominalP?.["@unit"],
        name: gu.name,
        locationName: gu["generatingUnit_Location.name"],
        psrType: gu["generatingUnit_PSRType.psrType"],
        id: gu.mRID?.["#text"]
      };
      ts.generatingUnit?.push(guResult);
    }
    document.timeseries.push(ts);
  }
  return document;
};

/**
 * Takes a full source document from ENTSO-e Rest API, checks the document type, parses using
 * the appropiate parser, ant returns a typed and cleaned object representing the document.
 * 
 * Mainly intended to be used internally in this library by the `Query` function.
 * 
 * @param d - Everything below to the root node of a unknown source document
 * 
 * @returns - Typed, cleaned and validated document
 */
const ParseDocument = (xmlDocument: string): PublicationDocument | GLDocument | UnavailabilityDocument  => {

  // Parse XML
  const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix : "@"
  });
  const doc = parser.parse(xmlDocument) as SourceDocument;

  // Check document type
  if (doc.Publication_MarketDocument) {
    return ParsePublication(doc.Publication_MarketDocument);

  } else if (doc.GL_MarketDocument) {
    return ParseGL(doc.GL_MarketDocument);
    
  } else if (doc.Unavailability_MarketDocument) {
    return ParseUnavailability(doc.Unavailability_MarketDocument);

  } else if (doc.Configuration_MarketDocument) {
    return ParseConfiguration(doc.Configuration_MarketDocument);
    
  } else if (doc.Acknowledgement_MarketDocument) {
    const invalidRootNode = doc.Acknowledgement_MarketDocument;
    throw new Error(
      `Request failed. Code '${invalidRootNode.Reason.code}', Reason '${invalidRootNode.Reason.text}'`,
    );

  } else {
    throw new Error("Unknown XML document structure received");
  }

};

export type { PublicationDocument, UnavailabilityDocument, GLDocument, ConfigurationDocument }
export { ParseDocument };
