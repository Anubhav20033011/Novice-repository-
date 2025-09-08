import { ScribbleSnapPage } from '@/components/scribble-snap-page';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ScribbleSnap | Handwritten Note to Text Converter',
  description: 'Convert your handwritten notes to digital text in a snap. Upload an image and get editable, downloadable text using AI.',
};

export default function Home() {
  return <ScribbleSnapPage />;
}
