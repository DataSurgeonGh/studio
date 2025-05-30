import { NextResponse } from 'next/server';

const API_BIBLE_BASE_URL = 'https://api.scripture.api.bible';
const API_KEY = process.env.API_BIBLE_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: 'Missing "reference" query parameter' }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: 'API_BIBLE_KEY environment variable not set' }, { status: 500 });
  }

  try {
    // Step 1: Find a suitable Bible version (e.g., KJV)
    const versionsResponse = await fetch(`${API_BIBLE_BASE_URL}/v1/bibles`, {
      headers: {
        'api-key': API_KEY,
      },
    });

    if (!versionsResponse.ok) {
      const errorData = await versionsResponse.json();
      console.error('Error fetching Bible versions:', errorData);
      return NextResponse.json({ error: 'Failed to fetch Bible versions from API.Bible' }, { status: versionsResponse.status });
    }

    const versionsData = await versionsResponse.json();
    const kjvBible = versionsData.data.find((bible: any) => bible.abbr === 'KJV'); // Assuming KJV abbreviation

    if (!kjvBible) {
      return NextResponse.json({ error: 'KJV Bible version not found' }, { status: 404 });
    }

    const bibleId = kjvBible.id;

    // Step 2: Fetch the verse text using the reference
    // Note: The API.Bible verse fetching requires a specific verse ID format
    // This implementation assumes the 'reference' parameter is in a format compatible with API.Bible's verse ID (e.g., 'JHN.3.16')
    // A more robust implementation would parse the reference (e.g., "John 3:16") into the correct ID format
    // For simplicity in this example, we'll use the provided reference directly as the verseId
    const verseId = reference; // **Needs robust parsing for real-world use**

    const verseResponse = await fetch(`${API_BIBLE_BASE_URL}/v1/bibles/${bibleId}/verses/${verseId}`, {
      headers: {
        'api-key': API_KEY,
      },
    });

    if (!verseResponse.ok) {
      const errorData = await verseResponse.json();
      console.error(`Error fetching verse ${reference}:`, errorData);
      return NextResponse.json({ error: `Failed to fetch verse ${reference} from API.Bible` }, { status: verseResponse.status });
    }

    const verseData = await verseResponse.json();
    const verseText = verseData.data.content; // Adjust based on API response structure

    return NextResponse.json({ text: verseText });

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}