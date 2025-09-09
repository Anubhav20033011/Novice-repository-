// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Converts an image of handwritten text to digital text.
 *
 * - handwritingToText - A function that handles the conversion process.
 * - HandwritingToTextInput - The input type for the handwritingToText function.
 * - HandwritingToTextOutput - The return type for the handwritingToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandwritingToTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of handwritten notes, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HandwritingToTextInput = z.infer<typeof HandwritingToTextInputSchema>;

const HandwritingToTextOutputSchema = z.object({
  digitalText: z.string().describe('The digital text converted from the handwritten notes.'),
});
export type HandwritingToTextOutput = z.infer<typeof HandwritingToTextOutputSchema>;

export async function handwritingToText(input: HandwritingToTextInput): Promise<HandwritingToTextOutput> {
  return handwritingToTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handwritingToTextPrompt',
  input: {schema: HandwritingToTextInputSchema},
  output: {schema: HandwritingToTextOutputSchema},
  prompt: `You are an OCR tool. Convert the handwritten text in the image to digital text. Pay close attention to paragraph and line breaks in the original image and preserve them in the output.

Image: {{media url=photoDataUri}}`,
});

const handwritingToTextFlow = ai.defineFlow(
  {
    name: 'handwritingToTextFlow',
    inputSchema: HandwritingToTextInputSchema,
    outputSchema: HandwritingToTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
