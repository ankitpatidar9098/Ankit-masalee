import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("inventory router", () => {
  let adminCaller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAdminContext();
    adminCaller = appRouter.createCaller(ctx);
  });

  it("should get low-stock products", async () => {
    const result = await adminCaller.inventory.getLowStockProducts();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get pending stock alerts", async () => {
    const result = await adminCaller.inventory.getPendingAlerts();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should set low-stock threshold for a product", async () => {
    const result = await adminCaller.inventory.setThreshold({
      productId: 1,
      thresholdQuantity: 15,
    });
    expect(result.success).toBe(true);
  });

  it("should restock a product", async () => {
    const result = await adminCaller.inventory.restock({
      productId: 1,
      quantity: 50,
      notes: "Bulk restock order",
    });
    expect(result.success).toBe(true);
  });

  it("should acknowledge a stock alert", async () => {
    // First create an alert
    const result = await adminCaller.inventory.acknowledgeAlert({
      alertId: 1,
    });
    expect(result.success).toBe(true);
  });

  it("should get inventory history for a product", async () => {
    const result = await adminCaller.inventory.getHistory({
      productId: 1,
      limit: 10,
    });
    expect(Array.isArray(result)).toBe(true);
  });
});
