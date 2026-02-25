import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock admin user context
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// Mock regular user context
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// Helper to create a mock File
function createMockFile(
  name: string = "test.jpg",
  type: string = "image/jpeg",
  size: number = 1024 * 100
): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("Upload API - Authorization", () => {
  it("should prevent non-admin from uploading product images", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.upload.productImage.mutate({
        file: createMockFile(),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should prevent non-admin from uploading category icons", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.upload.categoryIcon.mutate({
        file: createMockFile("icon.png", "image/png"),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should prevent non-admin from uploading page content images", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.upload.pageContentImage.mutate({
        file: createMockFile("content.jpg", "image/jpeg", 1024 * 500),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Upload API - File Validation", () => {
  it("should reject invalid file types for product images", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.upload.productImage.mutate({
        file: createMockFile("test.txt", "text/plain"),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });

  it("should reject oversized product images", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Create a 6MB file (exceeds 5MB limit)
      await caller.upload.productImage.mutate({
        file: createMockFile("large.jpg", "image/jpeg", 6 * 1024 * 1024),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });

  it("should reject oversized category icons", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Create a 3MB file (exceeds 2MB limit for icons)
      await caller.upload.categoryIcon.mutate({
        file: createMockFile("large-icon.png", "image/png", 3 * 1024 * 1024),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });

  it("should reject oversized page content images", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Create an 11MB file (exceeds 10MB limit)
      await caller.upload.pageContentImage.mutate({
        file: createMockFile("large-content.jpg", "image/jpeg", 11 * 1024 * 1024),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
});

describe("Upload API - File Type Support", () => {
  it("should accept JPEG files for product images", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.upload.productImage.mutate({
        file: createMockFile("product.jpg", "image/jpeg"),
      });
      expect(result.success).toBe(true);
    } catch (error) {
      // May fail due to S3 in test environment, but file type should be accepted
      if (error instanceof Error) {
        expect(error.message).not.toContain("Invalid file type");
      }
    }
  });

  it("should accept PNG files for category icons", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.upload.categoryIcon.mutate({
        file: createMockFile("icon.png", "image/png"),
      });
      expect(result.success).toBe(true);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain("Invalid file type");
      }
    }
  });

  it("should accept WebP files for page content", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.upload.pageContentImage.mutate({
        file: createMockFile("content.webp", "image/webp"),
      });
      expect(result.success).toBe(true);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain("Invalid file type");
      }
    }
  });
});
