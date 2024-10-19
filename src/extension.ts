import {
  window,
  commands,
  workspace,
  TextDocument,
  ExtensionContext,
} from "vscode";
import { getPackagesData, isValidLanguage } from "./utils";
import { clearDecorations, setDecorations } from "./decorator";

let isEnabled = true;

export async function activate(context: ExtensionContext) {
  processDocument(window.activeTextEditor?.document);

  const disposables = [
    workspace.onDidSaveTextDocument(processDocument),
    window.onDidChangeActiveTextEditor((ev) => processDocument(ev?.document)),
    commands.registerCommand("expo-import-cost.toggle", () => {
      if ((isEnabled = !isEnabled)) {
        processDocument(window.activeTextEditor?.document);
      } else {
        deactivate();
      }
    }),
  ];

  context.subscriptions.push(...disposables);
}

export function deactivate() {
  clearDecorations();
}

async function processDocument(document?: TextDocument) {
  if (!isEnabled || !document || !isValidLanguage(document)) return;

  const data = await getPackagesData(
    document.fileName,
    document.getText().split("\n")
  );
  if (!data) return;

  setDecorations(document.fileName, data);
}
