"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "./Button";

interface UploadAreaProps {
  onFile: (file: File) => void;
  error?: string | null;
}

export function UploadArea({ onFile, error }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        onFile(file); // let parent decide how to show the "unsupported" error
        return;
      }
      onFile(file);
    },
    [onFile]
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a photo of the item, or drag and drop it here"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`organic-card flex cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed px-6 py-16 text-center transition-colors ${
          isDragging
            ? "border-moss-600 bg-moss-50"
            : "border-moss-200 bg-white hover:border-moss-400 hover:bg-moss-50/60"
        } ${error ? "border-soil-500" : ""}`}
      >
        <span aria-hidden className="text-5xl">
          📷
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-moss-900">
            Drag a photo here, or tap to upload
          </p>
          <p className="mt-1 text-sm text-ink/60">JPG or PNG, up to 10MB</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-soil-700">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Photo
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => cameraInputRef.current?.click()}
        >
          Take Photo
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
