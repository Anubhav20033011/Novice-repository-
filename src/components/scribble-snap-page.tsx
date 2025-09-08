"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, Copy, Download, XCircle, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getTextFromHandwriting } from "@/app/actions";

export function ScribbleSnapPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { toast } = useToast();

  const handleClear = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setRecognizedText("");
    setIsProcessing(false);
  }, [imagePreview]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      handleClear();

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsProcessing(true);
      setRecognizedText("");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        const response = await getTextFromHandwriting({ photoDataUri: dataUri });

        if (response.success && response.text) {
          setRecognizedText(response.text);
        } else {
          toast({
            title: "Recognition Failed",
            description: response.error || "Could not extract text from the image.",
            variant: "destructive",
          });
          handleClear();
        }
        setIsProcessing(false);
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the file.",
          variant: "destructive",
        });
        setIsProcessing(false);
        handleClear();
      };
    },
    [toast, handleClear]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
     // Reset input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(recognizedText);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([recognizedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scribble-snap-note.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body animate-in fade-in duration-500">
      <header className="py-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary tracking-tight">
          ScribbleSnap
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Instantly convert your handwritten notes into editable digital text with AI.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                Your Handwriting
              </CardTitle>
              <CardDescription>Upload an image of your notes to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative aspect-video w-full rounded-md overflow-hidden border shadow-inner">
                  <Image
                    src={imagePreview}
                    alt="Handwritten note preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  className={`relative flex justify-center items-center w-full aspect-video rounded-lg border-2 border-dashed transition-colors duration-300 ${
                    isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-center p-4 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                  >
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="font-semibold text-primary">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PNG, JPG, or other image formats
                    </p>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={onFileChange}
                    accept="image/*"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" /> Digital Text
              </CardTitle>
              <CardDescription>
                {isProcessing
                  ? "Analyzing your scribble..."
                  : "Here you can edit, copy, or download the recognized text."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isProcessing ? (
                <div className="space-y-3 h-full min-h-[250px] p-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <Textarea
                  value={recognizedText}
                  onChange={(e) => setRecognizedText(e.target.value)}
                  placeholder="Your recognized text will appear here..."
                  className="h-full min-h-[250px] resize-none font-code text-base"
                  disabled={!imagePreview && !recognizedText}
                  aria-label="Recognized text editor"
                />
              )}
            </CardContent>
            <CardFooter className="flex-wrap justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={!recognizedText || isProcessing}
              >
                <Copy /> Copy
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!recognizedText || isProcessing}
              >
                <Download /> Download
              </Button>
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={!imagePreview || isProcessing}
              >
                <XCircle /> Clear
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
