import { QueryZipped } from "https://deno.land/x/entsoe_api_client@0.2.0/mod.ts";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();

dateToday.setDate(dateToday.getDate()-100);
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateToday.getDate()+2);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result : ArrayBuffer = await QueryZipped(
    Deno.env.get("API_TOKEN"), // Your entsoe api-token
    {
        documentType: "A80",        // A80 - Generation unavailability
        biddingZoneDomain: "BZN|SE3",  // biddingZone_Domain
        startDateTime: dateToday,   // Start date
        endDateTime: dateTomorrow,  // End date
    }
);

for(const outageDoc of result) {
    for(const outage of outageDoc.TimeSeries) {
        let startDate;
        if (outage["start_DateAndOrTime.date"]) {
            if (outage["start_DateAndOrTime.time"]) {
                startDate = new Date(Date.parse(outage["start_DateAndOrTime.date"] + "T" + outage["start_DateAndOrTime.time"]));
            } else {
                startDate = new Date(Date.parse(outage["start_DateAndOrTime.date"] + "T00:00:00Z"));
            }
        }
        let endDate;
        if (outage["end_DateAndOrTime.date"]) {
            if (outage["end_DateAndOrTime.time"]) {
                endDate = new Date(Date.parse(outage["end_DateAndOrTime.date"] + "T" + outage["start_DateAndOrTime.time"]));
            } else {
                endDate = new Date(Date.parse(outage["end_DateAndOrTime.date"] + "T00:00:00Z"));
            }
        }
        const resourceName = outage["production_RegisteredResource.name"];
        const powerSystemResourceName = outage["production_RegisteredResource.pSRType.powerSystemResources.name"];
        const powerSystemResourceNominalPowerUnit = outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["@unit"] : void 0;
        const powerSystemResourceNominalPower = outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["#text"] : void 0;
        console.log("Outage: ");
        console.log("\tResource:\t",resourceName);
        console.log("\tPeriod:\t\t",startDate,"-",endDate);
        console.log("\tPower system:\t",powerSystemResourceName);
        console.log("\tNominal power:\t",powerSystemResourceNominalPower,powerSystemResourceNominalPowerUnit);
    }
}