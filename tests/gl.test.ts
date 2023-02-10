import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { GLDocument, ParseDocument } from "../src/documents.ts";

Deno.test("Test parsing of GLDocument", async function (t) {
  const xml = await Deno.readTextFile("./tests/data/gl.load.singlepoint.xml");
  const result = ParseDocument(xml) as GLDocument;
  assertEquals(result.rootType, "gl");
  await t.step("Document type, with description", async () => {
    assertEquals(result.documentType, "A65");
    assertEquals(result.documentTypeDescription, "System total load");
  });
  await t.step("Business type, with description", async () => {
    assertEquals(result.timeseries[0].businessType, "A04");
    assertEquals(result.timeseries[0].businessTypeDescription, undefined); // As long as there is no description for A04 in businesstype.js
  });
  await t.step("outBiddingZone", async () => {
    assertEquals(result.timeseries[0].outBiddingZone, "10YCZ-CEPS-----N"); // For now, outBiddingZone is expected to be a unknown object
  });
  await t.step("timeInterval", async (t) => {
    assertEquals(result.timeInterval?.start.toISOString(), "2015-12-31T23:00:00.000Z");
    assertEquals(result.timeInterval?.end.toISOString(), "2016-12-31T23:00:00.000Z");
  });
});
