export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });

    return tabs[0];
}


export async function addToClipboard(value) {
    clipboard.writeText(value).then(function(x) {
        alert("Link copied to clipboard: " + value);
    });
}

export async function getFromClipgoard() {
    const text = await window.navigator.clipboard.readText();

    alert("Got from clipboard: " + text);

    return text;
}