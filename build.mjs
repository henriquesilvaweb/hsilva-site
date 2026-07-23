import { cp, mkdir } from "node:fs/promises";

const outputDirectory = new URL("./dist/", import.meta.url);
const files = ["index.html", "style.css", "script.js"];

await mkdir(outputDirectory, { recursive: true });
await mkdir(new URL("./server/", outputDirectory), { recursive: true });
await mkdir(new URL("./.openai/", outputDirectory), { recursive: true });

await Promise.all(
  files.map((file) => cp(new URL(file, import.meta.url), new URL(file, outputDirectory)))
);

await Promise.all([
  cp(new URL("./server/index.js", import.meta.url), new URL("./server/index.js", outputDirectory)),
  cp(new URL("./.openai/hosting.json", import.meta.url), new URL("./.openai/hosting.json", outputDirectory))
]);
