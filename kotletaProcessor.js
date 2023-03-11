import { mapTsvToRawKotletaList } from "./rawKotletaData.js";

export async function startLbProcessing(event) {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    if (!file.name.toLowerCase().endsWith('.tsv')) {
        // chrome.tabs.create({ url: "./popup/popup.html" });
        alert("Ти дебік. Дай .tsv файл!");
    }
    console.log('Opened file: "' + file.name + '"');

    const forbiddenWords = document.getElementById("forbidden-words-input")
        .value.replaceAll(" ", "").split(",").filter(e => e);
    console.log("Got these forbidden words: '" + forbiddenWords + "'");

    const contents = await file.text();
    const listOfRawKotletas = mapTsvToRawKotletaList(contents);

    console.log('\nCheck kotletas for non-Latin characters:');
    const latinKotletas = filterNonLatinKotletas(listOfRawKotletas);
    console.log('\nCheck kotletas for forbidden words');
    const wordsFilteredKotletas = filterKotletasByForbiddenWords(latinKotletas, forbiddenWords);

}

// Заборонені слова
function filterKotletasByForbiddenWords(rawKotletas, forbiddenWords) {
    const filteredKotletas = [];

    rawKotletas.forEach(rawKotleta => {
        forbiddenWords.forEach(word => {
            if (!rawKotleta.url.includes(word) && !rawKotleta.anchor.includes(word)) {
                filteredKotletas.push(rawKotleta);
            } else {
                console.log("Kotleta: \"" + rawKotleta.url + "\" \"" + rawKotleta.anchor + "\" has bad words!");
            }
        })
    });

    console.log("Remained " + filteredKotletas.length + "/" + rawKotletas.length + " kotletas")
    return filteredKotletas;
}

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

// Латиниця
function filterNonLatinKotletas(rawKotletas) {
    const filteredKotletas = [];

    rawKotletas.forEach(rawKotleta => {
        if (isASCII(rawKotleta.url) && isASCII(rawKotleta.anchor)) {
            filteredKotletas.push(rawKotleta);
        } else {
            console.log('Kotleta with url: "' + rawKotleta.url + '" and anchor: "' + rawKotleta.anchor + '" contains non-Latin characters');
        }
    });

    console.log("Remained " + filteredKotletas.length + "/" + rawKotletas.length + " kotletas")
    return filteredKotletas;
}