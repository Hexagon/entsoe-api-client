import { Query } from "https://deno.land/x/entsoe_api_client@0.2.0/mod.ts";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateTomorrow.getDate()+1);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result = await Query(
    Deno.env.get("API_TOKEN"), // Your entsoe api-token
    {
        documentType: "A71",        // A71 - Generation forecast
        processType: "A01",         // A01 - Day ahead
        inDomain: "Sweden (SE)",    
        outDomain: "Sweden (SE)",   
        startDateTime: dateToday,   // Start date
        endDateTime: dateTomorrow   // End date
    }
);

// Get first TimeSeries
const ts = result.TimeSeries[0];

// Print meta data
console.table({
    start: ts.Period.timeInterval.start,
    end: ts.Period.timeInterval.end,
    currency: ts["currency_Unit.name"],
    unit: ts["price_Measure_Unit.name"]
});

// Print spot prices per hour
console.table(ts.Period.Point);
