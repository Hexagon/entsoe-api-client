/**
 * entsoe-api-client
 *
 * @file Definition of all available Query parameters, commented with their source document equivalent.
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Definition of all available Query parameters, commented with their source document equivalent.
 *
 * @category Querying
 */
interface QueryParameters {
  /** DocumentType */
  documentType: string;

  /** ProcessType */
  processType?: string;

  /** BusinessType */
  businessType?: string;

  /** PsrType */
  psrType?: string;

  /** In_Domain */
  inDomain?: string;

  /** InBiddingZone_Domain */
  inBiddingZoneDomain?: string;

  /** BiddingZone_Domain */
  biddingZoneDomain?: string;

  /** Out_Domain */
  outDomain?: string;

  /** OutBiddingZone_Domain */
  outBiddingZoneDomain?: string;

  /** Combine with endDateTime to construct a TimeInterval */
  startDateTime?: Date;

  /** Combine with startDateTime to construct a TimeInterval  */
  endDateTime?: Date;

  /** Combine with endDateTimeUpdate to cnstruct a TimeIntervalUpdate */
  startDateTimeUpdate?: Date;

  /** Combine with startDateTimeUpdate to cnstruct a TimeIntervalUpdate */
  endDateTimeUpdate?: Date;

  /** Offset - Enables fetching more than X documents by using "pagination" */
  offset?: number;

  /** Implementation_DateAndOrTime, ISO8601 string */
  implementationDateAndOrTime?: string;

  /** Contract_MarketAgreement.Type */
  contractMarketAgreementType?: string;

  /** Auction.Type */
  auctionType?: string;

  /** Auction.Category */
  auctionCategory?: string;

  /** ClassificationSequence_AttributeInstanceComponent.Position */
  classificationSequenceAICPosition?: string;

  /** connecting_Domain */
  connectingDomain?: string;

  /** Standard_MarketProduct */
  standardMarketProduct?: string;

  /** Original_MarketProduct */
  originalMarketProduct?: string;

  /** registeredResource */
  registeredResource?: string;

  /** Acquiring_Domain */
  acquiringDomain?: string;

  /** mRID */
  mRID?: string;

  /** DocStatus */
  docStatus?: string;
}

export type { QueryParameters };
