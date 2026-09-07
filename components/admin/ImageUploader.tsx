"use client";

import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Upload, X, Loader2, Camera, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  type?: "driver" | "car";
  aspectRatio?: "square" | "wide";
}

export function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = "wide",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const generateUploadUrl = useMutation(api.results.generateUploadUrl);
  const getStorageUrl = useMutation(api.results.getStorageUrl);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be smaller than 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Get direct upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // 2. Post file directly from browser to Convex storage
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!res.ok) {
        throw new Error("Failed to send image data to storage");
      }

      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };

      // 3. Resolve permanent public HTTPS URL
      const publicUrl = await getStorageUrl({ storageId });
      if (!publicUrl) {
        throw new Error("Could not resolve permanent image URL");
      }

      onChange(publicUrl);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0]);
    }
    // Crucial: reset input value so re-selecting the same file fires onChange
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box with Remove Action */
        <div
          className={`group relative overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 ${
            aspectRatio === "square" ? "h-28 w-28" : "h-28 w-full"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleOpenPicker}
              className="rounded bg-neutral-900/90 px-2 py-1 font-mono text-[10px] font-bold text-white hover:bg-neutral-800"
            >
              REPLACE
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded bg-red-600/90 p-1 text-white hover:bg-red-500"
              title="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
            <CheckCircle2 className="h-2.5 w-2.5" />
            STORED
          </div>
        </div>
      ) : (
        /* Drag-and-Drop / Browse Dropzone */
        <div
          onClick={handleOpenPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-red-500 bg-red-950/20"
              : "border-neutral-700/80 bg-neutral-900/60 hover:border-neutral-500 hover:bg-neutral-900"
          } ${aspectRatio === "square" ? "h-28 w-28" : "h-28 w-full"}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5 text-neutral-400">
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                UPLOADING...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-neutral-400 group-hover:text-neutral-200">
              <div className="flex items-center gap-1 text-neutral-500">
                <Upload className="h-4 w-4 text-red-500" />
                <Camera className="h-3.5 w-3.5" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                CHOOSE FROM DEVICE
              </span>
              <span className="font-mono text-[9px] text-neutral-500">
                Click to browse or drop file
              </span>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="mt-1 font-mono text-[10px] text-red-400">{uploadError}</p>
      )}
    </div>
  );
}
