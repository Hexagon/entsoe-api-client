import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ConfigurationDocument, ParseDocument } from "../src/documents.ts";

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
