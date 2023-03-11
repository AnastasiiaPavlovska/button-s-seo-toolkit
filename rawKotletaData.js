class RawKotleta {
    constructor(url, anchor) {
        this.url = url;
        this.anchor = anchor;
    }
}


export function mapTsvToRawKotletaList(contents) {
    const rows = contents.split("\n");

    const result = [];

    console.log("Start mapping");

    for (let i = 0; i < rows.length; i += 1) {
        let pair = rows[i].split("\t");
        console.log("[" + i + "] Creating kotleta with url: " + pair[0] + ", anchor: " + pair[1]);
        result.push(new RawKotleta(pair[0], pair[1]));
    }
    console.log("Finished mapping. Got " + result.length + " kotletas");

    return result;
}

// var popupWindow = window.open(
//     chrome.extension.getURL("normal_popup.html"),
//     "exampleName",
//     "width=400,height=400"
// );
// window.close(); // close the Chrome extension pop-up