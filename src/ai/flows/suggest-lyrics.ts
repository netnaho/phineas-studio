'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting lyrics based on existing text or audio recordings.
 *
 * The flow uses a prompt to generate lyric suggestions based on the input provided.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLyricsInputSchema = z.object({
  existingLyrics: z.string().optional().describe('Existing lyrics to build upon.'),
  audioRecording: z
    .string()
    .optional()
    .describe(
      "An audio recording of the song as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestLyricsInput = z.infer<typeof SuggestLyricsInputSchema>;

const SuggestLyricsOutputSchema = z.object({
  suggestedLyrics: z.string().describe('AI-generated lyric suggestions.'),
});
export type SuggestLyricsOutput = z.infer<typeof SuggestLyricsOutputSchema>;

export async function suggestLyrics(input: SuggestLyricsInput): Promise<SuggestLyricsOutput> {
  return suggestLyricsFlow(input);
}

const suggestLyricsPrompt = ai.definePrompt({
  name: 'suggestLyricsPrompt',
  input: {schema: SuggestLyricsInputSchema},
  output: {schema: SuggestLyricsOutputSchema},
  prompt: `You are a professional songwriter, skilled at creating song lyrics.

  {{#if audioRecording}}Here is an audio recording to help you write lyrics: {{media url=audioRecording}}{{/if}}

  {{#if existingLyrics}}Continue these existing lyrics: {{{existingLyrics}}}{{/if}}

  Write new lyrics which follow the theme.
  Output the lyrics in a format that can be easily integrated.
  Do not include any other explanation.
  Do not repeat the existing lyrics.
  `,
});

const suggestLyricsFlow = ai.defineFlow(
  {
    name: 'suggestLyricsFlow',
    inputSchema: SuggestLyricsInputSchema,
    outputSchema: SuggestLyricsOutputSchema,
  },
  async input => {
    const {output} = await suggestLyricsPrompt(input);
    return output!;
  }
);
