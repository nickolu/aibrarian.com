import { useEffect, useState, useCallback } from "react";
import { Book } from "@/app/types";
import {
  Grid2 as Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Define the detailed type for the Google Books API response
type GoogleBooksApiResponse = {
  items: Array<{
    volumeInfo: {
      title: string;
      authors?: string[];
      publishedDate?: string;
      description?: string;
    };
  }>;
};

export default function GoogleBooksApiData({ book }: { book: Book }) {
  const [response, setResponse] = useState<GoogleBooksApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBookData = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      setResponse(null);
      setLoading(true);

      try {
        const res = await fetch("/api/googleBooks/getBookByTitleAndAuthor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: book.title,
            author: book.author,
          }),
        });

        const data = await res.json();
        setResponse(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setResponse(null);
      }
    },
    [book]
  );

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        {loading ? null : response &&
          response.items &&
          response.items.length > 0 ? (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Google Books API Data for {response.items[0].volumeInfo.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <strong>Authors:</strong>{" "}
                {response.items[0].volumeInfo.authors?.join(", ") || "N/A"}
              </Typography>
              <Typography>
                <strong>Published Date:</strong>{" "}
                {response.items[0].volumeInfo.publishedDate || "N/A"}
              </Typography>
              <Typography>
                <strong>Description:</strong>{" "}
                {response.items[0].volumeInfo.description ||
                  "No description available"}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ) : null}
      </Grid>
    </Grid>
  );
}
