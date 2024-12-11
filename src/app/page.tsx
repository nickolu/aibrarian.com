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
  Link,
} from "@mui/material";
import BookRecommendationTabs from "./components/BookRecommendationTabs";
import { Book } from "./types";
import theme from "./theme";
import "./globals.css";
import Image from "next/image";

function isBookValid(book: Book) {
  if (!book.title) {
    console.error("Invalid Book: No title", book);
    return false;
  }
  if (!book.author) {
    console.error("Invalid Book: No author", book);
    return false;
  }
  return true;
}

function isBookDataValid(books: Book[]) {
  console.log("books", books);
  return books && books.every(isBookValid);
}

export default function Home() {
  const [input, setInput] = useState("");
  const [problemText, setProblemText] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setRecommendedBooks([]);
    setError(null);
    try {
      setIsLoading(true);

      const res = await fetch("/api/generateBookRecommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: problemText }),
      });
      const data = await res.json();
      if (!data.books) {
        console.error("No book data in response:", data);
        setError("Unable to generate recommendations");
        return;
      }
      if (isBookDataValid(data.books)) {
        console.log('setting book data', data.books);
        setRecommendedBooks(data.books);
      } else {
        console.error("Invalid book data:", data.books);
        setError("Unable to generate recommendations");
        setRecommendedBooks([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Unable to generate recommendations");
    } finally {
      setIsLoading(false);
    }
  }, [problemText]);

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
              placeholder="Describe your problem here"
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
          {/* New Footer */}
          <Box component="footer" sx={{ mt: 8, py: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} AIbrarian. Powered by{" "}
              <Link
                href="https://openai.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI
              </Link>
              . Created by{" "}
              <Link
                href="https://cunningjams.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                CunningJams
              </Link>
              .
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
