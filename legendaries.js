import { writeFileSync, readFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false });

const legendaries = JSON.parse(readFileSync("Legendaries.json"))

const currentDate = new Date();
const utcMinus7Date = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000);
utcMinus7Date.setDate(utcMinus7Date.getDate() - 1);
const date = utcMinus7Date.toISOString().slice(0, 10);
const filePath = `https://raw.githubusercontent.com/Kractero/region-xml-dump/main/data/${date}-Nations.xml`;
const data = await fetch(filePath);
const text = await data.text();
const doc = parser.parse(text);
const names = doc.NATIONS.NATION.map((nation) => nation.NAME.toString().toLowerCase());
legendaries.forEach((legendary) => {
  const exists = names.includes(legendary.name.toLowerCase());
  if (exists) legendary.exists = true
  else legendary.exists = false;
});

writeFileSync(`Legendaries-${date}.json`, JSON.stringify(legendaries, null, 2));
