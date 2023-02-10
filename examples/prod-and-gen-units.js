/**
 * entsoe-api-client
 * 
 * @file Example on getting production and generation units of a bidding zone today.
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

import { QueryConfiguration, BusinessType, DocumentType, Area } from "https://deno.land/x/entsoe_api_client/mod.ts";

// Node import:
// import { QueryConfiguration, BusinessType, DocumentType, Area } from "entsoe-api-client";

// Prepare dates
const
    dateToday = new Date((new Date().getTime()-86400));

// Run ENTSO-e transparency playform query
const result = await QueryConfiguration(
    typeof process !== "undefined" ?  // Your entsoe api-token by environment variable
        process.env.API_TOKEN // ... in Node
        : Deno.env.get("API_TOKEN"), // ... in Deno
    {
        documentType: DocumentType("Configuration document"), // A95 - Configuration document
        businessType: BusinessType("Production unit"), // B11 - Production unit
        biddingZoneDomain: Area("BZN|SE3"),  
        implementationDateAndOrTime: dateToday.toLocaleDateString('sv-SE') // sv-SE yields a date in format YYYY-MM-DD
    }
);

// Get first TimeSeries
console.log(result);
