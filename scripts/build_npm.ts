import { build, emptyDir } from "https://deno.land/x/dnt@0.21.0/mod.ts";

const name = "sshutil";
const version = Deno.args[0];
if (!version) {
  throw new Error("No version argument is specified");
}
console.log("*".repeat(80));
console.log(`${name} ${version}`);
console.log("*".repeat(80));

await emptyDir("./npm");

await build({
  typeCheck: false,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name,
    version,
    author: "Fixpoint, Inc.",
    license: "MIT",
    repository: "https://github.com/fixpoint/deno-sshutil",
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
