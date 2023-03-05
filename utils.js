export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });

    return tabs[0];
}


export async function copyToClipboard(value) {
    await navigator.clipboard.writeText(value);
}

export function pasteFromClipboard() {
    const inputElement = document.createElement("input");
    document.body.appendChild(inputElement);

    inputElement.focus();
    document.execCommand("paste");
    const clipboardText = inputElement.value; //this is your clipboard data
    document.body.removeChild(inputElement);
    return clipboardText;
}

// export async function pasteFromClipboard() {
//     return await navigator.clipboard.readText();
// }

export async function readClipboardFromDevTools() {
    return new Promise((resolve, reject) => {
        const _asyncCopyFn = (async() => {
            try {
                const value = await navigator.clipboard.readText();
                console.log(`${value} is read!`);
                resolve(value);
            } catch (e) {
                reject(e);
            }
            window.removeEventListener("focus", _asyncCopyFn);
        });

        window.addEventListener("focus", _asyncCopyFn);
        console.log("Hit <Tab> to give focus back to document (or we will face a DOMException);");
    });
}

export async function parseShortNumber(shortNumber) {
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