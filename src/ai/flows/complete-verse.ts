'use server';
/**
 * @fileOverview AI agent that completes Bible verses as the user types.
 *
 * - completeVerse - A function that handles the verse completion process.
 * - CompleteVerseInput - The input type for the completeVerse function.
 * - CompleteVerseOutput - The return type for the completeVerse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompleteVerseInputSchema = z.object({
  verseFragment: z
    .string()
    .describe('The fragment of the Bible verse to complete.'),
});
export type CompleteVerseInput = z.infer<typeof CompleteVerseInputSchema>;

const CompleteVerseOutputSchema = z.object({
  completedVerse: z.string().describe('The completed Bible verse.'),
});
export type CompleteVerseOutput = z.infer<typeof CompleteVerseOutputSchema>;

export async function completeVerse(input: CompleteVerseInput): Promise<CompleteVerseOutput> {
  return completeVerseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'completeVersePrompt',
  input: {schema: CompleteVerseInputSchema},
  output: {schema: CompleteVerseOutputSchema},
  prompt: `You are a helpful assistant that completes Bible verses accurately.

  Complete the following verse fragment:
  {{verseFragment}}`,
});

const completeVerseFlow = ai.defineFlow(
  {
    name: 'completeVerseFlow',
    inputSchema: CompleteVerseInputSchema,
    outputSchema: CompleteVerseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
