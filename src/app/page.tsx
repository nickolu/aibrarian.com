"use client";

import { useEffect, useState, useCallback } from "react";
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
import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState("");
  const [problemText, setProblemText] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setRecommendedBooks([]);
    try {
      setIsLoading(true);

      const res = await fetch("/api/generateBookRecommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: problemText }),
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
  }, [problemText]); // Add problemText to the dependency array

  useEffect(() => {
    if (problemText) {
      fetchRecommendations();
    }
  }, [problemText, fetchRecommendations]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box mb={2}>
              <Image
                src="/images/aibrarian-logo.png"
                alt="aibrarian-logo"
                width={87}
                height={123}
              />
            </Box>
            <Typography variant="h1" component="h1" gutterBottom>
              What problem can I help you solve?
            </Typography>
          </Box>{" "}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setProblemText(input);
            }}
          >
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
                problemText={problemText}
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
