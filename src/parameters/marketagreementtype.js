/**
 * Enum for ENTSO-e Contract_MarketAgreement.Type and Type_MarketAgreement.Type with description
 * @readonly
 * @enum {string}
 */
const MarketAgreementType = {
	/** Daily */
	A01: "Daily",
	/** Weekly */
	A02: "Weekly",
	/** Monthly */
	A03: "Monthly",
	/** Yearly */
	A04: "Yearly",
	/** Total */
	A05: "Total",
	/** Long term */
	A06: "Long term",
	/** Intraday */
	A07: "Intraday",
	/** Hourly (Type_MarketAgreement.Type only) */
	A13: "Hourly (Type_MarketAgreement.Type only)"
};

export { MarketAgreementType }; 