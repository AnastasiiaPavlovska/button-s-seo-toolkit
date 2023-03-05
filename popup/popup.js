import { getActiveTabURL, copyToClipboard, pasteFromClipboard } from "../utils.js";
import { queryKeywordsInNewTab } from "../ahrefs-content/ahrefsQuery.js";

const ahrefsMatchingTermsUrl = "https://app.ahrefs.com/keywords-explorer/google/us/ideas/matchingTerms";
// const ahrefsMatchingTermsUrl = "https://";

let statusHistory = [];

function setStatus(message) {
    statusHistory.push(message);
    var status_bar = document.getElementById("status_bar");
    status_bar.innerText = statusHistory.join("\n");
}

function queryButtonHandler() {
    const keywords = pasteFromClipboard();
    const inclusionString = document.getElementById('query-include-input').value;
    const exclusionString = document.getElementById('query-exclude-input').value;

    setStatus("Got data:\nKeywords: " + keywords +
        "\nInclude: " + inclusionString +
        "\nExclude: " + exclusionString)

    queryKeywordsInNewTab(keywords, exclusionString);
}

async function onAhrefsCopyKwClicked() {
    console.log("On onAhrefsCopyKwClicked called");
    const activeTab = await getActiveTabURL();

    if (!activeTab.url || !activeTab.url.includes(ahrefsMatchingTermsUrl)) {
        setStatus("This button doesn't work on this page.\nTry: " + ahrefsMatchingTermsUrl);
        console.log("Url doesn't match the pattern: " + activeTab.url);
        return;
    }

    const response = await chrome.tabs.sendMessage(activeTab.id, { type: "copySelectedKeywords" });

    console.log("Received response: " + response.value);
    setStatus("Copied " + response.length + " keywords");
    navigator.clipboard.writeText(response.value);

    copyToClipboard(response.value);
}

// define a handler
function doc_keyUp(e) {
    // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
    if (e.key === '1') {
        console.log("Copy selected ahrefs keywords called");
        setStatus("Copy selected ahrefs keywords called");
        onAhrefsCopyKwClicked();
    } else if (e.key === '2') {
        console.log("Run keywords query in new tab");
        setStatus("Run keywords query in new tab");
        queryButtonHandler();
    } else if (e.key === '3') {
        console.log("3");
        setStatus("3");
        setKeywordHint();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('ahrefs_copy_kw');
    copyButton.addEventListener('click', onAhrefsCopyKwClicked, false);

    const queryButton = document.getElementById('ahrefs_run_query');
    queryButton.addEventListener('click', queryButtonHandler, false);

    setKeywordHint();
}, false);

function setKeywordHint() {
    const keywordHint = document.getElementById("keyword-hint");
    const keywordInClipboard = pasteFromClipboard();
    keywordHint.innerText = 'Keyword: "' + keywordInClipboard + '"';
}

// register the handler 
document.addEventListener('keyup', doc_keyUp, false);