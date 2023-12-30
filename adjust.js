import { writeFileSync, readFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false });
function sleep() {
	return new Promise((resolve) => setTimeout(resolve, 700));
}
const legendaries = JSON.parse(readFileSync("Legendaries.json"))

for (let i = 0; i < legendaries.length; i++) {
  const leg = await fetch(`https://api.sideroca.com/cards/${legendaries[i].name}`)
  const json = await leg.json()
  console.log(`${legendaries[i].name} currently ID mapped to ${legendaries[i].id}, apparently is ${json.card.id}`)
  legendaries[i].id = String(json.card.id)
  await sleep(700)
}

writeFileSync(`Legendariess.json`, JSON.stringify(legendaries, null, 2));