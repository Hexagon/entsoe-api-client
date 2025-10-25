---
layout: page
title: "Curve Types"
parent: Usage
nav_order: 3
---

# Curve Types

---

The ENTSO-e API uses curve types to specify how time-series data should be interpreted. This library fully supports all curve types with special processing for variable sized blocks.

## Supported Curve Types

| Code | Description | Behavior |
|------|-------------|----------|
| A01  | Sequential fixed size block | Standard parsing, no data manipulation |
| A02  | Point | Standard parsing, no data manipulation |
| A03  | Variable sized block | **Automatic forward fill** |

## A03 Forward Fill Feature

### What is Forward Fill?

Forward fill is a data processing technique that fills missing time periods with the last known value. This is particularly important for A03 curve types (Variable sized block) where values are expected to remain constant until explicitly changed.

### How it Works

1. **Detects missing data points** by comparing actual points with expected points based on time interval and resolution
2. **Fills gaps** with the last known value for both price and quantity fields
3. **Maintains temporal accuracy** by calculating correct start and end times for each point
4. **Preserves original data** while ensuring complete time series

### Example

Given a 6-hour period with PT1H resolution and sparse data:

**Input Data:**
```xml
<Period>
    <timeInterval>
        <start>2024-01-01T00:00Z</start>
        <end>2024-01-01T06:00Z</end>
    </timeInterval>
    <resolution>PT1H</resolution>
    <Point>
        <position>1</position>
        <price.amount>100.00</price.amount>
    </Point>
    <Point>
        <position>3</position>
        <price.amount>120.00</price.amount>
    </Point>
    <Point>
        <position>6</position>
        <price.amount>90.00</price.amount>
    </Point>
</Period>
```

**Parsed Result (with forward fill):**
```javascript
[
  { position: 1, price: 100.00, startDate: "2024-01-01T00:00:00.000Z" }, // Original
  { position: 2, price: 100.00, startDate: "2024-01-01T01:00:00.000Z" }, // Forward filled
  { position: 3, price: 120.00, startDate: "2024-01-01T02:00:00.000Z" }, // Original
  { position: 4, price: 120.00, startDate: "2024-01-01T03:00:00.000Z" }, // Forward filled
  { position: 5, price: 120.00, startDate: "2024-01-01T04:00:00.000Z" }, // Forward filled
  { position: 6, price: 90.00,  startDate: "2024-01-01T05:00:00.000Z" }  // Original
]
```

### Usage Example

```javascript
import { ParseDocument, CurveType } from "entsoe-api-client";

// Your XML document with A03 curve type
const document = ParseDocument(xmlString);

if (document.rootType === "publication") {
  const timeseries = document.timeseries[0];
  
  console.log("Curve Type:", timeseries.curveType); // "A03"
  console.log("Description:", timeseries.curveTypeDescription); // "Variable sized block"
  
  // Points will be automatically forward filled
  const points = timeseries.periods[0].points;
  console.log("Total points:", points.length); // Complete time series
}

// Helper function to get curve type codes
console.log(CurveType("Variable sized block")); // "A03"
```

### When Forward Fill Applies

- **Only for A03 curve types** - A01 and A02 are processed normally
- **Automatically detected** - no configuration required
- **All document types** - works with Publication, GL, Balancing, etc.
- **Both price and quantity** - forward fills all available data fields

### Benefits

1. **Complete time series** - no missing data points
2. **Consistent data structure** - predictable array lengths
3. **Time-accurate** - maintains correct temporal relationships
4. **Business logic compliant** - follows ENTSO-e variable block semantics
5. **Analysis ready** - data ready for time-series analysis and visualization

This feature makes working with A03 curve types seamless and ensures your applications receive complete, analysis-ready time series data.