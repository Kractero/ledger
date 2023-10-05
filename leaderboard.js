
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false });
function sleep() {
	return new Promise((resolve) => setTimeout(resolve, 700));
}

const top100names = []
for (let i = 0; i < 1; i++) {
    let start = 1 + i * 20;
    const response = await fetch(
        `https://www.nationstates.net/cgi-bin/api.cgi?q=censusranks&scale=86&start=${start}`,
        {
            headers: {
                'User-Agent': "Kractero"
            }
        }
    );
    const text = await response.text();
    const xml = parser.parse(text);
    xml.WORLD.CENSUSRANKS.NATIONS.NATION.forEach(nation => {
        top100names.push(nation.NAME)
    });;
    await sleep();
}

const top100Data = []
for (let i = 0; i < top100names.length; i++) {
    const response = await fetch(
        'https://www.nationstates.net/cgi-bin/api.cgi/?nationname=' +
        top100names[i] +
            '&q=cards+deck+info',
        {
            method: 'GET',
            headers: {
                'User-Agent': "Kractero"
            }
        }
    );
    const xml = await response.text();
    const xmlObj = parser.parse(xml);
    const nation = top100names[i].toString()
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    const deck = {
        Nation: nation,
    };

    const categoryCounts = {};
    const seasonCounts = {};
    const categorySeasonCounts = {};
    if (xmlObj.CARDS.DECK.CARD) {
        const deckObj = xmlObj.CARDS.DECK.CARD;
        for (let i = 0; i < deckObj.length; i++) {
            const category = deckObj[i].CATEGORY
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join('-');
            if (categoryCounts[category]) {
                categoryCounts[category] += 1;
            } else {
                categoryCounts[category] = 1;
            }
            const season = deckObj[i].SEASON;
            if (seasonCounts[`S${season}`]) {
                seasonCounts[`S${season}`] += 1;
            } else {
                seasonCounts[`S${season}`] = 1;
            }
            const key = `S${season} ${category}`;
            if (categorySeasonCounts[key]) {
                categorySeasonCounts[key] += 1;
            } else {
                categorySeasonCounts[key] = 1;
            }
        }
        deck['Junk Value'] =
            Number(((categoryCounts.Legendary || 0) * 1 +
            (categoryCounts.Epic || 0) * 0.5 +
            (categoryCounts.Common || 0) * 0.01 +
            (categoryCounts.Uncommon || 0) * 0.05 +
            (categoryCounts['Ultra-Rare'] || 0) * 0.2).toFixed(2));

        deck['Bank'] = xmlObj.CARDS.INFO.BANK;
        deck['Deck Value'] = xmlObj.CARDS.INFO.DECK_VALUE;
        deck['Card Count'] = xmlObj.CARDS.INFO.NUM_CARDS;
        deck['Deck Capacity'] = xmlObj.CARDS.INFO.DECK_CAPACITY_RAW;
        Object.entries(categoryCounts).forEach((category) => {
            deck[category[0]] = category[1]
        })
        Object.entries(seasonCounts).forEach((category) => {
            deck[category[0]] = category[1]
        })
        Object.entries(categorySeasonCounts).forEach((category) => {
            deck[category[0]] = category[1]
        })
        top100Data.push(deck)
    }
    await sleep()
}

const top100DataJson = JSON.stringify(top100Data, null, 2);

console.log(top100DataJson);