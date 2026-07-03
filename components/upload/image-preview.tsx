import { CheckCircle2, FileImage } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ImagePreviewProps {
  previewUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

/**
 * Visual preview for the locally selected image.
 * Uses a CSS background image instead of next/image because local blob URLs
 * can be browser/runtime dependent with image optimization components.
 */
export function ImagePreview({ previewUrl, fileName, fileSize, fileType }: ImagePreviewProps) {
  return (
    <Card className="overflow-hidden border-primary/25 bg-primary/[0.06]">
      <CardContent className="grid gap-5 p-4 sm:grid-cols-[180px_1fr] sm:p-5">
        <div
          role="img"
          aria-label={`Preview of ${fileName}`}
          className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/20 bg-cover bg-center"
          style={{ backgroundImage: `url(${previewUrl})` }}
        />

        <div className="flex flex-col justify-center">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <CheckCircle2 className="size-4" aria-hidden="true" /> Upload ready
          </p>
          <h3 className="break-all text-xl font-bold text-foreground">{fileName}</h3>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <FileImage className="size-4 text-primary" aria-hidden="true" /> {fileType || "Image file"}
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">{fileSize}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This image is selected locally in your browser and ready for the cricket studio workflow.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
