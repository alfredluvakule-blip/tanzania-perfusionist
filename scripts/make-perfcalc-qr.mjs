// Regenerates the PerfCalc TZ QR codes in /public.
// Run after changing PERFCALC_URL in src/lib/site.ts:  npm run qr:perfcalc
import { readFileSync, writeFileSync } from "node:fs";
import QRCode from "qrcode";

const site = readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8");
const url = site.match(/PERFCALC_URL\s*=\s*"([^"]+)"/)?.[1];
if (!url) throw new Error("PERFCALC_URL not found in src/lib/site.ts");

// Medium error correction and a 4-module quiet zone scan reliably from print and screens.
const opts = { errorCorrectionLevel: "M", margin: 4, color: { dark: "#0b1733", light: "#ffffff" } };

writeFileSync(new URL("../public/images/perfcalc-qr.svg", import.meta.url), await QRCode.toString(url, { ...opts, type: "svg" }));
await QRCode.toFile(new URL("../public/downloads/perfcalc-tz-qr.png", import.meta.url).pathname, url, { ...opts, width: 1200 });
console.log(`QR codes written for ${url}`);
