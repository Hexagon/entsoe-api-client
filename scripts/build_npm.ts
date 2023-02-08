import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";
import { copy } from "https://deno.land/std@0.176.0/fs/mod.ts";

// Clear NPM directory
await emptyDir("./npm");

// Copy test data
await copy("tests/data", "npm/esm/tests/data", { overwrite: true });
await copy("tests/data", "npm/script/tests/data", { overwrite: true });

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
    undici: true // Undici is for fetch support in old node versions
  },
  mappings: {
    "https://deno.land/x/zipjs@v2.6.63/index.js": {
      name: "@zip.js/zip.js",
      version: "^2.6.63"
    },
  },
  package: {
    // package.json properties
    name: "entsoe-api-client",
    version: Deno.args[0],
    description: "ENTSO-e transparency platform API Client. Complete. Easy to use. Minimal.",
    license: "MIT",
    repository: {
        type: "git",
        url: "git+https://github.com/Hexagon/entsoe-api-client.git"
    },
    author: "Hexagon <Hexagon@GitHub>",
    bugs: {
        url: "https://github.com/Hexagon/entsoe-api-client/issues"
    },
    homepage: "https://github.com/Hexagon/entsoe-api-client#readme"
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");

// npmignore test data
// ensure the test data is ignored in the `.npmignore` file
// so it doesn't get published with your npm package
await Deno.writeTextFile(
  "npm/.npmignore",
  "esm/tests/data\nscript/tests/data\n",
  { append: true },
);