/**
 * The five worlds, as light.
 *
 * The ground is cornsilk everywhere. A room does not repaint the floor dark —
 * it tints the paper, barely, the way light through a coloured window falls on
 * a white wall. Warmth at low lightness reads as mud, which is exactly what
 * went wrong when these were dark; at high lightness the same hues read as
 * air. The project's actual colour lives in its ink instead, where it can be
 * vivid without dirtying anything.
 *
 * One source of truth, because two things need identical values: each room
 * tints itself with them, and the atmosphere behind interpolates between them
 * so the ground shifts continuously rather than cutting at a seam. Held as RGB
 * triples so they can be mixed arithmetically.
 */

export type RoomWorld = {
  /** the tinted paper this room stands on */
  ground: [number, number, number];
  /** reading ink for that paper */
  ink: string;
  /** the project's own colour, at a weight legible on paper */
  accentInk: string;
};

/** the housing's own ground — cornsilk, where no room is near */
export const HOUSING: [number, number, number] = [248, 243, 228];

export const ROOM_WORLDS: Record<string, RoomWorld> = {
  "fluxion-studios": {
    ground: [250, 236, 234],
    ink: "#1a1010",
    accentInk: "#b01020",
  },
  "design-or-disaster": {
    ground: [251, 236, 227],
    ink: "#1a1310",
    accentInk: "#b8301c",
  },
  // plum — sovereign correction ink
  pentimento: {
    ground: [247, 236, 245],
    ink: "#17111a",
    accentInk: "#7d2657",
  },
  // amber — the lamp left on while away
  "invisible-interfaces": {
    ground: [253, 245, 224],
    ink: "#1a1608",
    accentInk: "#8a5c07",
  },
  // pine — the surveyor's field
  atlas: {
    ground: [232, 244, 241],
    ink: "#0d1817",
    accentInk: "#12615a",
  },
  // olive — the daily pulse
  daynero: {
    ground: [242, 247, 227],
    ink: "#14180d",
    accentInk: "#566f18",
  },
};

export const rgb = (c: [number, number, number]) => `${c[0]} ${c[1]} ${c[2]}`;
