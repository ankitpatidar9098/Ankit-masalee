import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { orders, orderItems } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendOrderNotificationEmail, sendOrderConfirmationEmail } from "../_core/emailService";
import { nanoid } from "nanoid";

export const ordersRouter = router({
  // Create a new order
  create: publicProcedure
    .input(
      z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        totalAmount: z.number(),
        paymentMethod: z.string().optional(),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            quantity: z.number(),
            price: z.number(),
            size: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Generate unique order number
        const orderNumber = `ORD-${Date.now()}-${nanoid(6)}`;

        // Create order
        const [orderResult] = await db.insert(orders).values({
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          address: input.address,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          totalAmount: input.totalAmount,
          paymentMethod: input.paymentMethod || "cod",
          notes: input.notes,
          status: "pending",
        });

        const orderId = orderResult.insertId;

        // Create order items
        for (const item of input.items) {
          await db.insert(orderItems).values({
            orderId: orderId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
          });
        }

        // Send email notifications
        const emailData = {
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          address: input.address,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          totalAmount: input.totalAmount,
          items: input.items,
          paymentMethod: input.paymentMethod || "cod",
          notes: input.notes,
        };

        // Send admin notification
        await sendOrderNotificationEmail(emailData);

        // Send customer confirmation
        await sendOrderConfirmationEmail(emailData);

        return {
          success: true,
          orderId,
          orderNumber,
        };
      } catch (error) {
        console.error("Error creating order:", error);
        throw error;
      }
    }),

  // Get order by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  // Get order by order number
  getByOrderNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, input.orderNumber))
        .limit(1);

      return result[0] || null;
    }),

  // Get all orders (admin only)
  listAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db.select().from(orders);
    return result;
  }),

  // Update order status (admin only)
  updateStatus: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        await db
          .update(orders)
          .set({ status: input.status })
          .where(eq(orders.id, input.orderId));

        return { success: true };
      } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
      }
    }),
});
