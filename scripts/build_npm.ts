import { build, copy, emptyDir } from "./deps.ts";

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
  },
  mappings: {
    "https://deno.land/x/zipjs@v2.7.17/index.js": {
      name: "@zip.js/zip.js",
      version: "^2.7.17",
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
      url: "git+https://github.com/Hexagon/entsoe-api-client.git",
    },
    author: "Hexagon <Hexagon@GitHub>",
    bugs: {
      url: "https://github.com/Hexagon/entsoe-api-client/issues",
    },
    homepage: "https://github.com/Hexagon/entsoe-api-client#readme",
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");

// Fix the .npmignore file to prevent exclusion of esm/src/ and script/src/
// DNT 0.37.0 generates "src/" in .npmignore by default (when not using source maps).
// This pattern inadvertently excludes esm/src/ and script/src/ containing transpiled code.
// Replace "src/" with "/src/" to only match the root TypeScript source directory.
let npmignore = await Deno.readTextFile("npm/.npmignore");
npmignore = npmignore.replace(/^src\/$/m, "/src/");
await Deno.writeTextFile("npm/.npmignore", npmignore);

// npmignore test data
// ensure the test data is ignored in the `.npmignore` file
// so it doesn't get published with your npm package
await Deno.writeTextFile(
  "npm/.npmignore",
  "esm/tests/data\nscript/tests/data\n",
  { append: true },
);
