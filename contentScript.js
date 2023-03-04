(() => {
    const crawlForSelectedItems = async() => {
        // Get HTML table with keywords
        const kwTable = document.getElementsByClassName("keTable")[0];
        // Get list of <tr> elements
        const kwElementList = kwTable.getElementsByClassName("result-main is__selected");

        let entry = [];

        kwElementList.forEach(element => {
            console.log("Row has been selected!");

            const keyword = element.getElementsByClassName("resultsTable-keyword")[0]
                .querySelector('.css-a5m6co-text span').innerText();

            const dificulty = element.getElementsByClassName("resultsTable-difficulty")[0]
                .innerHTML().innerText();

            const volume = element.getElementsByClassName("resultsTable-volume")[0]
                .innerText();

            entry.push(keyword);
            entry.push(dificulty);
            entry.push(volume);
        });

        return entry;
    }

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, keyword } = obj;

        if (type === "NEW") {
            response(crawlForSelectedItems());
        }
        console.log("Finished processing");
    });
})()