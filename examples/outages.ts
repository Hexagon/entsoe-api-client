import { QueryResult, Query } from "../mod.ts";
import { PsrType } from "https://deno.land/x/entsoe_api_client@0.3.0/src/parameters/psrtype.js";
import { BusinessType } from "https://deno.land/x/entsoe_api_client@0.3.0/src/parameters/businesstype.js";
import { EntsoeQueryPeriod, EntsoeQueryPoint } from "https://deno.land/x/entsoe_api_client@0.3.0/src/parsedocument.ts";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();

dateToday.setDate(dateToday.getDate()-30);
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateToday.getDate()+30);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result : QueryResult[] = await Query(
    Deno.env.get("API_TOKEN") as string, // Your entsoe api-token
    {
        documentType: "A80",        // A80 - Generation unavailability
        biddingZoneDomain: "CTA|SE",  // biddingZone_Domain
        startDateTime: dateToday,   // Start date
        endDateTime: dateTomorrow,  // End date        
        offset: 0
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
        const businessType = outage.businessType ? (BusinessType as Record<string,string>)[outage.businessType] : void 0;
        const resourceName = outage["production_RegisteredResource.name"];
        const mRID = outageDoc.mRID;
        const revision = outageDoc.revisionNumber;
        const location = outage["production_RegisteredResource.location.name"];
        const powerSystemResourceName = outage["production_RegisteredResource.pSRType.powerSystemResources.name"];
        const powerSystemResourceNominalPowerUnit = outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["@unit"] : void 0;
        const powerSystemResourceNominalPower = outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"] ? outage["production_RegisteredResource.pSRType.powerSystemResources.nominalP"]["#text"] : void 0;
        const powerSystemPsrType = outage["production_RegisteredResource.pSRType.psrType"] ? (PsrType as Record<string,string>)[outage["production_RegisteredResource.pSRType.psrType"] as string] : void 0;
        const reasonCode = outage.Reason?.code;
        const reasonText = outage.Reason?.text;
        const availablePeriodArray = outage.Available_Period?.length ? outage.Available_Period : (outage.Available_Period ? [outage.Available_Period] : []);
        console.log("Outage: ");
        console.log("\tmRID:\t\t", mRID);
        console.log("\tRevision:\t", revision);
        console.log("\tLocation:\t", location);
        console.log("\tBusiness type:\t", businessType);
        console.log("\tResource:\t",resourceName);
        console.log("\tPeriod:\t\t",startDate,"-",endDate);
        console.log("\tPower system:\t",powerSystemResourceName);
        console.log("\tPower sys. type:",powerSystemPsrType);
        console.log("\tNominal power:\t",powerSystemResourceNominalPower,powerSystemResourceNominalPowerUnit);
        console.log("\tReason:\t\t",reasonCode,reasonText);
        console.log("\tAvailable power:");
        for(const avail of (availablePeriodArray as EntsoeQueryPeriod[])) {
            const points : EntsoeQueryPoint[] = (avail.Point?.length ? avail.Point : [avail.Point]) as EntsoeQueryPoint[];
            for(const point of points) {
                console.log("\t\t",avail.timeInterval.start,"-",avail.timeInterval.end," ",point.quantity,powerSystemResourceNominalPowerUnit);
            }
        }
    }
}