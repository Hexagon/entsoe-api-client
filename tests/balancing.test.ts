import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { BalancingDocument, ParseDocument } from "../src/documents.ts";

Deno.test("Test parsing of Balancing", async function (t) {
  const xml = await Deno.readTextFile("./tests/data/balancing.xml");
  await t.step("Parse", async (t) => {
    const result: BalancingDocument = ParseDocument(xml);
    assertEquals(result.rootType, "balancing");
    await t.step("mRID", async (t) => {
      await assertEquals(result.mRID, "b1d14ca32fe24ff19a4e9b5730bbc396");
    });
    await t.step("Document creation time is Date object and correct", async (t) => {
      assertEquals(result.created?.getTime(), 1577367100000);
    });
    await t.step("Document type (and description)", async (t) => {
      assertEquals(result.documentType, "A86");
      assertEquals(result.documentTypeDescription, "Imbalance volume");
    });
    await t.step("Document Revision", async (t) => {
      assertEquals(result.revision, 1);
    });
    await t.step("Document timeInterval", async (t) => {
      assertEquals(result.timeInterval?.start.toISOString(), "2019-12-19T00:00:00.000Z");
      assertEquals(result.timeInterval?.end.toISOString(), "2019-12-19T00:10:00.000Z");
    });
    await t.step("Document ts flowDirection", async (t) => {
      assertEquals(result.timeseries[0].flowDirection, "A02");
    });
    await t.step("Document ts businessType", async (t) => {
      assertEquals(result.timeseries[0].businessType, "B33");
      assertEquals(result.timeseries[0].businessTypeDescription, "Area Control Error");
    });
    await t.step("Document ts curveType", async (t) => {
      assertEquals(result.timeseries[0].curveType, "A01");
    });
    await t.step("Document ts quantityMeasureUnit", async (t) => {
      assertEquals(result.timeseries[0].quantityMeasureUnit, "MAW");
    });
  });
});
