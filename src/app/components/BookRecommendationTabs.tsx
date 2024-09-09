import { Box, Tab, Tabs, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { Book } from "@/app/types";
import BookRecommendationText from "./BookRecommendationText";
import GoogleBooksApiData from "./GoogleBooksApiData";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BookRecommendationTabs({
  recommendedBooks,
  problemText,
}: {
  recommendedBooks: Book[];
  problemText: string;
}) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        The ai-brarian has found the following books to solve your problem:
      </Typography>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="book recommendation tabs"
          variant="fullWidth"
          scrollButtons={false}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
        >
          {recommendedBooks.map((book, index) => (
            <Tab
              key={book.title}
              label={`${book.title} by ${book.author}`}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
        {recommendedBooks.map((book, index) => (
          <CustomTabPanel key={book.title} value={tabValue} index={index}>
            <BookRecommendationText book={book} problemText={problemText} />
            <GoogleBooksApiData book={book} />
          </CustomTabPanel>
        ))}
      </Box>
    </Paper>
  );
}
