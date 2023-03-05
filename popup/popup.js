import { getActiveTabURL, addToClipboard, getFromClipgoard } from "../utils.js";
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
    const keywordInput = document.getElementById('query-keyword-input');
    const keywords = keywordInput.value;
    const exclusionString = document.getElementById('query-exclude-input').value;

    if (keywords == "") {
        console.log("Keyword has not been provided");
        keywordInput.style.backgroundColor = "#000000";
        keywordInput.style.color = "#FFFFFF";
        keywordInput.placeholder = " Provide keyword!";

        setStatus("Provide keyword!");
        return;
    }

    queryKeywordsInNewTab(keywords, exclusionString);
}

async function onAhrefsCopyKwClicked() {
    console.log("Clicked");
    const activeTab = await getActiveTabURL();
    console.log("activeTab: " + activeTab);

    if (!activeTab.url || !activeTab.url.includes(ahrefsMatchingTermsUrl)) {
        navigator.clipboard.writeText("Url doesn't match the pattern: " + activeTab.url);
        console.log("Url doesn't match the pattern: " + activeTab.url);
        return;
    }

    const response = await chrome.tabs.sendMessage(activeTab.id, { type: "copySelectedKeywords" });

    console.log("Received response: " + response.value);
    setStatus("Copied " + response.length + " keywords");
    navigator.clipboard.writeText(response.value);

    addToClipboard(response.value);
}

