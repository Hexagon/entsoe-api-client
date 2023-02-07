/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for Acknowledgement_MarketDocument
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import { SourceBaseDocument, SourceReasonDetails } from "./common.ts";

/** Spefifics for source Acknowledgement_MarketDocument, extending SourceBaseDocument */
interface SourceAcknowledmentDocument extends SourceBaseDocument {
  Reason: SourceReasonDetails;
}

export type { SourceAcknowledmentDocument };
