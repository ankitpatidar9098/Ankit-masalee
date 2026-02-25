import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { categories, products } from "../../drizzle/schema";

export const productsRouter = router({
  // Get all categories
  listCategories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const result = await db
      .select()
      .from(categories)
      .orderBy(categories.displayOrder);
    
    return result;
  }),

  // Get products by category
  listByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, input.categoryId))
        .orderBy(products.displayOrder);
      
      return result;
    }),

  // Get all products
  listAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const result = await db
      .select()
      .from(products)
      .orderBy(products.displayOrder);
    
    return result;
  }),

  // Get featured products (first 6)
  listFeatured: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const result = await db
      .select()
      .from(products)
      .orderBy(products.displayOrder)
      .limit(6);
    
    return result;
  }),

  // Get popular products
  listPopular: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    // In a real app, this would be based on sales/views
    // For now, we'll just return products with higher prices (premium items)
    const result = await db
      .select()
      .from(products)
      .orderBy(products.price)
      .limit(6);
    
    return result;
  }),

  // Search products
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      // Simple search - in production use full-text search
      const searchTerm = `%${input.query}%`;
      const result = await db
        .select()
        .from(products)
        .where(
          // This is a simplified search - in production use proper full-text search
          // For now, just return all products if query is provided
          input.query.length > 0 ? undefined : undefined
        );
      
      return result.filter(p => 
        p.name.toLowerCase().includes(input.query.toLowerCase()) ||
        p.description?.toLowerCase().includes(input.query.toLowerCase())
      );
    }),

  // Get single product
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);
      
      return result[0] || null;
    }),
});
