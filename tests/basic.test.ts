import { assertEquals, assertThrows } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { GLDocument, ParseDocument } from "../src/parsedocument.ts";

Deno.test("Test parsing of Publication, and root document feaures", async function (t) {
  const xml = await Deno.readTextFile("./tests/data/publication.explicitallocations.xml");
  await t.step("Parse", async (t) => {
    const result = ParseDocument(xml);
    assertEquals(result.rootType, "publication");
    await t.step("mRID", async (t) => {
      assertEquals(result.mRID, "aa7484cb0aaf40fabad9134d2d59aa4e");
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
  });
});

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
    assertEquals(typeof result.timeseries[0].outBiddingZone, "object"); // For now, outBiddingZone is expected to be a unknown object
  });
});

Deno.test(
  "Unavalability document (and combinations of single/multiple ts/periods)",
  async function (t) {
    const xml = await Deno.readTextFile("./tests/data/unavailability.consumption.xml");
    await t.step("Parse", async (t) => {
      const result = ParseDocument(xml);
      await t.step("rootType is correct", async () => {
        assertEquals(result.rootType, "unavailability");
      });
      await t.step("processType", async () => {
        assertEquals(result.processType, "A26");
        assertEquals(result.processTypeDescription, undefined); // Expected to be undefined as processType=A26 is not defined in parameters/processtype.js
      });
      await t.step("Multiple timeseries", async () => {
        assertEquals(result.timeseries.length, 2);
      });
      await t.step("businessType of TS", async () => {
        assertEquals(result.timeseries[0].businessType, "A53");
        assertEquals(result.timeseries[0].businessTypeDescription, "Planned maintenance");
      });
      await t.step("TS with single period", async () => {
        assertEquals(result.timeseries[0].periods.length, 1);
      });
      await t.step("Period start and end date parsed correctly", async () => {
        assertEquals(
          result.timeseries[0].periods[0].points[0].startDate.toISOString(),
          "2015-09-19T22:00:00.000Z",
        );
        assertEquals(
          result.timeseries[0].periods[0].points[0].endDate.toISOString(),
          "2015-09-20T18:00:00.000Z",
        );
      });
      await t.step("Single point start and end date matches period", async () => {
        assertEquals(
          result.timeseries[0].periods[0].points[0].startDate,
          result.timeseries[0].periods[0].startDate,
        );
        assertEquals(
          result.timeseries[0].periods[0].points[0].endDate,
          result.timeseries[0].periods[0].endDate,
        );
      });
      await t.step("Skipped periods are handled correctly", async () => {
        assertEquals(
          result.timeseries[1].periods[0].points[0].startDate,
          result.timeseries[1].periods[0].startDate,
        );
        assertEquals(
          result.timeseries[1].periods[0].points[0].startDate.toISOString(),
          "2015-09-19T22:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods[0].points[0].endDate.toISOString(),
          "2015-09-20T01:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods[0].points[1].startDate.toISOString(),
          "2015-09-20T01:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods[0].points[1].endDate.toISOString(),
          "2015-09-20T05:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods[0].points[2].startDate.toISOString(),
          "2015-09-20T05:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods[0].points[2].endDate.toISOString(),
          "2015-09-20T07:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods[0].points[2].endDate,
          result.timeseries[1].periods[0].endDate,
        );
      });
      await t.step("TS with multiple periods", async () => {
        assertEquals(result.timeseries[1].periods.length, 2);
      });
      await t.step("Period with single point", async () => {
        assertEquals(result.timeseries[0].periods[0].points.length, 1);
      });
      await t.step("Period with multiple points", async () => {
        assertEquals(result.timeseries[1].periods[0].points.length, 3);
        assertEquals(result.timeseries[1].periods[1].points.length, 8);
      });
    });
  },
);

Deno.test("Test parsing of acknowledgement (should throw with correct reason and code)", async function () {
  const xml = await Deno.readTextFile("./tests/data/acknowledgement.invalidrequest.xml");
  assertThrows(
    () => {
      const result = ParseDocument(xml);
    },
    undefined,
    "No matching data found",
  );
});

Deno.test("Test parsing of invalid xml", async function () {
  const xml = await Deno.readTextFile("./tests/data/invalid.xml");
  assertThrows(
    () => {
      const result = ParseDocument(xml);
    },
    undefined,
    "Unknown XML document",
  );
});
