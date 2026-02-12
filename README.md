# About

LMU Setup Viewer is a lightweight desktop application to view and compare LMU setups. It came into being as I wanted a quick and hassle-free way to compare car setups across different tracks without having to load up the game every time.

https://github.com/user-attachments/assets/d083db1f-8bb3-4077-b35d-775abcd53888

## Key features
- **Sectioned setup views**: View setup properties grouped according to the in-game UI.
- **Side-by-side comparison**: Load two setups at once for direct comparison.
- **Difference highlighting**: Optionally highlight changed settings and show per-section diff counts.
- **Track-based setup grouping**: Setup selectors group entries by track.
- **Track quick-jump index**: Jump directly to a track in long setup lists.
- **Class filtering**: Show only selected car classes in setup selectors.
- **Custom class sort order**: Control how classes are ordered in setup lists.
- **Hotkey navigation**: Use keyboard shortcuts for faster navigation.
- **LMU-inspired UX**: UX mirrors the look and feel of the game.

## Download & initial configuration
Get the latest version of the app from the [releases page](https://github.com/porgabi/lmu-setup-viewer/releases/latest).

When first running the app, the root folder of the game ("Le Mans Ultimate") must be set in order to load the setup files. This folder is typically found under the `\SteamLibrary\steamapps\common\Le Mans Ultimate` path.

## Updates
Users can choose between letting the app automatically check for updates or doing so manually. If there's a newer version found, simply download the new EXE and replace the old one with it.

## Hotkeys
LMU Setup Viewer comes with a few default hotkeys to aid in quick navigation:
- **O**: Open options
- **R**: Reload setups
- **1**: Open setup selector 1
- **2**: Open setup selector 2
- **C**: Toggle comparison mode
- **Ctrl + Tab**: Cycle setup tabs forward
- **Ctrl + Shift + Tab**: Cycle setup tabs backward

## Custom options
The app includes various options for further customization:
- Setup sorting order: Allows changing the class-based ordering of setups in the setup selectors.
- Setup list size: Determines the number of setups shown at once in the setup selectors.
- Setup table text size: Sets the font size in the setup tables.

## Feedback & support
If you have any feedback regarding the app, feel free to send a message to lmu.setupviewer@gmail.com or create an issue in the repository.
Optional donations are also available via [Ko-fi](https://ko-fi.com/admgpr).

[![Ko-fi page](ko-fi_banner.png)](https://ko-fi.com/admgpr)

## Supported platforms
Windows 10/11 is the primary supported OS. Linux should also be supported, however I haven't had the chance to test it yet so no promises.

## Technical overview
LMU Setup Viewer is built using Electron, React, MUI, and plain JS (which is likely to get swapped for TS later).

AI coding tools were used in the creation of this application.
