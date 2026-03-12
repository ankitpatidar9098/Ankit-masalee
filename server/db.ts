import { eq, and, lt, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, products, pageContent, inventoryTransactions, lowStockAlerts, stockAlertNotifications, orders, orderItems } from "../drizzle/schema";
import type { InsertInventoryTransaction, InsertLowStockAlert, InsertStockAlertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ============= CATEGORIES =============

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(asc(categories.displayOrder));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function createCategory(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  const id = (result as any).insertId;
  return getCategoryById(id);
}

export async function updateCategory(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
  return getCategoryById(id);
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// ============= PRODUCTS =============

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(asc(products.displayOrder));
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.categoryId, categoryId)).orderBy(asc(products.displayOrder));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  const id = (result as any).insertId;
  return getProductById(id);
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

// ============= PAGE CONTENT =============

export async function getAllPageContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pageContent).orderBy(asc(pageContent.displayOrder));
}

export async function getPageContentByKey(sectionKey: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pageContent).where(eq(pageContent.sectionKey, sectionKey)).limit(1);
  return result[0];
}

export async function getPageContentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pageContent).where(eq(pageContent.id, id)).limit(1);
  return result[0];
}

export async function createPageContent(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pageContent).values(data);
  const id = (result as any).insertId;
  return getPageContentById(id);
}

export async function updatePageContent(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pageContent).set(data).where(eq(pageContent.id, id));
  return getPageContentById(id);
}

export async function deletePageContent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pageContent).where(eq(pageContent.id, id));
}

// Inventory Management Functions

/**
 * Deduct stock from a product when an order is placed
 */
export async function deductProductStock(
  productId: number,
  quantity: number,
  orderId: number,
  userId?: number
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Inventory] Cannot deduct stock: database not available");
    return;
  }

  try {
    // Get current stock
    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!product.length) {
      throw new Error(`Product ${productId} not found`);
    }

    const currentStock = product[0].stock;
    const newStock = Math.max(0, currentStock - quantity);

    // Update product stock
    await db.update(products).set({ stock: newStock }).where(eq(products.id, productId));

    // Record transaction
    const transaction: InsertInventoryTransaction = {
      productId,
      transactionType: "order",
      quantity,
      previousStock: currentStock,
      newStock,
      reference: `ORD-${orderId}`,
      createdBy: userId,
    };

    await db.insert(inventoryTransactions).values(transaction);

    console.log(`[Inventory] Stock deducted for product ${productId}: ${currentStock} -> ${newStock}`);
  } catch (error) {
    console.error("[Inventory] Failed to deduct stock:", error);
    throw error;
  }
}

/**
 * Restock a product
 */
export async function restockProduct(
  productId: number,
  quantity: number,
  notes?: string,
  userId?: number
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Inventory] Cannot restock: database not available");
    return;
  }

  try {
    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!product.length) {
      throw new Error(`Product ${productId} not found`);
    }

    const currentStock = product[0].stock;
    const newStock = currentStock + quantity;

    await db.update(products).set({ stock: newStock }).where(eq(products.id, productId));

    const transaction: InsertInventoryTransaction = {
      productId,
      transactionType: "restock",
      quantity,
      previousStock: currentStock,
      newStock,
      notes,
      createdBy: userId,
    };

    await db.insert(inventoryTransactions).values(transaction);
  } catch (error) {
    console.error("[Inventory] Failed to restock:", error);
    throw error;
  }
}

/**
 * Get inventory transaction history for a product
 */
export async function getInventoryHistory(productId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(inventoryTransactions)
      .where(eq(inventoryTransactions.productId, productId))
      .orderBy(desc(inventoryTransactions.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Inventory] Failed to get history:", error);
    return [];
  }
}

/**
 * Create or update low-stock alert threshold for a product
 */
export async function setLowStockThreshold(productId: number, thresholdQuantity: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Inventory] Cannot set threshold: database not available");
    return;
  }

  try {
    const existing = await db
      .select()
      .from(lowStockAlerts)
      .where(eq(lowStockAlerts.productId, productId))
      .limit(1);

    if (existing.length) {
      await db
        .update(lowStockAlerts)
        .set({ thresholdQuantity })
        .where(eq(lowStockAlerts.productId, productId));
    } else {
      const alert: InsertLowStockAlert = {
        productId,
        thresholdQuantity,
      };
      await db.insert(lowStockAlerts).values(alert);
    }
  } catch (error) {
    console.error("[Inventory] Failed to set threshold:", error);
    throw error;
  }
}

/**
 * Get all products below their low-stock threshold
 */
export async function getLowStockProducts() {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select({
        product: products,
        threshold: lowStockAlerts.thresholdQuantity,
      })
      .from(products)
      .innerJoin(lowStockAlerts, eq(products.id, lowStockAlerts.productId))
      .where(
        and(
          lt(products.stock, lowStockAlerts.thresholdQuantity),
          eq(lowStockAlerts.isActive, 1)
        )
      );

    return result;
  } catch (error) {
    console.error("[Inventory] Failed to get low-stock products:", error);
    return [];
  }
}

/**
 * Create a stock alert notification
 */
export async function createStockAlert(
  productId: number,
  productName: string,
  currentStock: number,
  thresholdQuantity: number
): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const notification: InsertStockAlertNotification = {
      productId,
      productName,
      currentStock,
      thresholdQuantity,
    };

    await db.insert(stockAlertNotifications).values(notification);
    return 1;
  } catch (error) {
    console.error("[Inventory] Failed to create alert:", error);
    throw error;
  }
}

/**
 * Get pending stock alerts
 */
export async function getPendingStockAlerts() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(stockAlertNotifications)
      .where(eq(stockAlertNotifications.status, "pending"))
      .orderBy(desc(stockAlertNotifications.createdAt));
  } catch (error) {
    console.error("[Inventory] Failed to get pending alerts:", error);
    return [];
  }
}

/**
 * Mark stock alert as sent
 */
export async function markAlertAsSent(alertId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(stockAlertNotifications)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(stockAlertNotifications.id, alertId));
  } catch (error) {
    console.error("[Inventory] Failed to mark alert as sent:", error);
  }
}

/**
 * Acknowledge a stock alert
 */
export async function acknowledgeStockAlert(alertId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(stockAlertNotifications)
      .set({ status: "acknowledged", acknowledgedAt: new Date(), acknowledgedBy: userId })
      .where(eq(stockAlertNotifications.id, alertId));
  } catch (error) {
    console.error("[Inventory] Failed to acknowledge alert:", error);
  }
}
