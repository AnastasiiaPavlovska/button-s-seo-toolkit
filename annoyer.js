chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method == "changePage") {
            document.body.innerText = "Foot";
            sendResponse({ text: document.body.innerText, method: "changePage" }); //same as innerText
        }
    }
);