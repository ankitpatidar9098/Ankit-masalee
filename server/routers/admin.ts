import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllPageContent,
  getPageContentById,
  createPageContent,
  updatePageContent,
  deletePageContent,
} from "../db";

// Admin-only procedure wrapper
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Admin access required");
  }
  return next({ ctx });
});

export const adminRouter = router({
  // ============= CATEGORIES =============
  categories: router({
    list: protectedProcedure.query(() => getAllCategories()),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getCategoryById(input.id)),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          icon: z.string().optional(),
          slug: z.string().min(1),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(({ input }) => createCategory(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
          slug: z.string().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateCategory(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteCategory(input.id)),
  }),

  // ============= PRODUCTS =============
  products: router({
    list: protectedProcedure.query(() => getAllProducts()),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getProductById(input.id)),

    create: adminProcedure
      .input(
        z.object({
          categoryId: z.number(),
          name: z.string().min(1),
          description: z.string().optional(),
          price: z.number().min(0),
          originalPrice: z.number().optional(),
          sku: z.string().optional(),
          image: z.string().optional(),
          sizes: z.string().optional(),
          stock: z.number().optional(),
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(({ input }) => createProduct(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          categoryId: z.number().optional(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          originalPrice: z.number().optional(),
          sku: z.string().optional(),
          image: z.string().optional(),
          sizes: z.string().optional(),
          stock: z.number().optional(),
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteProduct(input.id)),
  }),

  // ============= PAGE CONTENT =============
  pageContent: router({
    list: protectedProcedure.query(() => getAllPageContent()),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getPageContentById(input.id)),

    getByKey: protectedProcedure
      .input(z.object({ sectionKey: z.string() }))
      .query(({ input }) => {
        // This is a public query to get page content
        return getAllPageContent();
      }),

    create: adminProcedure
      .input(
        z.object({
          sectionKey: z.string().min(1),
          title: z.string().optional(),
          subtitle: z.string().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
          buttonText: z.string().optional(),
          buttonLink: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(({ input }) => createPageContent(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          sectionKey: z.string().optional(),
          title: z.string().optional(),
          subtitle: z.string().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
          buttonText: z.string().optional(),
          buttonLink: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updatePageContent(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePageContent(input.id)),
  }),
});
