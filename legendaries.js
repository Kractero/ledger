import { writeFileSync, readFileSync } from 'fs'

const legendaries = JSON.parse(readFileSync('Legendaries.json'))
const legendaries_data = JSON.parse(readFileSync('LegendariesChangelog.json'))

const currentDate = new Date()
const utcMinus7Date = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000)
utcMinus7Date.setDate(utcMinus7Date.getDate() - 1)
const date = utcMinus7Date.toISOString().slice(0, 10)
const filePath = `https://raw.githubusercontent.com/Kractero/region-xml-dump/main/data/${date}-cards.json`
const data = await fetch(filePath)
const json = await data.json()

const legdata = {
  date: date,
  changes: [],
}
legendaries.forEach(legendary => {
  const cte = json[legendary.id]
  if (!cte !== legendary.exists) {
    legdata.changes.push({
      name: legendary.name,
      seasons: [legendary.S1, legendary.S2, legendary.S3],
      old: legendary.exists,
      new: !cte,
    })
  }
  legendary.exists = !cte
})

if (legdata.changes.length > 0) legendaries_data.unshift(legdata)

writeFileSync(`Legendaries.json`, JSON.stringify(legendaries, null, 2))
writeFileSync(`LegendariesChangelog.json`, JSON.stringify(legendaries_data, null, 2))
