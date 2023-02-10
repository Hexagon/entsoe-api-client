/**
 * entsoe-api-client
 *
 * @file Common interfaces and parsing functions for all document types
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import { SourceAcknowledmentDocument } from "./acknowledgement.ts";
import { SourceConfigurationDocument } from "./configuration.ts";
import { SourceGLDocument } from "./gl.ts";
import { SourcePublicationDocument } from "./publication.ts";
import { SourceUnavailabilityDocument } from "./unavailability.ts";
import { DocumentType } from "../definitions/documenttype.js";
import { ISO8601DurToSec } from "../helpers/duration.ts";
import { ProcessType } from "../definitions/processtype.js";
import { SourceTransmissionNetworkDocument } from "./transmittionnetwork.ts";
import { SourceBalancingDocument } from "./balancing.ts";
import { SourceCriticalNetworkElementDocument } from "./criticalnetworkelement.ts";

/** Root node of source documents */
interface SourceGeneratingUnit {
  mRID?: SourceCodingSchemeTextEntry;
  name?: string;
  nominalP?: SourceUnitTextEntry;
  "generatingUnit_PSRType.psrType"?: string;
  "generatingUnit_Location.name"?: string;
}

interface SourceDocument {
  Publication_MarketDocument?: SourcePublicationDocument;
  GL_MarketDocument?: SourceGLDocument;
  Unavailability_MarketDocument?: SourceUnavailabilityDocument;
  Acknowledgement_MarketDocument?: SourceAcknowledmentDocument;
  Configuration_MarketDocument?: SourceConfigurationDocument;
  TransmissionNetwork_MarketDocument?: SourceTransmissionNetworkDocument;
  Balancing_MarketDocument: SourceBalancingDocument;
  CriticalNetworkElement_MarketDocument: SourceCriticalNetworkElementDocument;
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
  mRID: SourceCodingSchemeTextEntry;
}
interface SourceTimeInterval {
  start: string;
  end: string;
}
interface SourcePoint {
  position: number;
  "price.amount"?: number;
  quantity?: number;
  "Constraint_TimeSeries"?: unknown;
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
  "sender_MarketParticipant.mRID"?: SourceCodingSchemeTextEntry;
  "sender_MarketParticipant.marketRole.type"?: string;
  "receiver_MarketParticipant.mRID"?: SourceCodingSchemeTextEntry;
  "receiver_MarketParticipant.marketRole.type"?: string;
}

/** Common sections of output/parsed document */
interface GeneratingUnit {
  id?: string;
  name?: string;
  nominalPower?: string;
  nominalPowerUnit?: string;
  psrType?: string;
  locationName?: string;
}

interface TimeInterval {
  start: Date;
  end: Date;
}
interface Point {
  startDate: Date;
  endDate: Date;
  position: number;
  price?: number;
  quantity?: number;
  constraintTimeSeries?: unknown;
}

interface Period {
  startDate: Date;
  endDate: Date;
  points: Point[];
  resolution: string;
  resolutionSeconds?: number;
}

interface BaseDocument {
  mRID: string;
  revision?: number;
  rootType?: "configuration" | "gl" | "unavailability" | "publication" | "balancing" | "criticalnetworkelement" | "transmissionnetwork";
  created?: Date;
  documentType: string;
  documentTypeDescription?: string;
  processType?: string;
  processTypeDescription?: string;
  businessType?: string;
  businessTypeDescription?: string;
  senderMarketParticipantId?: string;
  senderMarketParticipantRoleType?: string;
  receiverMarketParticipantId?: string;
  receiverMarketParticipantRoleType?: string;
  timeInterval?: TimeInterval;
}

interface BaseEntry {
  businessType?: string;
  businessTypeDescription?: string;
  periods?: Period[];
}

/**
 * Internal helper function to parse a Period-section of a source document, common to all source document types
 *
 * @private
 * @category Parsing
 *
 * @param period - Period section from a source XML document represented by an object
 * @returns - Parsed and validated Period object
 */
const ParsePeriod = (period: SourcePeriod): Period => {
  // Extract start and end of whole period, then determine number of seconds of each interval
  const baseDate = Date.parse(period.timeInterval.start),
    baseEndDate = Date.parse(period.timeInterval.end),
    periodLengthS = ISO8601DurToSec(period.resolution),
    periodLengthSSafe = periodLengthS || 1;

  // Prepare period object
  const outputPeriod: Period = {
    startDate: new Date(baseDate),
    endDate: new Date(baseEndDate),
    points: [],
    resolution: period.resolution,
    resolutionSeconds: periodLengthSSafe,
  };

  const points: SourcePoint[] = Array.isArray(period.Point) ? period.Point : [period.Point];

  for (let i = 0; i < points.length; i++) {
    // Determine current position, and next position (if there is one)
    const currentPos = points[i].position - 1,
      nextPos = points[i + 1] ? points[i + 1].position - 1 : undefined;

    // Add point to output, if there is no next position, use base end date for period as point end date
    const outputPoint: Point = {
      startDate: new Date(baseDate + (currentPos) * periodLengthSSafe * 1000),
      endDate: nextPos ? new Date(baseDate + nextPos * periodLengthSSafe * 1000) : new Date(baseEndDate),
      position: points[i].position,
      constraintTimeSeries: points[i].Constraint_TimeSeries,
    };

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
 * @category Parsing
 *
 * @param d - The common features below the root node of any source document represented by an object
 * @returns - Parsed base document
 */
const ParseBaseDocument = (d: SourceBaseDocument): BaseDocument => {
  const document: BaseDocument = {
    mRID: d.mRID,
    revision: d.revisionNumber,
    created: d.createdDateTime ? new Date(Date.parse(d.createdDateTime)) : void 0,
    documentType: d.type,
    documentTypeDescription: d.type ? (DocumentType as Record<string, string>)[d.type] : void 0,
    processType: d["process.processType"],
    processTypeDescription: d["process.processType"] ? (ProcessType as Record<string, string>)[d["process.processType"]] : void 0,
    senderMarketParticipantId: d["sender_MarketParticipant.mRID"]?.["#text"],
    senderMarketParticipantRoleType: d["sender_MarketParticipant.marketRole.type"],
    receiverMarketParticipantId: d["receiver_MarketParticipant.mRID"]?.["#text"],
    receiverMarketParticipantRoleType: d["receiver_MarketParticipant.marketRole.type"],
  };
  return document;
};

export type {
  SourceBaseDocument,
  SourceCodingSchemeTextEntry,
  SourceDocument,
  SourceGeneratingUnit,
  SourcePeriod,
  SourcePoint,
  SourcePsrType,
  SourceReasonDetails,
  SourceTimeInterval,
  SourceUnitTextEntry,
};

export type { BaseDocument, BaseEntry, GeneratingUnit, MRIDEntry, Period, Point, TimeInterval };

export { ParseBaseDocument, ParsePeriod };
