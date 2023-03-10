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

    if (activeTab.url == null || !activeTab.url.includes(ahrefsMatchingTermsUrl)) {
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

// Entry point
document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('ahrefs_copy_kw');
    copyButton.addEventListener('click', onAhrefsCopyKwClicked, false);

    const queryButton = document.getElementById('ahrefs_run_query');
    queryButton.addEventListener('click', queryButtonHandler, false);

    document.getElementById('keywords-button')
        .addEventListener('click', showKeywordTab);

    document.getElementById('batch-analysis-button')
        .addEventListener('click', showBatchAnalysisTab);

    document.getElementById('linkbuilding-button')
        .addEventListener('click', showLinkBuildingTab);

    document.getElementById('goto-batch-analysis-page')
        .addEventListener('click', gotoBatchAnalysisPage);

    document.getElementById('copy-batch-analysis-data')
        .addEventListener('click', copyBatchAnalysisData);



    // Set first tab active
    document.getElementById("keywords-content").style.display = "block";
    document.getElementById('keywords-button').className += " active";

    setKeywordHint();
}, false);

function setKeywordHint() {
    const keywordHint = document.getElementById("keyword-hint");
    const keywordInClipboard = pasteFromClipboard();
    keywordHint.innerText = 'Keyword: "' + keywordInClipboard + '"';
}

// register the handler 
document.addEventListener('keyup', doc_keyUp, false);

function showTab(evt, tabId) {
    // Declare all variables
    var i, tabcontent, tabButtons;

    // alert(tabId);

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tabbutton" and remove the class "active"
    tabButtons = document.getElementsByClassName("tabbutton");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.className += " active";
}

function showKeywordTab(event) {
    showTab(event, "keywords-content")
}

function showBatchAnalysisTab(event) {
    showTab(event, "batch-analysis-content")
}

function showLinkBuildingTab(event) {
    showTab(event, "linkbuilding-content")
}

const batchAnalysisBaseUrl = "https://app.ahrefs.com/batch-analysis";

function gotoBatchAnalysisPage(event) {
    chrome.tabs.create({ url: batchAnalysisBaseUrl });
}

async function copyBatchAnalysisData(event) {
    alert("Вітаю, ви мертві!");

    console.log("On onAhrefsCopyKwClicked called");
    const activeTab = await getActiveTabURL();

    if (activeTab.url == null || !activeTab.url.includes(batchAnalysisBaseUrl)) {
        setStatus("This button doesn't work on this page.\nTry: " + batchAnalysisBaseUrl);
        console.log("Url doesn't match the pattern: " + activeTab.url);
        return;
    }

    const response = await chrome.tabs.sendMessage(activeTab.id, { type: "copyBatchAnalysisData" });

    console.log("Received response: " + response.value);
    setStatus("Copied " + response.length + " rows");
    copyToClipboard(response.value);
}