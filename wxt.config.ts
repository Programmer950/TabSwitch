import { defineConfig } from 'wxt';

export default defineConfig({
    manifest: {
        name: "TabSwitch: Visual Tab Manager",
        description: "Instantly find, mute, and switch tabs using a beautiful, keyboard-driven visual grid.",
        version: "1.0.0",
        permissions: ['tabs', 'storage'],
        host_permissions: ['<all_urls>'],
        commands: {
            "toggle-switcher": {
                "suggested_key": {
                    "default": "Alt+Q",
                    "mac": "Alt+Q"
                },
                "description": "Open Tab Switcher"
            },
            "toggle-switcher-reverse": {
                "suggested_key": {
                    "default": "Alt+Shift+Q",
                    "mac": "Alt+Shift+Q"
                },
                "description": "Previous Tab"
            }
        }
    }
});