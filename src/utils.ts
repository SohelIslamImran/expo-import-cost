import { TextDocument } from "vscode";
import { getBundleData } from "./atlas";
import { PackagesMap } from "./types";

const validLanguages = new Set([
  "typescript",
  "typescriptreact",
  "javascript",
  "javascriptreact",
  "ts",
  "tsx",
  "js",
  "jsx",
]);

export function isValidLanguage({ fileName, languageId }: TextDocument) {
  return (
    validLanguages.has(languageId) && validLanguages.has(fileName.split(".")[1])
  );
}

export function findImportLine(lines: string[], pkg: string): number | null {
  const escapedPkg = pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `\\b(from|import|require)\\s*(?:{[^}]*}\\s*from\\s*)?[("'](?:@/|\\.{1,2}/)?(?:${escapedPkg}|.*?${escapedPkg})(?:\\.\\w+)?[)"']`,
    "i"
  );

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (regex.test(line)) return i + 1;
  }

  return null;
}

export async function getPackagesData(fileName: string, lines: string[]) {
  const bundleData = await getBundleData();
  if (!bundleData) return null;

  const data: PackagesMap = new Map();

  for (let i = 0; i < bundleData.length; i++) {
    const module = bundleData[i];
    const { imports } = module.data.get(fileName) ?? {};
    if (!imports) continue;

    for (const pkg of imports) {
      const pkgName = pkg.package || pkg.relativePath.replace(/\.\w+$/, "");
      const lineNumber = findImportLine(lines, pkgName);
      if (!lineNumber) continue;

      let existLineData = data.get(lineNumber) ?? [];
      if (existLineData?.[i]?.name === pkgName) continue;

      const pkgData = module.data.get(pkg.absolutePath);
      if (!pkgData) continue;

      data.set(lineNumber, [
        ...existLineData,
        {
          name: pkgName,
          size: pkgData.size,
          platform: module.bundle.platform,
        },
      ]);
    }
  }

  return data;
}

/**
 * Format files or bundle size, from bytes to the nearest unit.
 * This uses the decimal system with a scaling factor of `1024`.
 */
export function formatByteSize(byteSize: number, scalingFactor = 1024) {
  if (byteSize < scalingFactor) {
    return byteSize + "B";
  } else if (byteSize < scalingFactor * scalingFactor) {
    return (byteSize / scalingFactor).toFixed(1) + "KB";
  } else {
    return (byteSize / scalingFactor / scalingFactor).toFixed(1) + "MB";
  }
}
