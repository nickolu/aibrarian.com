import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3a506b", // Deep blue-gray
      light: "#5c7a99",
      dark: "#1c2b3a",
    },
    secondary: {
      main: "#c17767", // Muted coral
      light: "#d49c8f",
      dark: "#9e5142",
    },
    background: {
      default: "#f8f9fa", // Light gray
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50", // Dark blue-gray
      secondary: "#7f8c8d", // Medium gray
    },
  },
  typography: {
    fontFamily: '"Courier New", "Courier", "monospace"',
    fontSize: 10,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
    },

    body1: {
      fontSize: "1.2rem",
    },
    body2: {
      fontSize: "1rem",
    },
    subtitle1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "0.8rem",
        },
      },
    },
  },
});

export default theme;
