import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchBibleVerse(verseReference: string): Promise<string> {
  try {
    const response = await fetch(`/api/bible?verseReference=${encodeURIComponent(verseReference)}`);

    if (!response.ok) {
      throw new Error(`Error fetching verse: ${response.statusText}`);
    }

    const data = await response.json();
    // Assuming the API returns the verse text in a field like 'text'
    return data.text || "Verse text not found.";
  } catch (error) {
    console.error("Failed to fetch Bible verse:", error);
    return "Error fetching verse.";
  }
}

export function findAndExtractVerseReferences(text: string): string[] {
  // This regex is a starting point and might need refinement
  // It looks for patterns like Book Chapter:Verse(s)
  // It's a basic regex and might not catch all variations or handle complex cases perfectly
  const verseRegex = /(\b(?:[123]\s?[a-zA-Z]+|[a-zA-Z]+)\s+\d+:\d+(?:-\d+)?\b)/g;
  const references: string[] = [];
  let match;

  while ((match = verseRegex.exec(text)) !== null) {
    references.push(match[1]);
  }
  return references;
}
