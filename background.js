let sites = [];

let site = {
    free: false,
    hostname: ''
};

function loadSites() {
    const url = chrome.runtime.getURL('src/database.json');

    fetch(url).then(res => res.json()).then(data => sites = data);
}

function extractHostname(url) {
    let hostname = url.split('/')[2];
    hostname = hostname.replace('www.', '');
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
}

function getCurrentTab() {
    return new Promise((resolve) => {
        let queryOptions = { active: true, currentWindow: true };
        chrome.tabs.query(queryOptions, (result) => resolve(result[0]));
    })
}

function isFree(url) {
    return sites.includes(url);
}

function setIcon(tabId, free = false) {
    let icon = `src/icons/icon-128${free ? '' : '-grey'}.png`;
    chrome.browserAction.setIcon({ tabId, path: icon });
}

async function onChange() {
    let tab = await getCurrentTab(),
        id = tab.id,
        url = tab.url,
        hostname = extractHostname(url),
        free = isFree(hostname);

    site = {
        free,
        hostname
    };

    setIcon(id, free);
}

chrome.tabs.onActivated.addListener(onChange);
chrome.tabs.onUpdated.addListener(onChange);
chrome.tabs.onReplaced.addListener(onChange);
chrome.tabs.onRemoved.addListener(onChange);
chrome.tabs.onMoved.addListener(onChange);

chrome.runtime.onConnect.addListener(port => {
    port.postMessage(site);
});

(() => {
    loadSites();
})();