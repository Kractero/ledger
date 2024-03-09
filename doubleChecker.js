import { readFileSync, writeFileSync } from "fs"
import Papa from "papaparse"

const csvFilePath = 'S3Legs.csv';
const csvData = readFileSync(csvFilePath, 'utf8');

const json = 'Legendaries.json'
const jsonData = readFileSync(json, 'utf-8')

const parsedData = Papa.parse(csvData, { header: true }).data;

const newJson = parsedData.map(entry => {
  const { id, name, season } = entry;
  const seasons = ["3"];
  const result = {
    name,
    id,
  };

  seasons.forEach(seasonNum => {
    result[seasonNum] = season === seasonNum;
  });

  return result;
});

const updatedJsonData = JSON.parse(jsonData).map(card => {
  const correspondingCard = newJson.find(cardo => cardo.name === card.name);

  if (correspondingCard && card.S3 !== correspondingCard["3"]) {
    console.log("msimatch found with " + card.name)
    card.S3 = correspondingCard["3"];
  }

  return card;
});

const updatedJsonString = JSON.stringify(updatedJsonData, null, 2);

writeFileSync("Legendaries.json", updatedJsonString)