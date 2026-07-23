import { cp, mkdir } from "node:fs/promises";

const outputDirectory = new URL("./dist/", import.meta.url);
const files = ["index.html", "style.css", "script.js"];

await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  files.map((file) => cp(new URL(file, import.meta.url), new URL(file, outputDirectory)))
);
