import { useEffect, useState, useCallback } from "react";
import { Book } from "@/app/types";
import { Box, CircularProgress, Grid2 as Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiMarkdown from "mui-markdown";

function bookSolutionPrompt(book: Book, input: string) {
  return `based on the principles of the book ${book.title} by ${book.author}, how would you solve this problem: 
  PROBLEM TEXT:  
  ${input}

  FORMATTING RULES:
  1. please format your response as markdown (md)
  2. please do not prefix the response with any commentary, just start with the solution
  3. don't wrap anything other than code blocks in triple backticks
  4. please do not include any markdown that is not part of the solution, such as \`\`\`md\`\`\` or \`\`\`json\`\`\`
  `;
}

const MarkdownContainer = styled(Box)`
  font-size: 1.5rem;
  max-width: 100%;
  word-wrap: break-word;

  ul,
  ol {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    margin-left: ${({ theme }) => theme.spacing(3)};
  }
  li ul,
  li ol {
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
  h1,
  h2 {
    margin-top: ${({ theme }) => theme.spacing(4)};
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }

  h3,
  h4,
  h5,
  h6 {
    margin-top: ${({ theme }) => theme.spacing(2)};
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
`;

export default function BookRecommendationText({
  book,
  problemText,
}: {
  book: Book;
  problemText: string;
}) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const getCacheKey = useCallback(() => {
    const bookKey = `${book.title}_${book.author}`
      .replace(/\s+/g, "_")
      .toLowerCase();

    const problemTextKey = problemText
      .substring(0, 12)
      .replace(/\s+/g, "_")
      .toLowerCase();
    return `book_recommendation_${bookKey}_${problemTextKey}`;
  }, [book.title, book.author, problemText]);

  const fetchRecommendationText = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      const cacheKey = getCacheKey();
      const cachedResponse = sessionStorage.getItem(cacheKey);

      if (cachedResponse) {
        setResponse(cachedResponse);
        return;
      }

      setResponse("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "user", content: bookSolutionPrompt(book, problemText) },
            ],
          }),
        });

        const data = await res.json();
        setResponse(data.response.choices[0].message.content);

        // Strip backticks from the start and end of the response
        const strippedResponse =
          data.response.choices[0].message.content.replace(/^```|```$/g, "");
        // Strip "markdown" from the start of the response if present
        const cleanedResponse = strippedResponse.replace(
          /^(markdown|md)\s*/i,
          ""
        );
        sessionStorage.setItem(cacheKey, cleanedResponse);
        setResponse(cleanedResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setResponse("An error occurred while fetching the response.");
      }
    },
    [book, problemText, getCacheKey]
  );

  useEffect(() => {
    fetchRecommendationText();
  }, [fetchRecommendationText]);

  return (
    <Grid container sx={{ marginBottom: 2 }}>
      <Grid size={{ xs: 12 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <MarkdownContainer>
            <MuiMarkdown>{response}</MuiMarkdown>
          </MarkdownContainer>
        )}
      </Grid>
    </Grid>
  );
}
