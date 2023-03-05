// import { parseShortNumber } from "./utils.js";

function parseShortNumber(shortNumber) {
    const multipliers = {
        K: 1000,
        M: 1000000,
        B: 1000000000
    };
    const lastChar = shortNumber.charAt(shortNumber.length - 1);
    const multiplier = multipliers[lastChar];
    if (multiplier) {
        const num = parseFloat(shortNumber.slice(0, -1));
        return num * multiplier;
    }
    return parseFloat(shortNumber);
}

function crawlForSelectedItems() {
    // Get HTML table with keywords
    const kwTable = document.getElementsByClassName("keTable")[0];
    // Get list of <tr> elements
    const kwElementList = kwTable.getElementsByClassName("result-main is__selected");

    let result = [];

    Array.prototype.forEach.call(kwElementList, element => {
        let entry = [];

        console.log("Row has been selected!");

        const keyword = element.getElementsByClassName("resultsTable-keyword")[0]
            .querySelector('.css-a5m6co-text span').innerText;

        const dificulty = element.getElementsByClassName("resultsTable-difficulty")[0]
            .firstChild.innerText;

        const volume = element.getElementsByClassName("resultsTable-volume")[0]
            .innerText;

        entry.push(keyword);
        entry.push(parseShortNumber(dificulty));
        entry.push(parseShortNumber(volume));

        result.push(entry.join("\t"));
    });

    return result;
}

// alert("Inside content script");

function handleEvent(request, sender, sendResponse) {
    // alert("Inside listener handler");
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.type === "copySelectedKeywords") {
        const result = crawlForSelectedItems();
        sendResponse({
            value: result.join("\n"),
            length: result.length
        });
    }
}

chrome.runtime.onMessage.addListener(handleEvent);