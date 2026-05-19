export type LayoutId = "sidebar" | "bento" | "minimal";

export interface LayoutDefinition {
  id: LayoutId;
  name: string;
  description: string;
}

export const LAYOUTS: LayoutDefinition[] = [
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Sticky profile card with a scrolling right feed.",
  },
  {
    id: "bento",
    name: "Bento Grid",
    description: "Dynamic multi-column masonry grid.",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Sleek, centered single-column layout.",
  },
];
