import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verseReference = searchParams.get('verseReference');

  if (!verseReference) {
    return NextResponse.json({ error: 'Missing verseReference parameter' }, { status: 400 });
  }

  const apiKey = process.env.BIBLE_API_KEY;
  const bibleId = 'de4e12af17f028e5-01'; // Example Bible ID (KJV). You might want to make this configurable.

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(verseReference)}`, {
      headers: {
        'api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API.Bible error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch verse from API.Bible', details: errorData }, { status: response.status });
    }

    const data = await response.json();

    // The API.Bible search endpoint returns search results.
    // We need to extract the relevant verse text from the results.
    // This part might need adjustment based on the exact structure of the API response
    // and how you want to handle multiple results or different result types.
    // For simplicity, let's assume we take the first result's excerpt or text.
    const verses = data?.data?.verses;

    if (verses && verses.length > 0) {
      // Concatenate text from all matched verses
      const fullVerseText = verses.map((verse: any) => verse.text).join(' ');
      return NextResponse.json({ verseText: fullVerseText });
    } else {
      // If no verses are found by the search endpoint, try getting a specific passage
      // This requires a different endpoint structure and reference format (e.g., JHN.3.16)
      // This is a simplified fallback and might need more robust reference parsing.
       try {
         // Attempt to parse a standard reference format for the passage endpoint
         const passageReference = verseReference.replace(/ /g, '.').toUpperCase(); // Simple conversion
         const passageResponse = await fetch(`https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageReference}`, {
           headers: {
             'api-key': apiKey,
           },
         });

         if (!passageResponse.ok) {
            const errorData = await passageResponse.json();
            console.error('API.Bible passage error:', errorData);
            return NextResponse.json({ error: 'Verse not found using passage endpoint', details: errorData }, { status: passageResponse.status });
         }
         const passageData = await passageResponse.json();
         const passageText = passageData?.data?.content.replace(/<[^>]*>/g, '').trim(); // Basic HTML stripping

         if (passageText) {
             return NextResponse.json({ verseText: passageText });
         } else {
             return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
         }

       } catch (passageError) {
          console.error('API.Bible passage fetch error:', passageError);
          return NextResponse.json({ error: 'Failed to fetch verse using passage endpoint', details: (passageError as Error).message }, { status: 500 });
       }
    }

  } catch (error) {
    console.error('Failed to fetch verse:', error);
    return NextResponse.json({ error: 'Failed to fetch verse', details: (error as Error).message }, { status: 500 });
  }
}