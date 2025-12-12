# PRD: Mario Kart World Random Track Generator

## Overview

A React web application that randomly generates a 16-track race order for Mario Kart World VS mode, displaying the results on an interactive world map. The app should be deployable to GitHub Pages.

---

## Goals

1. Generate 16 unique random tracks from the pool of 30 available courses
2. Display all 30 tracks on a visual map matching the game's world layout
3. Highlight selected tracks with their race order number (1-16)
4. Provide a clean, responsive UI that works on desktop and mobile
5. Allow re-rolling the selection

---

## Technical Requirements

### Stack
- **Framework**: React (Vite preferred for fast builds)
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages compatible (static export)
- **No backend required** - all logic client-side

### Build Output
- Static HTML/CSS/JS bundle
- Configure for GitHub Pages deployment (base path handling)

---

## Track Data

### All 30 Tracks (with approximate map coordinates)

The map image dimensions should be treated as a 1420x800 coordinate system (based on the reference image aspect ratio). Positions are approximate center points for each track marker.

```javascript
const TRACKS = [
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
```

**Note**: Coordinates may need fine-tuning once the actual map image is placed. These are estimates based on the reference screenshot.

---

## Features

### 1. Random Track Generator

**Requirements:**
- Select exactly 16 unique tracks from the 30 available
- Use Fisher-Yates shuffle or equivalent for true randomness
- Assign order numbers 1-16 to selected tracks
- Store selection in component state

**UI:**
- "Generate" / "Roll" button to create new selection
- "Reset" button to clear selection
- Display list of selected tracks in order (sidebar or below map)

### 2. Interactive Map Display

**Requirements:**
- Display the Mario Kart World map as background image
- Overlay clickable/hoverable markers for all 30 tracks
- Map should be responsive (scale with viewport)

**Map Image:**
- Use the provided reference image: `/assets/mkw-map.png`
- Maintain aspect ratio on resize
- Consider lazy loading for performance

### 3. Track Markers

**Visual States:**

| State | Appearance |
|-------|------------|
| Unselected | Small dot or subtle marker, semi-transparent |
| Selected | Highlighted circle with order number (1-16) inside |
| Hover | Tooltip showing track name (and origin game if returning) |

**Marker Design:**
- Selected markers: Bright color (e.g., yellow/gold with black number)
- Unselected markers: Gray or muted color
- Size: ~30-40px diameter for selected, ~15-20px for unselected
- Numbers should be clearly readable (bold font)

### 4. Track List Panel

**Requirements:**
- Show ordered list of selected tracks (1-16)
- Each entry shows: Order number, Track name, (New/Returning badge)
- Clicking an entry in the list should highlight/pulse the marker on the map
- Optional: Show origin game for returning tracks

**Layout Options:**
- Sidebar on desktop (left or right)
- Collapsible drawer on mobile
- Or: Below the map on all viewports

### 5. Additional Features (Nice-to-Have)

- **Copy to Clipboard**: Copy track list as text for sharing
- **Share URL**: Encode selection in URL params for sharing specific rolls
- **Animation**: Animate markers appearing when generating
- **Sound**: Optional click/roll sound effects
- **Dark/Light Mode**: Theme toggle
- **Track Filters**: Option to exclude specific tracks from the pool before rolling

---

## UI/UX Design

### Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  🎮 Mario Kart World Track Generator          [Generate] 🎲 │
├─────────────────────────────────────────────────────────────┤
│                                              │              │
│                                              │  TRACK LIST  │
│                                              │              │
│              [    MAP IMAGE    ]             │  1. Track A  │
│              [ with markers    ]             │  2. Track B  │
│                                              │  3. Track C  │
│                                              │  ...         │
│                                              │  16. Track P │
│                                              │              │
│                                              │  [Copy List] │
└─────────────────────────────────────────────────────────────┘
```

### Layout (Mobile)

```
┌─────────────────────────┐
│ 🎮 MKW Track Generator  │
│      [Generate] 🎲      │
├─────────────────────────┤
│                         │
│    [   MAP IMAGE   ]    │
│    [ with markers  ]    │
│                         │
├─────────────────────────┤
│      TRACK LIST         │
│  1. Track A             │
│  2. Track B             │
│  ...                    │
│  [Copy List]            │
└─────────────────────────┘
```

### Color Palette (Suggested)

- **Primary**: Nintendo Red (#E60012) or Mario Kart Gold (#FFD700)
- **Background**: Dark blue (#1a1a2e) to match the game's ocean
- **Selected Marker**: Yellow (#FFD700) with black text
- **Unselected Marker**: Gray (#666666) at 50% opacity
- **New Track Badge**: Green (#4CAF50)
- **Returning Track Badge**: Blue (#2196F3)

---

## File Structure

```
mkw-track-generator/
├── public/
│   └── assets/
│       └── mkw-map.png          # World map background image
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main app component
│   │   ├── WorldMap.jsx         # Map with markers
│   │   ├── TrackMarker.jsx      # Individual track marker
│   │   ├── TrackList.jsx        # Sidebar list of selected tracks
│   │   ├── GenerateButton.jsx   # Roll button
│   │   └── TrackTooltip.jsx     # Hover tooltip
│   ├── data/
│   │   └── tracks.js            # Track data array
│   ├── utils/
│   │   └── randomizer.js        # Shuffle/selection logic
│   ├── styles/
│   │   └── index.css            # Tailwind imports + custom styles
│   ├── main.jsx                 # Entry point
│   └── index.html
├── package.json
├── vite.config.js               # Configure base path for GH Pages
├── tailwind.config.js
└── README.md
```

---

## Implementation Notes

### Randomization Logic

```javascript
// utils/randomizer.js
export function selectRandomTracks(allTracks, count = 16) {
  const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((track, index) => ({
    ...track,
    order: index + 1
  }));
}
```

### Map Coordinate Scaling

The track coordinates are based on a reference image size. When the map scales responsively, markers must scale proportionally:

```javascript
// Calculate marker position based on actual rendered map size
const getMarkerPosition = (track, mapWidth, mapHeight) => {
  const refWidth = 1420;  // Reference image width
  const refHeight = 800;  // Reference image height
  
  return {
    left: (track.x / refWidth) * mapWidth,
    top: (track.y / refHeight) * mapHeight
  };
};
```

### GitHub Pages Deployment

In `vite.config.js`:
```javascript
export default defineConfig({
  base: '/mkw-track-generator/', // Repository name
  plugins: [react()],
});
```

Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

---

## Acceptance Criteria

### Must Have
- [ ] Generates exactly 16 unique random tracks on button click
- [ ] Displays all 30 tracks on the world map
- [ ] Selected tracks show order number (1-16) on their marker
- [ ] Unselected tracks are visually distinct (dimmed)
- [ ] Hovering a marker shows track name
- [ ] Track list panel shows selected tracks in order
- [ ] Works on mobile (responsive)
- [ ] Deploys to GitHub Pages

### Should Have
- [ ] Copy track list to clipboard
- [ ] Visual feedback on generate (animation)
- [ ] Clicking list item highlights map marker

### Could Have
- [ ] Share URL with encoded selection
- [ ] Dark/light mode toggle
- [ ] Filter tracks before rolling
- [ ] Confetti or fun animation on roll

---

## Assets Required

1. **World Map Image** (`mkw-map.png`)
   - The uploaded reference image showing all track locations
   - Clean version without UI overlays preferred
   - High resolution (at least 1420x800)

2. **Favicon** (optional)
   - Mario Kart themed icon

---

## Testing Checklist

- [ ] Generate button produces 16 unique tracks
- [ ] Re-rolling produces different results (verify randomness)
- [ ] All 30 tracks have correct positions on map
- [ ] Markers scale correctly on window resize
- [ ] Mobile layout works on small screens
- [ ] Copy to clipboard works
- [ ] No console errors
- [ ] GitHub Pages deployment works with correct base path

---

## Future Enhancements (Out of Scope for V1)

- Track statistics (how often each track is selected over time)
- Multiple preset modes (e.g., "New Tracks Only", "Retro Only")
- Integration with tournaments/brackets
- PWA support for offline use
- Localization (track names in different languages)
