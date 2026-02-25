import { useState, useRef } from "react";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  uploadType?: "product" | "category" | "content";
  maxSize?: number; // in MB
  preview?: boolean;
}

export function ImageUpload({
  onImageUpload,
  uploadType = "product",
  maxSize = 5,
  preview = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload mutations
  const productImageMutation = trpc.upload.productImage.useMutation();
  const categoryIconMutation = trpc.upload.categoryIcon.useMutation();
  const pageContentImageMutation = trpc.upload.pageContentImage.useMutation();

  const getMutation = () => {
    switch (uploadType) {
      case "category":
        return categoryIconMutation;
      case "content":
        return pageContentImageMutation;
      default:
        return productImageMutation;
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, WebP, or GIF.");
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size exceeds ${maxSize}MB limit.`);
      return;
    }

    // Show preview
    if (preview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    setIsLoading(true);
    setUploadProgress(0);

    try {
      const mutation = getMutation();
      const result = await mutation.mutateAsync({ file });

      setUploadProgress(100);
      onImageUpload(result.url);
      toast.success("Image uploaded successfully!");

      // Reset after 2 seconds
      setTimeout(() => {
        setPreviewUrl(null);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setPreviewUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-amber-500 bg-amber-50"
            : "border-gray-300 bg-gray-50 hover:border-amber-400"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        {previewUrl && uploadProgress > 0 ? (
          <div className="space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              {uploadProgress === 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              )}
            </div>

            {uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {uploadProgress === 100 && (
              <p className="text-sm text-green-600 font-medium">Upload complete!</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {isLoading ? (
              <Loader2 className="w-12 h-12 mx-auto text-amber-500 animate-spin" />
            ) : (
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">
                {isLoading ? "Uploading..." : "Drag and drop your image here"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to select from your computer
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Supported formats: JPEG, PNG, WebP, GIF • Max size: {maxSize}MB
            </p>

            {!isLoading && (
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mt-4"
              >
                Select Image
              </Button>
            )}
          </div>
        )}
      </div>

      {previewUrl && uploadProgress === 100 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setPreviewUrl(null)}
          className="mt-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}

export default ImageUpload;
