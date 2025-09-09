import { ScribbleSnapPage } from '@/components/scribble-snap-page';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ScriptNest Snap | Handwriting to Text with Summary & PDF',
  description: 'Convert handwritten notes to text, summarize long content, and export as PDF.',
};

export default function Home() {
  return <ScribbleSnapPage />;
}
