# 🔄 TabSwitch

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-_Published-green?logo=googlechrome&logoColor=white)](#)
[![Tech Stack](https://img.shields.io/badge/Built_with-React_%7C_Vite_%7C_WXT-000000?logo=react)](https://wxt.dev)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Local-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightning-fast, privacy-first visual tab manager for Chromium browsers. 

TabSwitch replaces the mental friction of hunting through dozens of tiny browser tabs with a clean, searchable, visual grid overlay. Built for speed and productivity, it operates entirely locally with zero telemetry.

> **Demo:**

<video>https://github.com/user-attachments/assets/99794257-2eac-4659-bc04-0a2777856d24</video>

## 🧠 The Problem & The Solution

Power users and developers regularly operate with 30+ open tabs, rendering standard browser tab bars unreadable. Existing tab managers often rely on heavy cloud syncing or require invasive background permissions that compromise user privacy.

**TabSwitch** solves this by leveraging modern browser APIs to capture real-time visual states of your tabs, rendering them in a highly optimized React overlay. 
- **Zero-Telemetry:** Screenshots and tab data never leave your local machine.
- **Instant Invocation:** Bypasses standard DOM rendering delays for instant access.

## ✨ Core Features

- **Visual Grid Navigation:** See actual snapshots of your tabs, not just favicons.
- **Lightning Search:** Fuzzy-search through all open tabs by title or URL instantly.
- **Keyboard-First:** Navigate the entire UI without ever touching your mouse.
- **100% Local Processing:** Uses `captureVisibleTab` to handle visual data securely within the browser sandbox. No external servers, no databases.

## ⌨️ Shortcuts

TabSwitch is designed to keep your hands on the keyboard.

- **Windows / Linux:** `Alt + Q`
- **macOS:** `Option + Q` (⌥ + Q)
- **Navigate Grid:** `Arrow Keys` or `Tab`
- **Select Tab:** `Enter`
- **Close Tab:** `Delete` / `Backspace`

## 🛠️ Architecture & Tech Stack

This extension was built using a modern, web-first tooling ecosystem rather than legacy Manifest V3 boilerplate:

- **[React 18](https://react.dev/):** Component-based UI rendering.
- **[Vite](https://vitejs.dev/):** Ultra-fast Hot Module Replacement (HMR) and optimized build bundling.
- **[WXT Framework](https://wxt.dev/):** The next-gen framework for cross-browser extensions, ensuring strict Manifest V3 compliance and seamless background service worker management.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first styling for a lightweight, responsive grid.

## 🚀 Local Development

Want to build on top of TabSwitch or see how it works under the hood? 

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/TabSwitch.git](https://github.com/yourusername/TabSwitch.git)
   cd TabSwitch
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
4. **Build for Production:**
   ```bash
   npm run build
   ```

🔒 **Privacy Policy**
TabSwitch respects user data. It requests the tabs and <all_urls> permissions strictly to read your current session's tab titles, URLs, and to generate the local visual grid. No data is collected, transmitted, or stored off-device. For more info visit **[privacy policy](https://programmer950.github.io/privacy.html)**.

📄 License
Distributed under the MIT License. See **LICENSE** for more information.
