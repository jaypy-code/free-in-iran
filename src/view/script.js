const
    port = chrome.runtime.connect();

port.onMessage.addListener((data) => {
    let free = data['free'], hostname = data['hostname'];

    if (!free) document.body.classList.add('grey');
    else document.body.classList.remove('grey');

    document.getElementById('url').innerText = hostname;
});
