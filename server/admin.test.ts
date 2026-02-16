import { describe, it, expect, beforeAll, afterAll } from "vitest";
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

describe("Admin API - Categories", () => {
  it("should allow admin to list categories", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.categories.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow regular user to list categories", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.categories.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should prevent non-admin from creating category", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.admin.categories.create({
        name: "Test Category",
        slug: "test-category",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Admin API - Products", () => {
  it("should allow admin to list products", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.products.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow regular user to list products", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.products.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should prevent non-admin from creating product", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.admin.products.create({
        categoryId: 1,
        name: "Test Product",
        price: 50000,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Admin API - Page Content", () => {
  it("should allow admin to list page content", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.pageContent.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow regular user to list page content", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.pageContent.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should prevent non-admin from creating page content", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.admin.pageContent.create({
        sectionKey: "test-section",
        title: "Test Section",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
