// import { parseShortNumber } from "./utils.js";
copyButtonCSS = "outline: #000000; outline-style: solid; align: center;outline-width: 1px; width: 100%; font-size: 12px;color: #ffffff; background-color: #90000e; border-radius: 12px; border: 0; padding: 3px;";

const delay = ms => new Promise(res => setTimeout(res, ms));

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

async function onCopyButtonClicked() {
    const result = crawlForSelectedItems();
    console.log("Copying: " + result.join("\n"));
    await navigator.clipboard.writeText(result.join("\n"));
}

function addCopyButton(buttonCSS) {
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy selected Keywords + Difficulty + Volume';
    copyButton.style.cssText = buttonCSS;

    toolbar = document.getElementsByClassName("css-1h4yvvf-block css-9uzb9x-blockMain css-f201k2-blockWithGrouping")[0];
    document.body.appendChild(copyButton);

    copyButton.addEventListener('click', onCopyButtonClicked, false);
}

// Not yet working
async function runObserverToAppendCopyButtonOnClassChange() {
    // Get the element to observe
    let toolbar = document.querySelector('.css-1h4yvvf-block.css-9uzb9x-blockMain.css-f201k2-blockWithGrouping.css-1ej5xwi-blockWithGap');

    // Create a new MutationObserver instance
    const observer = new MutationObserver((mutations) => {
        // Loop through the mutations
        mutations.forEach((mutation) => {
            // Check if the class attribute has changed
            if (mutation.attributeName === 'class') {
                const currentClasses = toolbar.classList;
                // Check if the desired class has been added
                if (currentClasses.contains('css-1h4yvvf-block') &&
                    currentClasses.contains('css-9uzb9x-blockMain') &&
                    currentClasses.contains('css-f201k2-blockWithGrouping') &&
                    !currentClasses.contains('css-1ej5xwi-blockWithGap')) {
                    // Trigger the callback function
                    addCopyButton(copyButtonCSS);
                }
            }
        });
    });

    // Configure the observer to watch for changes to the attributes of the element
    observer.observe(toolbar, { attributes: true });
}
// Add button 
addCopyButton(copyButtonCSS);

//////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    console.log("Document loaded");
    runObserverToAppendCopyButtonOnClassChange();
});

// runObserverToAppendCopyButtonOnClassChange();

//////////////////////////////////////////////////////////////////
chrome.runtime.onMessage.addListener(handleEvent);