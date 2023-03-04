import { getActiveTabURL, addToClipboard } from "./utils.js";

const ahrefsMatchingTermsUrl = "https://app.ahrefs.com/keywords-explorer/google/us/ideas/matchingTerms";

document.addEventListener('DOMContentLoaded', function() {
    var copyButton = document.getElementById('ahrefs_copy_kw');
    copyButton.addEventListener('click', onAhrefsCopyKwClicked, false);

    var checkButton = document.getElementById('check');
    checkButton.addEventListener('click', function() {
        alert("Hey your button is working!");

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { method: "changePage" }, function(response) {

                if (response == undefined) {
                    alert("Resp: " + response);
                    return;
                }

                console.log(typeof response);

                if (response.method == "changePage") {
                    alert(response.text);
                }
            });
        });
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