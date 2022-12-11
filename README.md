# entsoe-api-client

ENTSO-e transparency platform API Client built for Deno. Complete. Easy to use. Minimal.

[![Deno CI](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml) [![jsdelivr](https://data.jsdelivr.com/v1/package/gh/hexagon/entsoe-api-client/badge?style=rounded)](https://www.jsdelivr.com/package/gh/hexagon/entsoe-api-client) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/entsoe-api-client/blob/master/LICENSE) 

*   Works in Deno >=1.16
*   Supports [TypeScript](https://www.typescriptlang.org/)

## Documentation

Full documentation available at [hexagon.github.io/entsoe-api-client](https://hexagon.github.io/entsoe-api-client/).

### Examples

```javascript
import { Query } from "https://deno.land/x/entsoe_api_client";

const result = await Query("your-api-key-here", "A44", "SE2", "SE2",new Date("2022-12-10"),new Date("2022-12-11"));

for(const ts of result.TimeSeries) {
    console.table({
        ...ts.Period.timeInterval,
        currency: ts["currency_Unit.name"],
        unit: ts["price_Measure_Unit.name"]
    });
    console.table(ts.Period.Point);
};

/* 

Output (example data):

┌──────────┬─────────────────────┐
│ (idx)    │ Values              │
├──────────┼─────────────────────┤
│ start    │ "2022-12-09T23:00Z" │
│ end      │ "2022-12-10T23:00Z" │
│ currency │ "EUR"               │
│ unit     │ "MWH"               │
└──────────┴─────────────────────┘
┌───────┬──────────┬──────────────┐
│ (idx) │ position │ price.amount │
├───────┼──────────┼──────────────┤
│     0 │        1 │       255.26 │
│     1 │        2 │       249.96 │
│     2 │        3 │       249.28 │
│     3 │        4 │       237.49 │
│     4 │        5 │       242.88 │
│     5 │        6 │       244.77 │
│     6 │        7 │       230.08 │
│     7 │        8 │       209.93 │
│     8 │        9 │       219.88 │
│     9 │       10 │       225.16 │
│    10 │       11 │        225.2 │
│    11 │       12 │       225.37 │
│    12 │       13 │       225.59 │
│    13 │       14 │       223.27 │
│    14 │       15 │       223.02 │
│    15 │       16 │       228.91 │
│    16 │       17 │       234.64 │
│    17 │       18 │       237.04 │
│    18 │       19 │       231.17 │
│    19 │       20 │       240.08 │
│    20 │       21 │       246.77 │
│    21 │       22 │       240.07 │
│    22 │       23 │       263.56 │
│    23 │       24 │        251.9 │
└───────┴──────────┴──────────────┘
```

### Full API

Todo ...

## Contributing

See [Contribution Guide](/CONTRIBUTING.md)

## License

MIT