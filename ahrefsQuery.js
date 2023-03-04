export function queryKeywordsInNewTab(keywords, exclusionString) {
    const space_code = "%20";
    const space_comma_code = "%2C";

    const keyphrases = keywords.split("\n");

    const encodedExclussionString = encode_string(exclusionString);
    for (const keyphrase of keyphrases) {
        query_keyphrase(keyphrase, encodedExclussionString);
    }
}

function encode_string(string) {
    return encodeURIComponent(string.replace(", ", ","));
}

function query_keyphrase(keyphrase, encoded_exclusion_string) {
    const base_url = "https://app.ahrefs.com/keywords-explorer/google/us/ideas/matchingTerms";
    const keyword_parameter_base = "?keyword=";
    const exclude_parameter_base = "&exclude=";

    const encoded_keywords = encode_string(keyphrase);

    const built_keyword_parameter = keyword_parameter_base + encoded_keywords;
    const built_exclude_parameter = exclude_parameter_base + encoded_exclusion_string;
    const resulting_url = base_url + built_keyword_parameter + built_exclude_parameter;

    console.log("resulting\n", resulting_url);

    chrome.tabs.create({ url: resulting_url });
}