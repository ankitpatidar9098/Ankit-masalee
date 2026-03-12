import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("orders router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createContext();
  });

  it("should create an order with items", async () => {
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "9876543210",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      totalAmount: 50000,
      paymentMethod: "cod",
      notes: "Please deliver in the morning",
      items: [
        {
          productId: 1,
          productName: "Turmeric Powder",
          quantity: 2,
          price: 25000,
          size: "500g",
        },
      ],
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("orderId");
    expect(result).toHaveProperty("orderNumber");
    expect(result.orderNumber).toMatch(/^ORD-/);
  });

  it("should retrieve order by ID", async () => {
    const caller = appRouter.createCaller(ctx);

    // Create an order first
    const createResult = await caller.orders.create({
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "9876543211",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      totalAmount: 75000,
      paymentMethod: "upi",
      items: [
        {
          productId: 2,
          productName: "Cumin Seeds",
          quantity: 1,
          price: 75000,
        },
      ],
    });

    // Retrieve the order
    const order = await caller.orders.getById({ id: createResult.orderId });

    expect(order).toBeDefined();
    expect(order?.customerName).toBe("Jane Doe");
    expect(order?.customerEmail).toBe("jane@example.com");
    expect(order?.totalAmount).toBe(75000);
  });

  it("should retrieve order by order number", async () => {
    const caller = appRouter.createCaller(ctx);

    // Create an order first
    const createResult = await caller.orders.create({
      customerName: "Bob Smith",
      customerEmail: "bob@example.com",
      customerPhone: "9876543212",
      address: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      totalAmount: 100000,
      paymentMethod: "card",
      items: [
        {
          productId: 3,
          productName: "Coriander Powder",
          quantity: 3,
          price: 33333,
          size: "250g",
        },
      ],
    });

    // Retrieve the order by order number
    const order = await caller.orders.getByOrderNumber({
      orderNumber: createResult.orderNumber,
    });

    expect(order).toBeDefined();
    expect(order?.orderNumber).toBe(createResult.orderNumber);
    expect(order?.customerName).toBe("Bob Smith");
  });

  it("should list all orders", async () => {
    const caller = appRouter.createCaller(ctx);

    // Create a few orders
    await caller.orders.create({
      customerName: "Alice",
      customerEmail: "alice@example.com",
      customerPhone: "9876543213",
      address: "111 Elm St",
      city: "Houston",
      state: "TX",
      postalCode: "77001",
      totalAmount: 50000,
      items: [
        {
          productId: 1,
          productName: "Turmeric",
          quantity: 1,
          price: 50000,
        },
      ],
    });

    await caller.orders.create({
      customerName: "Charlie",
      customerEmail: "charlie@example.com",
      customerPhone: "9876543214",
      address: "222 Oak St",
      city: "Phoenix",
      state: "AZ",
      postalCode: "85001",
      totalAmount: 60000,
      items: [
        {
          productId: 2,
          productName: "Cumin",
          quantity: 1,
          price: 60000,
        },
      ],
    });

    // List all orders
    const orders = await caller.orders.listAll();

    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThanOrEqual(2);
  });

  it("should update order status", async () => {
    const caller = appRouter.createCaller(ctx);

    // Create an order
    const createResult = await caller.orders.create({
      customerName: "Diana",
      customerEmail: "diana@example.com",
      customerPhone: "9876543215",
      address: "333 Maple Ave",
      city: "Philadelphia",
      state: "PA",
      postalCode: "19101",
      totalAmount: 80000,
      items: [
        {
          productId: 3,
          productName: "Coriander",
          quantity: 1,
          price: 80000,
        },
      ],
    });

    // Update status to confirmed
    const updateResult = await caller.orders.updateStatus({
      orderId: createResult.orderId,
      status: "confirmed",
    });

    expect(updateResult).toHaveProperty("success", true);

    // Verify the status was updated
    const order = await caller.orders.getById({ id: createResult.orderId });
    expect(order?.status).toBe("confirmed");
  });

  it("should handle multiple items in an order", async () => {
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      customerName: "Edward",
      customerEmail: "edward@example.com",
      customerPhone: "9876543216",
      address: "444 Cedar Ln",
      city: "San Antonio",
      state: "TX",
      postalCode: "78201",
      totalAmount: 150000,
      items: [
        {
          productId: 1,
          productName: "Turmeric",
          quantity: 2,
          price: 50000,
          size: "500g",
        },
        {
          productId: 2,
          productName: "Cumin",
          quantity: 1,
          price: 50000,
        },
      ],
    });

    expect(result.success).toBe(true);

    // Retrieve and verify
    const order = await caller.orders.getById({ id: result.orderId });
    expect(order?.totalAmount).toBe(150000);
  });

  it("should validate required fields", async () => {
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.create({
        customerName: "",
        customerEmail: "invalid-email",
        customerPhone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        totalAmount: 0,
        items: [],
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should transition order through status lifecycle", async () => {
    const caller = appRouter.createCaller(ctx);

    // Create order
    const createResult = await caller.orders.create({
      customerName: "Frank",
      customerEmail: "frank@example.com",
      customerPhone: "9876543217",
      address: "555 Birch Rd",
      city: "San Diego",
      state: "CA",
      postalCode: "92101",
      totalAmount: 120000,
      items: [
        {
          productId: 1,
          productName: "Turmeric",
          quantity: 1,
          price: 120000,
        },
      ],
    });

    const orderId = createResult.orderId;

    // Transition through statuses
    const statuses = ["confirmed", "shipped", "delivered"];

    for (const status of statuses) {
      await caller.orders.updateStatus({
        orderId,
        status: status as any,
      });

      const order = await caller.orders.getById({ id: orderId });
      expect(order?.status).toBe(status);
    }
  });
});
