import { AtlasBundle, AtlasModule } from "expo-atlas";

export type PartialAtlasBundle = Pick<
  AtlasBundle,
  | "id"
  | "platform"
  | "projectRoot"
  | "sharedRoot"
  | "entryPoint"
  | "environment"
  | "modules"
>;

export type TreemapNode = {
  /** If the current node is the root of the treemap */
  isRoot?: true;
  /** The current path of the node */
  name: string;
  /** The size, in percentage, of all modules within this node (based on `module.size`) */
  value: number;
  /** Possible files/folders within this node */
  children?: TreemapNode[];
  /** The size, in bytes, of all modules within this node (based on `module.size`) */
  moduleSize: number;
  /** The amount of module files within this node group */
  moduleFiles: number;
  /** The absolute path of this node group, based on `module.path` segments */
  moduleAbsolutePath: string;
  /** The relative path of this node group to the bundle's `sharedRoot`, based on `module.path` segments */
  moduleRelativePath: string;
  /** If this group is the root path of a module, the module name */
  modulePackage?: string;
  /** The treemap item style, set for individual packages */
  itemStyle?: { color: string };
};

export type ModuleGraphResponse = {
  data: TreemapNode;
  bundle: {
    platform: "android" | "ios" | "web";
    moduleSize: number;
    moduleFiles: number;
  };
  filtered: {
    moduleSize: number;
    moduleFiles: number;
  };
};

/** The partial module data, when listing all available modules from an entry */
export type PartialModule = Omit<AtlasModule, "source" | "output">;

export type ModuleListResponse = {
  data: PartialModule[];
  bundle: {
    platform: "android" | "ios" | "web";
    moduleSize: number;
    moduleFiles: number;
  };
  filtered: {
    moduleSize: number;
    moduleFiles: number;
  };
};

export type PackageData = { name: string; platform: string; size: number };

export type PackagesMap = Map<number, PackageData[]>;
