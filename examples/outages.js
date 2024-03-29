/**
 * entsoe-api-client
 * 
 * @file Example on getting active outages +/- 30 days from ENTSO-e Rest API
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

// Deno:
import { QueryUnavailability, DocumentType, Area } from "https://deno.land/x/entsoe_api_client/mod.ts";

// Node: 
// import { QueryUnavailability, DocumentType, Area } from "entsoe-api-client";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();

dateToday.setDate(dateToday.getDate()-30);
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateToday.getDate()+30);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result = await QueryUnavailability(
    typeof process !== "undefined" ?  // Your entsoe api-token by environment variable
        process.env.API_TOKEN // ... in Node
        : Deno.env.get("API_TOKEN"), // ... in Deno
    {
        documentType: DocumentType("Production unavailability"),        // A77 - Production unavailability OR A80 - Generation unavailability
        biddingZoneDomain: Area("CTA|SE"),  // biddingZone_Domain
        startDateTime: dateToday,   // Start date
        endDateTime: dateTomorrow,  // End date        
        offset: 0
    }
);

for(const outage of result) {
    console.log("Outage: ", outage);
}