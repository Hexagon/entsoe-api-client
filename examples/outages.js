/**
 * entsoe-api-client
 * 
 * @file Example on getting active outages +/- 30 days from ENTSO-e Rest API
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

// Deno:
import { QueryUnavailability } from "https://deno.land/x/entsoe_api_client/mod.ts";

// Node: 
// import { QueryUnavailability } from "entsoe-api-client";

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
    process ?  // Your entsoe api-token by environment variable
        process.env.API_TOKEN // ... in Node
        : Deno.env.get("API_TOKEN"), // ... in Deno
    {
        documentType: "A77",        // A77 - Production unavailability OR A80 - Generation unavailability
        biddingZoneDomain: "CTA|SE",  // biddingZone_Domain
        startDateTime: dateToday,   // Start date
        endDateTime: dateTomorrow,  // End date        
        offset: 0
    }
);

for(const outage of result) {
    console.log("Outage: ");
    console.log(outage);
    // Print a table for first returned timeseries and period
    console.table(outage.timeseries[0].periods[0]);
}