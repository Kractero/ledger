import { readFileSync, readdirSync, writeFileSync } from "fs";

const files = readdirSync('../data');
const comboJson = {};

files.forEach((file, i) => {
  const filePath = `../data/${file}`;
  try {
    const jsonData = readFileSync(filePath, 'utf8');
    const jsonObj = JSON.parse(jsonData);
    jsonObj.forEach((nation, j) => {
      if (!comboJson.hasOwnProperty(nation.Nation)) {
        comboJson[nation.Nation] = {
          name: nation.Nation,
          "appearances": [],
          "Junk Value": [],
          "Bank": [],
          "Deck Value": [],
          "Card Count": [],
          position: []
        };
      }
      comboJson[nation.Nation]["appearances"].push(file.replace('.json', ''));
      comboJson[nation.Nation]["Junk Value"].push(nation["Junk Value"]);
      comboJson[nation.Nation]["Bank"].push(nation["Bank"]);
      comboJson[nation.Nation]["Deck Value"].push(nation["Deck Value"]);
      comboJson[nation.Nation]["Card Count"].push(nation["Card Count"]);
      comboJson[nation.Nation].position.push(j + 1);
    });
  } catch (err) {
    console.error(`Error reading JSON file ${filePath}: ${err.message}`);
  }
});

writeFileSync("test.json", JSON.stringify(comboJson, null, 2));