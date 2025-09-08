'use server';

import {
  handwritingToText,
  type HandwritingToTextInput,
} from '@/ai/flows/handwriting-to-text';

export async function getTextFromHandwriting(input: HandwritingToTextInput) {
  try {
    const result = await handwritingToText(input);
    if (!result || !result.digitalText) {
        return { success: false, error: 'The AI returned an empty response. The handwriting might not be clear enough.' };
    }
    return { success: true, text: result.digitalText };
  } catch (error) {
    console.error('Error in handwriting to text flow:', error);
    return {
      success: false,
      error: 'Failed to recognize text. Please try a clearer image.',
    };
  }
}
