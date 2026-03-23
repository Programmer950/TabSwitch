import { Command, Keyboard, Search, VolumeX } from 'lucide-react';

export default function App() {

    const openSwitcher = async () => {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
            // Send the message to the active tab to open the overlay
            browser.tabs.sendMessage(tab.id, { action: "NEXT_TAB" });
            // Close this popup menu
            window.close();
        }
    };

    return (
        <div className="popup-container">
            <div className="header">
                <div className="logo-placeholder">GS</div>
                <h2>GridSwitch</h2>
            </div>

            <p className="subtitle">Your visual tab manager.</p>

            <button className="launch-btn" onClick={openSwitcher}>
                <Command size={16} />
                Launch Switcher
            </button>

            <div className="cheat-sheet">
                <h3>Keyboard Shortcuts</h3>

                <div className="shortcut-row">
                    <span className="key-combo"><kbd>Alt</kbd> + <kbd>Q</kbd></span>
                    <span className="desc">Open / Next Tab</span>
                </div>

                <div className="shortcut-row">
                    <span className="key-combo"><kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>Q</kbd></span>
                    <span className="desc">Previous Tab</span>
                </div>

                <div className="shortcut-row">
                    <span className="key-combo"><kbd>S</kbd></span>
                    <span className="desc">Sticky Search Mode</span>
                </div>

                <div className="shortcut-row">
                    <span className="key-combo"><kbd>M</kbd></span>
                    <span className="desc">Mute / Unmute Tab</span>
                </div>

                <div className="shortcut-row">
                    <span className="key-combo"><kbd>1</kbd> - <kbd>9</kbd></span>
                    <span className="desc">Quick Select</span>
                </div>
            </div>
        </div>
    );
}