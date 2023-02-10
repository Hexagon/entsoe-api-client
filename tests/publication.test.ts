import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ParseDocument, PublicationDocument } from "../src/documents.ts";

Deno.test("Test parsing of Publication, and root document feaures", async function (t) {
  const xml = await Deno.readTextFile("./tests/data/publication.explicitallocations.xml");
  await t.step("Parse", async (t) => {
    const result: PublicationDocument = ParseDocument(xml);
    assertEquals(result.rootType, "publication");
    await t.step("mRID", async (t) => {
      await assertEquals(result.mRID, "aa7484cb0aaf40fabad9134d2d59aa4e");
    });
    await t.step("Document creation time is Date object and correct", async (t) => {
      assertEquals(result.created?.getTime(), 1456822565000);
    });
    await t.step("Document type (and description)", async (t) => {
      assertEquals(result.documentType, "A25");
      assertEquals(result.documentTypeDescription, "Allocation result document");
    });
    await t.step("Document Revision", async (t) => {
      assertEquals(result.revision, 2);
    });
    await t.step("Document timeInterval", async (t) => {
      assertEquals(result.timeInterval?.start.toISOString(), "2016-01-01T23:00:00.000Z");
      assertEquals(result.timeInterval?.end.toISOString(), "2016-01-02T23:00:00.000Z");
    });
    await t.step("Document ts inDomain", async (t) => {
      assertEquals(result.timeseries[0].inDomain, "10YSK-SEPS-----K");
    });
    await t.step("Document ts outDomain", async (t) => {
      assertEquals(result.timeseries[0].outDomain, "10YCZ-CEPS-----N");
    });
    await t.step("Document ts auctionId", async (t) => {
      assertEquals(result.timeseries[0].auctionId, "CP_A_Base1_SK-CZ");
    });
    await t.step("Document ts auctionType", async (t) => {
      assertEquals(result.timeseries[0].auctionType, "A02");
    });
    await t.step("Document ts auctionCategory", async (t) => {
      assertEquals(result.timeseries[0].auctionCategory, "A01");
    });
    await t.step("Document ts businessType", async (t) => {
      assertEquals(result.timeseries[0].businessType, "A43");
      assertEquals(result.timeseries[0].businessTypeDescription, "Requested capacity (without price)");
    });
    await t.step("Document ts contractMarketAgreementType", async (t) => {
      assertEquals(result.timeseries[0].contractMarketAgreementType, "A01");
    });
    await t.step("Document ts curveType", async (t) => {
      assertEquals(result.timeseries[0].curveType, "A01");
    });
    await t.step("Document ts classificationSequenceAICPosition", async (t) => {
      assertEquals(result.timeseries[0].classificationSequenceAICPosition, 1);
    });
    await t.step("Document ts priceMeasureUnit", async (t) => {
      assertEquals(result.timeseries[0].priceMeasureUnit, "MWH");
    });
    await t.step("Document ts quantityMeasureUnit", async (t) => {
      assertEquals(result.timeseries[0].quantityMeasureUnit, "MAW");
    });
  });
});
