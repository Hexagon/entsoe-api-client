import { assertEquals, assertThrows } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ConfigurationDocument, GLDocument, ParseDocument } from "../src/parsedocument.ts";

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
        assertEquals(result.timeseries[0].periods?.length, 1);
      });
      await t.step("Period start and end date parsed correctly", async () => {
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].startDate.toISOString(),
          "2015-09-19T22:00:00.000Z",
        );
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].endDate.toISOString(),
          "2015-09-20T18:00:00.000Z",
        );
      });
      await t.step("Single point start and end date matches period", async () => {
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].startDate,
          result.timeseries[0].periods?.[0].startDate,
        );
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].endDate,
          result.timeseries[0].periods?.[0].endDate,
        );
      });
      await t.step("Skipped periods are handled correctly", async () => {
        assertEquals(
          result.timeseries[1].periods?.[0].points[0].startDate,
          result.timeseries[1].periods?.[0].startDate,
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[0].startDate.toISOString(),
          "2015-09-19T22:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[0].endDate.toISOString(),
          "2015-09-20T01:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[1].startDate.toISOString(),
          "2015-09-20T01:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[1].endDate.toISOString(),
          "2015-09-20T05:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[2].startDate.toISOString(),
          "2015-09-20T05:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[2].endDate.toISOString(),
          "2015-09-20T07:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[2].endDate,
          result.timeseries[1].periods?.[0].endDate,
        );
      });
      await t.step("TS with multiple periods", async () => {
        assertEquals(result.timeseries[1].periods?.length, 2);
      });
      await t.step("Period with single point", async () => {
        assertEquals(result.timeseries[0].periods?.[0].points.length, 1);
      });
      await t.step("Period with multiple points", async () => {
        assertEquals(result.timeseries[1].periods?.[0].points.length, 3);
        assertEquals(result.timeseries[1].periods?.[1].points.length, 8);
      });
    });
  },
);

Deno.test(
  "Configuration document",
  async function (t) {
    const xml = await Deno.readTextFile("./tests/data/configuration.xml");
    await t.step("Parse", async (t) => {
      const result: ConfigurationDocument = ParseDocument(xml);
      await t.step("rootType is correct", async () => {
        assertEquals(result.rootType, "configuration");
      });
      await t.step("processType", async () => {
        assertEquals(result.processType, "A39");
        assertEquals(result.processTypeDescription, "Synchronisation process");
      });
      await t.step("documentType", async () => {
        assertEquals(result.documentType, "A95");
        assertEquals(result.documentTypeDescription, "Configuration document");
      });
      await t.step("sender_MarketParticipant (and role", async () => {
        assertEquals(result.senderMarketParticipantId, "10X1001A1001A450");
        assertEquals(result.senderMarketParticipantRoleType, "A32"); // Expected to be undefined as processType=A26 is not defined in parameters/processtype.js
      });
      await t.step("receiver_MarketParticipant.id (and role)", async () => {
        assertEquals(result.senderMarketParticipantId, "10X1001A1001A450");
        assertEquals(result.senderMarketParticipantRoleType, "A32"); // Expected to be undefined as processType=A26 is not defined in parameters/processtype.js
      });
      await t.step("created", async () => {
        assertEquals(result.created?.toISOString(), "2017-01-01T11:24:32.000Z");
      });
      await t.step("TS length", async () => {
        assertEquals(result.timeseries.length, 1);
      });
      await t.step("TS length", async () => {
        assertEquals(result.timeseries.length, 1);
      });
      await t.step("TS businessType", async () => {
        assertEquals(result.timeseries[0].businessType, "B11");
        assertEquals(result.timeseries[0].businessTypeDescription, "Production unit");
      });
      await t.step("TS implementationDate", async () => {
        assertEquals(
          result.timeseries[0].implementationDate?.toISOString(),
          "2017-01-01T00:00:00.000Z",
        );
      });
      await t.step("TS biddingZoneDomain", async () => {
        assertEquals(result.timeseries[0].biddingZoneDomain, "10YCZ-CEPS-----N");
      });
      await t.step("TS registeredResourceId", async () => {
        assertEquals(result.timeseries[0].registeredResourceId, "27W-PU-EPLE----4");
      });
      await t.step("TS registeredResourceName", async () => {
        assertEquals(result.timeseries[0].registeredResourceName, "EPLE_______");
      });
      await t.step("TS registeredResourceLocation", async () => {
        assertEquals(result.timeseries[0].registeredResourceLocation, "Plzeňská energetika");
      });
      await t.step("TS controlAreaDomain", async () => {
        assertEquals(result.timeseries[0].controlAreaDomain, "10YCZ-CEPS-----N");
      });
      await t.step("TS Provider_MarketParticipant", async () => {
        assertEquals(result.timeseries[0].providerMarketParticipant, "27XPLZEN-ENERG-8");
      });
      await t.step("TS psrType", async () => {
        assertEquals(result.timeseries[0].psrType, "B02");
      });
      await t.step("TS highVoltageLimit (and unit)", async () => {
        assertEquals(result.timeseries[0].psrHighvoltageLimit, 22);
        assertEquals(result.timeseries[0].psrHighvoltageLimitUnit, "KVT");
      });
      await t.step("TS nominalPower (and unit)", async () => {
        assertEquals(result.timeseries[0].psrNominalPower, 111);
        assertEquals(result.timeseries[0].psrNominalPowerUnit, "MAW");
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
