import { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, Command, XCircle, Search, X, Volume2, VolumeX } from 'lucide-react';
import Fuse from 'fuse.js';

export default () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [tabs, setTabs] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [query, setQuery] = useState('');

    const stateRef = useRef({ isOpen, isSticky, tabs, selectedIndex, query });
    stateRef.current = { isOpen, isSticky, tabs, selectedIndex, query };

    const inputRef = useRef<HTMLInputElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const filteredTabs = useMemo(() => {
        if (!query) return tabs;
        const fuse = new Fuse(tabs, { keys: ['title', 'url'], threshold: 0.4 });
        return fuse.search(query).map(r => r.item);
    }, [query, tabs]);

    const performSwitch = (tab: any) => {
        if (tab) {
            browser.runtime.sendMessage({ action: "EXECUTE_SWITCH", tabId: tab.id });
            setIsOpen(false);
            setIsSticky(false);
        }
    };

    const closeTab = (e: React.MouseEvent, tabId: number) => {
        e.stopPropagation();
        browser.runtime.sendMessage({ action: "CLOSE_TAB", tabId });

        setTabs(prev => {
            const updated = prev.filter(t => t.id !== tabId);
            setSelectedIndex(curr => Math.min(curr, Math.max(0, updated.length - 1)));
            return updated;
        });
    };

    const toggleMute = (e: React.MouseEvent | null, tab: any) => {
        if (e) e.stopPropagation();
        if (!tab) return;

        const isCurrentlyMuted = tab.mutedInfo?.muted;

        browser.runtime.sendMessage({
            action: "TOGGLE_MUTE",
            tabId: tab.id,
            muteState: !isCurrentlyMuted
        });

        setTabs(prev => prev.map(t =>
            t.id === tab.id
                ? { ...t, mutedInfo: { ...t.mutedInfo, muted: !isCurrentlyMuted } }
                : t
        ));
    };

    useEffect(() => {
        if (gridRef.current && isOpen) {
            const selectedElement = gridRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest' // Ensures it only scrolls the minimum amount necessary
                });
            }
        }
    }, [selectedIndex, isOpen]);

    useEffect(() => {
        const handleMessage = (msg: any) => {
            if (msg.action === "NEXT_TAB") {
                if (!stateRef.current.isOpen) {
                    browser.runtime.sendMessage({ action: "GET_TABS_WITH_SCREENSHOTS" }).then(res => {
                        setTabs(res || []);
                        setIsOpen(true);
                        setQuery('');
                        const activeIdx = res.findIndex((t: any) => t.active);
                        setSelectedIndex(activeIdx !== -1 ? activeIdx : 0);
                    });
                } else {
                    const step = msg.isShift ? -1 : 1;
                    setSelectedIndex(prev => {
                        const next = prev + step;
                        if (next < 0) return filteredTabs.length - 1;
                        return next % filteredTabs.length;
                    });
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!stateRef.current.isOpen) return;

            if (e.key.toLowerCase() === 's' && document.activeElement !== inputRef.current) {
                e.preventDefault();
                setIsSticky(true);
                inputRef.current?.focus();
                return;
            }

            if (e.key.toLowerCase() === 'm' && document.activeElement !== inputRef.current) {
                e.preventDefault();
                toggleMute(null, filteredTabs[stateRef.current.selectedIndex]);
                return;
            }

            if (e.key >= '0' && e.key <= '9' && document.activeElement !== inputRef.current) {
                const num = parseInt(e.key);
                const targetIdx = num === 0 ? 9 : num - 1;
                performSwitch(filteredTabs[targetIdx]);
            }

            if (e.key === "Enter") {
                performSwitch(filteredTabs[stateRef.current.selectedIndex]);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Alt" && stateRef.current.isOpen && !stateRef.current.isSticky) {
                performSwitch(filteredTabs[stateRef.current.selectedIndex]);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                setIsSticky(false);
            }
        };

        browser.runtime.onMessage.addListener(handleMessage);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            browser.runtime.onMessage.removeListener(handleMessage);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [filteredTabs]);

    if (!isOpen) return null;

    return (
        <div className="alt-tab-overlay" onClick={() => setIsOpen(false)}>
            <div className="switcher-container" onClick={e => e.stopPropagation()}>
                <div className={`search-bar-wrapper ${isSticky ? 'active-search' : ''}`}>
                    <Search size={18} className="search-icon" />
                    <input
                        ref={inputRef}
                        autoFocus={isSticky}
                        placeholder="Press S to Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsSticky(true)}
                        className="search-input"
                    />
                </div>

                <div className="alt-tab-grid" ref={gridRef}>
                    {filteredTabs.map((tab, i) => (
                        <div
                            key={tab.id}
                            className={`alt-tab-card ${i === selectedIndex ? 'selected' : ''}`}
                            onClick={() => performSwitch(tab)}
                            onMouseEnter={() => setSelectedIndex(i)}
                        >
                            <div className="tab-number-badge">{i < 9 ? i + 1 : (i === 9 ? 0 : '')}</div>

                            {/* Audio / Mute Button */}
                            {(tab.audible || tab.mutedInfo?.muted) && (
                                <div
                                    className={`mute-tab-btn ${tab.mutedInfo?.muted ? 'is-muted' : 'is-playing'}`}
                                    onClick={(e) => toggleMute(e, tab)}
                                >
                                    {tab.mutedInfo?.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </div>
                            )}

                            <div className="close-tab-btn" onClick={(e) => closeTab(e, tab.id)}>
                                <X size={14} />
                            </div>

                            <div className="preview-container">
                                {tab.screenshot ? (
                                    <img src={tab.screenshot} className="screenshot-img" />
                                ) : (
                                    <Globe size={40} color="#3a3a3c" strokeWidth={1} />
                                )}

                                {tab.audible && !tab.mutedInfo?.muted && (
                                    <div className="mute-hint">Press <strong>M</strong> to mute</div>
                                )}
                            </div>
                            <div className="tab-footer">
                                <img src={tab.favIconUrl || ''} className="tab-icon" />
                                <span className="tab-name">{tab.title}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {isSticky && (
                    <div className="sticky-indicator">Sticky Mode Active - Press ESC to cancel</div>
                )}
            </div>
        </div>
    );
};