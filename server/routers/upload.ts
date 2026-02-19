import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

// Admin-only procedure wrapper
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Admin access required");
  }
  return next({ ctx });
});

export const uploadRouter = router({
  // Upload product image
  productImage: adminProcedure
    .input(
      z.object({
        file: z.instanceof(File),
        productId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(input.file.type)) {
          throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (input.file.size > maxSize) {
          throw new Error("File size exceeds 5MB limit.");
        }

        // Read file as buffer
        const buffer = await input.file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        // Generate unique filename
        const ext = input.file.name.split(".").pop() || "jpg";
        const filename = `products/${nanoid()}-${Date.now()}.${ext}`;

        // Upload to S3
        const { url, key } = await storagePut(filename, uint8Array, input.file.type);

        return {
          success: true,
          url,
          key,
          filename: input.file.name,
          size: input.file.size,
          type: input.file.type,
        };
      } catch (error) {
        console.error("[Upload Error]", error);
        throw new Error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  // Upload category icon (smaller file)
  categoryIcon: adminProcedure
    .input(
      z.object({
        file: z.instanceof(File),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        if (!allowedTypes.includes(input.file.type)) {
          throw new Error("Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.");
        }

        const maxSize = 2 * 1024 * 1024; // 2MB for icons
        if (input.file.size > maxSize) {
          throw new Error("File size exceeds 2MB limit.");
        }

        const buffer = await input.file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        const ext = input.file.name.split(".").pop() || "png";
        const filename = `categories/${nanoid()}-${Date.now()}.${ext}`;

        const { url, key } = await storagePut(filename, uint8Array, input.file.type);

        return {
          success: true,
          url,
          key,
          filename: input.file.name,
        };
      } catch (error) {
        console.error("[Upload Error]", error);
        throw new Error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  // Upload page content image
  pageContentImage: adminProcedure
    .input(
      z.object({
        file: z.instanceof(File),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(input.file.type)) {
          throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        }

        const maxSize = 10 * 1024 * 1024; // 10MB for hero images
        if (input.file.size > maxSize) {
          throw new Error("File size exceeds 10MB limit.");
        }

        const buffer = await input.file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        const ext = input.file.name.split(".").pop() || "jpg";
        const filename = `content/${nanoid()}-${Date.now()}.${ext}`;

        const { url, key } = await storagePut(filename, uint8Array, input.file.type);

        return {
          success: true,
          url,
          key,
          filename: input.file.name,
        };
      } catch (error) {
        console.error("[Upload Error]", error);
        throw new Error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});
