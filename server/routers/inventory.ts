import { z } from "zod";
import { protectedProcedure, adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  deductProductStock,
  restockProduct,
  getInventoryHistory,
  setLowStockThreshold,
  getLowStockProducts,
  createStockAlert,
  getPendingStockAlerts,
  markAlertAsSent,
  acknowledgeStockAlert,
} from "../db";

export const inventoryRouter = router({
  /**
   * Get current stock level for a product
   */
  getStock: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await (await import("../db")).getDb();
      if (!db) throw new Error("Database not available");

      const { eq } = await import("drizzle-orm");
      const { products } = await import("../../drizzle/schema");

      const result = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
      return result[0]?.stock ?? 0;
    }),

  /**
   * Get inventory history for a product (admin only)
   */
  getHistory: adminProcedure
    .input(z.object({ productId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return await getInventoryHistory(input.productId, input.limit);
    }),

  /**
   * Set low-stock threshold for a product (admin only)
   */
  setThreshold: adminProcedure
    .input(z.object({ productId: z.number(), thresholdQuantity: z.number().min(1) }))
    .mutation(async ({ input }) => {
      await setLowStockThreshold(input.productId, input.thresholdQuantity);
      return { success: true };
    }),

  /**
   * Get all products below their low-stock threshold
   */
  getLowStockProducts: adminProcedure.query(async () => {
    return await getLowStockProducts();
  }),

  /**
   * Manually restock a product (admin only)
   */
  restock: adminProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");

      await restockProduct(input.productId, input.quantity, input.notes, ctx.user.id);
      return { success: true };
    }),

  /**
   * Get pending stock alerts (admin only)
   */
  getPendingAlerts: adminProcedure.query(async () => {
    return await getPendingStockAlerts();
  }),

  /**
   * Acknowledge a stock alert (admin only)
   */
  acknowledgeAlert: adminProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");

      await acknowledgeStockAlert(input.alertId, ctx.user.id);
      return { success: true };
    }),
});
