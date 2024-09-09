"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import BookRecommendationTabs from "./components/BookRecommendationTabs";
import { Book } from "./types";
import theme from "./theme";
import "./globals.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/generateBookRecommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (data.books) {
        setRecommendedBooks(data.books);
      } else {
        setError("Unable to generate recommendations");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Unable to generate recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            What problem can I help you solve?
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here"
              variant="outlined"
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? "Loading..." : "Send"}
            </Button>
          </form>
          <Box sx={{ mt: 4 }}>
            {recommendedBooks?.length > 0 && (
              <BookRecommendationTabs
                recommendedBooks={recommendedBooks}
                input={input}
              />
            )}
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
