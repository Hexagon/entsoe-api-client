/**
 * entsoe-api-client
 *
 * @file Interfaces and parsing functions for Acknowledgement_MarketDocument
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import { SourceBaseDocument, SourceReasonDetails } from "./common.ts";

/** Source Acknowledgement_MarketDocument, extending SourceBaseDocument
 *
 * @private
 * @category Source Document Interfaces
 */
interface SourceAcknowledmentDocument extends SourceBaseDocument {
  Reason: SourceReasonDetails;
}

export type { SourceAcknowledmentDocument };
