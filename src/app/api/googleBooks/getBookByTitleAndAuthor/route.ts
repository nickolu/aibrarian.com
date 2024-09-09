import axios from "axios";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { title, author } = await request.json();
    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    const query = `intitle:${title}+inauthor:${author}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`;
    const response = await axios.get(url);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching book data:", error);
    return NextResponse.json(
      { error: "Failed to fetch book data" },
      { status: 500 }
    );
  }
}
