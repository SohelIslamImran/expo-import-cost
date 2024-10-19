# Expo Import Cost VSCode Extension

This extension will display inline in the editor the size of the imported package and file. The extension utilizes [expo-atlas](https://github.com/expo/atlas) in order to detect the imported size

Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sohelislamimran.expo-import-cost)

This extension is based on [expo-atlas](https://github.com/expo/atlas) and inspired by [wix's import cost extension](https://github.com/wix/import-cost/tree/master/packages/vscode-import-cost).

## Features

Calculates the size of imports and requires. Supports both `Javascript` and `Typescript`

![Example Image](./images/example.png)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

This extension require [Expo Atlas](https://docs.expo.dev/guides/analyzing-bundles/#using-atlas-with-npx-expo-start) to be enabled. Atlas is built into Expo starting from SDK 51, and enabled when defining the environment variable `EXPO_UNSTABLE_ATLAS=true`.

```bash
$ EXPO_UNSTABLE_ATLAS=true npx expo start
```

> [!TIP]
> Expo start runs in development mode by default. If you want to see a production bundle of your app, you can start the local dev server in production mode: `$ expo start --no-dev`.

Follow the documentation for more guide: https://docs.expo.dev/guides/analyzing-bundles/#using-atlas-with-npx-expo-start

Then start your project for any platform `$ expo start -p ios | android | web`

## Extension Settings

You can toggle this extension to show or hide by `Shift+Cmd+P` and `Toggle Expo Import Cost`

---

**Enjoy!**
