// import { parseShortNumber } from "./utils.js";
copyButtonCSS = "outline: #000000; outline-style: solid; align: center;outline-width: 1px; width: 100%; font-size: 12px;color: #ffffff; background-color: #90000e; border-radius: 12px; border: 0; padding: 3px;";

function parseShortNumber(shortNumber) {
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

// let arr = []; -> Створити масив даних (як в пайтоні)
// arr.push(obj) -> вставити елемент 'obj' в кінець масиву
// document.getElementsByClassName(className) -> отримати ВСІ елементи у яких співпадає "className"
// document.getElementById(id) -> отримати ОДИН елемент у якого айді співпадає з id
// element.querySelector(selector) -> отримати перший елемент у якого співпадає один із параметрів (айді або клас);


function crawlForSelectedItems() {
    // Get HTML table with keywords
    let teblycia = document.getElementById("batch_data_table");
    let tbody = teblycia.getElementsByTagName("tbody")[0];
    let rows = tbody.getElementsByTagName("tr");

    let result = [];

    Array.prototype.forEach.call(rows, row => {
        let rowResult = [];

        console.log("Row has been selected!");

        let url = row.getElementsByClassName("text-left p-l-px10 b-r-1px")[0] // <td>
            .getElementsByTagName("a")[0] // <a>
            .attributes // { "href":(Object), ..., ... ,... } 
            .href // (href js object)
            .textContent; // text

        let traffic = Number(row.getElementsByClassName("text-xs-right b-r-1px")[1].textContent.replaceAll(",", ""));

        let dr = Number(row.getElementsByClassName("text-xs-left")[2].textContent.replaceAll(",", ""));

        let rdTotal = Number(row.getElementsByClassName("text-xs-right")[4].textContent.replaceAll(",", ""));

        let domains = Number(row.getElementsByClassName("text-xs-right  b-r-1px ")[5].textContent.replaceAll(",", ""));

        rowResult.push(url, traffic, dr, rdTotal, domains);
        result.push(rowResult.join("\t"))
    });

    return result;
}


async function onCopyButtonClicked() {
    const result = crawlForSelectedItems();
    console.log("Copying: " + result.join("\n"));
    await navigator.clipboard.writeText(result.join("\n"));
}

function addCopyButton(buttonCSS) {
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy selected Target + Traffic + DR + RD Total + Domains';
    copyButton.style.cssText = buttonCSS;

    document.body.appendChild(copyButton);

    copyButton.addEventListener('click', onCopyButtonClicked, false);
}

// Add button 
addCopyButton(copyButtonCSS);