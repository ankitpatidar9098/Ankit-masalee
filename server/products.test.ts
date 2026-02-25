import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for public procedures
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("products router", () => {
  const ctx = createPublicContext();
  const caller = appRouter.createCaller(ctx);

  describe("listCategories", () => {
    it("should return categories", async () => {
      const result = await caller.products.listCategories();
      
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name");
        expect(result[0]).toHaveProperty("slug");
      }
    });
  });

  describe("listAll", () => {
    it("should return all products", async () => {
      const result = await caller.products.listAll();
      
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name");
        expect(result[0]).toHaveProperty("price");
        expect(result[0]).toHaveProperty("categoryId");
      }
    });
  });

  describe("listFeatured", () => {
    it("should return featured products", async () => {
      const result = await caller.products.listFeatured();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(6);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name");
      }
    });
  });

  describe("listPopular", () => {
    it("should return popular products", async () => {
      const result = await caller.products.listPopular();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(6);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name");
      }
    });
  });

  describe("listByCategory", () => {
    it("should return products for a category", async () => {
      const result = await caller.products.listByCategory({ categoryId: 1 });
      
      expect(Array.isArray(result)).toBe(true);
      result.forEach((product) => {
        expect(product.categoryId).toBe(1);
      });
    });

    it("should return empty array for non-existent category", async () => {
      const result = await caller.products.listByCategory({ categoryId: 9999 });
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe("search", () => {
    it("should search products by name", async () => {
      const result = await caller.products.search({ query: "turmeric" });
      
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        const hasMatch = result.some(
          (p) =>
            p.name.toLowerCase().includes("turmeric") ||
            p.description?.toLowerCase().includes("turmeric")
        );
        expect(hasMatch).toBe(true);
      }
    });

    it("should return all products for empty query", async () => {
      const result = await caller.products.search({ query: "" });
      
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getById", () => {
    it("should return a product by id", async () => {
      const allProducts = await caller.products.listAll();
      
      if (allProducts.length > 0) {
        const productId = allProducts[0].id;
        const result = await caller.products.getById({ id: productId });
        
        expect(result).not.toBeNull();
        expect(result?.id).toBe(productId);
        expect(result?.name).toBe(allProducts[0].name);
      }
    });

    it("should return null for non-existent product", async () => {
      const result = await caller.products.getById({ id: 9999 });
      
      expect(result).toBeNull();
    });
  });
});
