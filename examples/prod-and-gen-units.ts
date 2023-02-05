/**
 * entsoe-api-client
 * 
 * @file Example on getting production and generation units of a bidding zone today.
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

import { QueryConfiguration } from "https://deno.land/x/entsoe_api_client@0.6.0/mod.ts";

// Prepare dates
const
    dateToday = new Date((new Date().getTime()-86400));

// Run ENTSO-e transparency playform query
const result = await QueryConfiguration(
    Deno.env.get("API_TOKEN") || "", // Your entsoe api-token
    {
        documentType: "A95",
        businessType: "B11",
        biddingZoneDomain: "BZN|SE3",  
        implementationDateAndOrTime: dateToday.toLocaleDateString('sv-SE') // sv-SE yields a date in format YYYY-MM-DD
    }
);

// Get first TimeSeries
console.log(result);
