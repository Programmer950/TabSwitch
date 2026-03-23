const screenshots: Record<number, string> = {};

const resizeImage = async (dataUrl: string, targetWidth: number): Promise<string> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const scale = targetWidth / bitmap.width;
    const targetHeight = bitmap.height * scale;

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    const resizedBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 });

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(resizedBlob);
    });
};

export default defineBackground(() => {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.active) {
            browser.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 50 })
                .then(async (dataUrl) => {
                    const resizedUrl = await resizeImage(dataUrl, 400);
                    screenshots[tabId] = resizedUrl;
                }).catch(() => {});
        }
    });

    browser.commands.onCommand.addListener(async (command) => {
        if (command === "toggle-switcher" || command === "toggle-switcher-reverse") {
            const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

            if (!tab || !tab.id || !tab.url) return;

            const isRestricted = tab.url.startsWith('chrome://') ||
                tab.url.startsWith('about:') ||
                tab.url.startsWith('https://chromewebstore.google.com');

            if (isRestricted) {
                browser.action.setBadgeBackgroundColor({ color: '#FF0000' });
                browser.action.setBadgeText({ text: '!' });
                browser.action.setTitle({ title: 'Restricted Page' });
                setTimeout(() => browser.action.setBadgeText({ text: '' }), 3000);
                return;
            }

            browser.tabs.sendMessage(tab.id, {
                action: "NEXT_TAB",
                isShift: command === "toggle-switcher-reverse"
            });
        }
    });

    browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.action === "GET_TABS_WITH_SCREENSHOTS") {
            browser.tabs.query({}).then(tabs => {
                const tabsWithData = tabs.map(t => ({
                    ...t,
                    screenshot: screenshots[t.id!] || null
                }));
                sendResponse(tabsWithData);
            });
            return true;
        }

        if (msg.action === "EXECUTE_SWITCH") {
            browser.tabs.update(msg.tabId, { active: true }).then((tab) => {
                if (tab.windowId) {
                    browser.windows.update(tab.windowId, { focused: true });
                }
            });
        }

        if (msg.action === "CLOSE_TAB") {
            browser.tabs.remove(msg.tabId);
        }

        if (msg.action === "TOGGLE_MUTE") {
            browser.tabs.update(msg.tabId, { muted: msg.muteState });
        }
    });

    browser.tabs.onRemoved.addListener((tabId) => {
        if (screenshots[tabId]) {
            delete screenshots[tabId];
        }
    });
});