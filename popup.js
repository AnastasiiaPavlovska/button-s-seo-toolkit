import { getActiveTabURL, addToClipboard } from "./utils.js";

const ahrefsMatchingTermsUrl = "https://app.ahrefs.com/keywords-explorer/google/us/ideas/matchingTerms";

document.addEventListener('DOMContentLoaded', function() {
    var copyButton = document.getElementById('ahrefs_copy_kw');
    copyButton.addEventListener('click', onAhrefsCopyKwClicked, false);

    var checkButton = document.getElementById('check');
    checkButton.addEventListener('click', function() {
        alert("Hey your button is working!");
    }, false);
}, false);

// document.addEventListener("DOMContentLoaded", async() => {
//     const activeTab = await getActiveTabURL();
//     const queryParameters = activeTab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);

//     var checkButton = document.getElementById('check');
//     checkButton.addEventListener('click', function() {
//         alert("Hey your button is working!");
//     }, false);

//     HTMLElement: button = document.getElementById("check")[0];
//     if (activeTab.url.includes(ahrefsMatchingTermsUrl)) {
//         button.name = 'Active';
//     } else {
//         button.name = 'Inactive';
//     }
// });

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