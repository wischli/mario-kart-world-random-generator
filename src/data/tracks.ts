export interface Track {
  id: number;
  name: string;
  x: number;
  y: number;
  isNew: boolean;
  origin?: string;
}

export interface SelectedTrack extends Track {
  order: number;
}

export const TRACKS: Track[] = [
  // New Tracks (16)
  { id: 1, name: "Mario Bros. Circuit", x: 420, y: 537, isNew: true },
  { id: 2, name: "Crown City", x: 555, y: 607, isNew: true },
  { id: 3, name: "Whistlestop Summit", x: 410, y: 687, isNew: true },
  { id: 4, name: "DK Spaceport", x: 570, y: 717, isNew: true },
  { id: 5, name: "Starview Peak", x: 940, y: 231, isNew: true },
  { id: 6, name: "Faraway Oasis", x: 830, y: 587, isNew: true },
  { id: 7, name: "Peach Stadium", x: 700, y: 510, isNew: true },
  { id: 8, name: "Salty Salty Speedway", x: 930, y: 547, isNew: true },
  { id: 9, name: "Great ? Block Ruins", x: 980, y: 697, isNew: true },
  { id: 10, name: "Cheep Cheep Falls", x: 850, y: 472, isNew: true },
  { id: 11, name: "Dandelion Depths", x: 810, y: 352, isNew: true },
  { id: 12, name: "Boo Cinema", x: 850, y: 140, isNew: true },
  { id: 13, name: "Dry Bones Burnout", x: 545, y: 177, isNew: true },
  { id: 14, name: "Bowser's Castle", x: 480, y: 92, isNew: true },
  { id: 15, name: "Acorn Heights", x: 690, y: 17, isNew: true },
  { id: 16, name: "Rainbow Road", x: 700, y: 600, isNew: true },

  // Returning Tracks (14)
  { id: 17, name: "Desert Hills", x: 310, y: 623, isNew: false, origin: "Mario Kart DS" },
  { id: 18, name: "Shy Guy Bazaar", x: 310, y: 447, isNew: false, origin: "Mario Kart 7" },
  { id: 19, name: "Wario Stadium", x: 430, y: 387, isNew: false, origin: "Mario Kart 64" },
  { id: 20, name: "Airship Fortress", x: 350, y: 297, isNew: false, origin: "Mario Kart DS" },
  { id: 21, name: "DK Pass", x: 960, y: 392, isNew: false, origin: "Mario Kart DS" },
  { id: 22, name: "Sky-High Sundae", x: 1060, y: 322, isNew: false, origin: "MK8 Booster Pass" },
  { id: 23, name: "Wario's Galleon", x: 1080, y: 462, isNew: false, origin: "Mario Kart 7" },
  { id: 24, name: "Koopa Troopa Beach", x: 700, y: 695, isNew: false, origin: "Super Mario Kart" },
  { id: 25, name: "Peach Beach", x: 1060, y: 590, isNew: false, origin: "Double Dash!!" },
  { id: 26, name: "Dino Dino Jungle", x: 830, y: 745, isNew: false, origin: "Double Dash!!" },
  { id: 27, name: "Moo Moo Meadows", x: 680, y: 382, isNew: false, origin: "Mario Kart Wii" },
  { id: 28, name: "Choco Mountain", x: 570, y: 463, isNew: false, origin: "Mario Kart 64" },
  { id: 29, name: "Toad's Factory", x: 530, y: 322, isNew: false, origin: "Mario Kart Wii" },
  { id: 30, name: "Mario Circuit", x: 730, y: 282, isNew: false, origin: "Super Mario Kart" },
];

// Reference dimensions for coordinate scaling
export const MAP_REF_WIDTH = 1420;
export const MAP_REF_HEIGHT = 800;
