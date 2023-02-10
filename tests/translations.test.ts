import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";

import { Area, AllAreas } from "../src/definitions/areas.ts";
import { DocumentType } from "../src/definitions/documenttypes.ts";
import { ProcessType } from "../src/definitions/processtypes.ts";
import { BusinessType } from "../src/definitions/businesstypes.ts";
import { PsrType } from "../src/definitions/psrtypes.ts";
import { AuctionType } from "../src/definitions/auctiontypes.ts";
import { AuctionCategory } from "../src/definitions/auctioncategories.ts";
import { Direction } from "../src/definitions/directions.ts";
import { DocStatus } from "../src/definitions/docstatuses.ts";
import { MarketAgreementType } from "../src/definitions/marketagreementtypes.ts";
import { MarketProduct } from "../src/definitions/marketproducts.ts";

Deno.test("Test area translation", () => {
    assertEquals(Area("Sweden (SE)"),"10YSE-1--------K");
    assertEquals(AllAreas("SE4"),["10Y1001A1001A47J","10Y1001C--00038X","10YDOM-PL-SE-LT2"]);
});
Deno.test("Test business type translation", () => {
    assertEquals(BusinessType("Offer"),"B74");
});
Deno.test("Test document type translation", () => {
    assertEquals(DocumentType("Congestion costs"),"A92");
});
Deno.test("Test Auction type translation", () => {
    assertEquals(AuctionType("Explicit"),"A02");
});
Deno.test("Test Auction category translation", () => {
    assertEquals(AuctionCategory("Hourly"),"A04");
});
Deno.test("Test Direction translation", () => {
    assertEquals(Direction("Up"),"A01");
});
Deno.test("Test DocStatus translation", () => {
    assertEquals(DocStatus("Withdrawn"),"A13");
});
Deno.test("Test MarketAgreementType translation", () => {
    assertEquals(MarketAgreementType("Intraday"),"A07");
});
Deno.test("Test MarketProduct translation", () => {
    assertEquals(MarketProduct("Standard mFRR SA+DA"),"A07");
});