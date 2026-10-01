const palettes = {
  midnight: {
    bg: "#05060D",
    surface: "#0E1118",
    surface2: "#151926",
    surface3: "#1D2233",
    line: "#262C3D",
    text: "#EEF0F7",
    muted: "#868DA3",
    purple: "#8C3DFF",
    violet: "#B14EFF",
    blue: "#3D7FFF",
    cyan: "#22E0FF",
    green: "#33D189",
    yellow: "#F7C948",
    orange: "#FF8A3D",
    red: "#FF5577",
    pink: "#F74FC4",
  },
  daybreak: {
    bg: "#EEF1F9",
    surface: "#FFFFFF",
    surface2: "#F4F6FC",
    surface3: "#E8EBF5",
    line: "#D7DBEA",
    text: "#11131F",
    muted: "#5B6178",
    purple: "#7C3AED",
    violet: "#9D3FE0",
    blue: "#2563EB",
    cyan: "#0891B2",
    green: "#0F9D63",
    yellow: "#B9830A",
    orange: "#D9641A",
    red: "#DC2B4E",
    pink: "#C62B9E",
  },
};

export function getTokens(theme) {
  return palettes[theme] || palettes.midnight;
}

export default palettes.midnight;
