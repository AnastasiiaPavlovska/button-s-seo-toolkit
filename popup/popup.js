import { getActiveTabURL, addToClipboard, getFromClipgoard } from "../utils.js";
import { queryKeywordsInNewTab } from "../ahrefsQuery.js";

const ahrefsMatchingTermsUrl = "https://app.ahrefs.com/keywords-explorer/google/us/ideas/matchingTerms";

document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('ahrefs_copy_kw');
    copyButton.addEventListener('click', onAhrefsCopyKwClicked, false);

    // Run query for new keywords
    const checkButton = document.getElementById('ahrefs_run_query');
    checkButton.addEventListener('click', function() {
        let keywords;
        window.navigator.clipboard.readText().then(text => {
            alert("Pasted text: " + text);
            keywords = text;
        })
        const exclusionString = "dog, pet, children";
        queryKeywordsInNewTab(keywords, exclusionString);
    }, false);
}, false);

async function onAhrefsCopyKwClicked() {
    console.log("Clicked");

    alert("Hey you!");

    addToClipboard("response");
    alert("Copied!");
    const activeTab = await getActiveTabURL();

    if (tab.url && tab.url.includes(ahrefsMatchingTermsUrl)) {
        chrome.tabs.sendMessage(tabId, {
                type: "NEW",
                keyword: urlParameters.get("keyword"),
            },
            (response) => {
                console.log("Received response: " + response)
                var len = response.length();
                var status_bar = document.getElementById("status_bar");
                status_bar.innerText = "Copied " + len + " keywords";
                addToClipboard(response);
            });
    }
}