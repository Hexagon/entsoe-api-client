/**
 * entsoe-api-client
 * 
 * @file Example on getting active outages +/- 30 days from ENTSO-e Rest API
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

import { QueryUnavailability } from "https://deno.land/x/entsoe_api_client@0.5.0/mod.ts";

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
    Deno.env.get("API_TOKEN") as string, // Your entsoe api-token
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
    console.table(outage?.timeseries[0].periods[0]);
}