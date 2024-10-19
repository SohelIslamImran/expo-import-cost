import {
  Range,
  window,
  Position,
  DecorationOptions,
  DecorationRenderOptions,
} from "vscode";
import { formatByteSize } from "./utils";
import { PackageData, PackagesMap } from "./types";

const decorations = new Map<string, PackagesMap>();
const decorationType = window.createTextEditorDecorationType({});

export function setDecorations(fileName: string, packagesMap: PackagesMap) {
  decorations.set(fileName, packagesMap);
  debounceFlushDecorations(fileName);
}

export function clearDecorations() {
  for (const editor of window.visibleTextEditors) {
    editor.setDecorations(decorationType, []);
  }
}

let debounce: NodeJS.Timeout;
function debounceFlushDecorations(fileName: string) {
  clearTimeout(debounce);
  debounce = setTimeout(() => flushDecorations(fileName), 10);
}

function flushDecorations(fileName: string) {
  const arr: DecorationOptions[] = [];

  const packages = decorations.get(fileName);
  if (!packages) return;

  for (const line of packages.keys()) {
    const data = packages.get(line)!;

    arr.push({
      range: new Range(
        new Position(line - 1, 1024),
        new Position(line - 1, 1024)
      ),
      hoverMessage: `All file sizes are calculated based on the transpiled JavaScript byte size.\n\nWhile these sizes might differ from actual bundle size when using [Hermes Bytecode (HBC)](https://github.com/facebook/hermes/blob/main/doc/Design.md), the relative proportions are still correct.`,
      renderOptions: getDecorationOptions(data),
    });
  }

  for (const editor of window.visibleTextEditors) {
    if (editor.document.fileName === fileName) {
      editor.setDecorations(decorationType, arr);
    }
  }
}

function getDecorationOptions(data: PackageData[]): DecorationRenderOptions {
  const contentText = data
    .map((item) => `${item.platform}: ${formatByteSize(item.size)}`)
    .join(" | ");

  return {
    ...getColors(data[0].size / 1024),
    after: { contentText, margin: "0 0 0 1rem" },
  };
}

function getColors(sizeInKB: number) {
  if (sizeInKB < 50) {
    return {
      dark: { after: { color: "#7cc36e" } },
      light: { after: { color: "#7cc36e" } },
    };
  } else if (sizeInKB < 100) {
    return {
      dark: { after: { color: "#7cc36e" } },
      light: { after: { color: "#7cc36e" } },
    };
  } else {
    return {
      dark: { after: { color: "#d44e40" } },
      light: { after: { color: "#d44e40" } },
    };
  }
}
