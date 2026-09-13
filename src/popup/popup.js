async function sendActionToTab(actionName) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tab) {
        await chrome.tabs.sendMessage(tab.id, {
            action: actionName
        });
    }
}

document.getElementById('button-next-episode')
    .addEventListener('click', () => sendActionToTab('NEXT_EPISODE'));

document.getElementById('button-prev-episode')
    .addEventListener('click', () => sendActionToTab('PREV_EPISODE'));

async function getEpisodeInfo() {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tab) {
        await chrome.tabs.sendMessage(tab.id, {action: "GET_INFO"}, response => {
            if (response) {
                document.getElementById('episode-title').textContent = response.title || 'Unknown_episode';
            }
        });
    }
}

getEpisodeInfo().then(() => {});