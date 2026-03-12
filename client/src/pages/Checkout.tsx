import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const createOrderMutation = trpc.orders.create.useMutation();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
    paymentMethod: "cod",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-cormorant font-bold text-amber-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-amber-700 font-poppins mb-8">
            Add some delicious spices to your cart before checking out.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        totalAmount: getTotalPrice(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
      };

      await createOrderMutation.mutateAsync(orderData);

      toast.success("Order placed successfully! Check your email for confirmation.");
      clearCart();
      setLocation("/");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();
  const formatPrice = (price: number) => `₹${(price / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-cormorant font-bold text-amber-900 mb-12 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-cormorant font-bold text-amber-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-4 border-b">
                    <div>
                      <p className="font-poppins font-semibold text-amber-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-amber-700">
                        Qty: {item.quantity} {item.size && `(${item.size})`}
                      </p>
                    </div>
                    <p className="font-poppins font-bold text-orange-600">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-amber-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-poppins text-amber-900">Subtotal:</span>
                  <span className="font-poppins font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-poppins text-amber-900">Shipping:</span>
                  <span className="font-poppins font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center bg-amber-100 p-3 rounded-lg">
                  <span className="font-poppins font-bold text-amber-900">Total:</span>
                  <span className="font-poppins font-bold text-orange-600 text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Customer Information */}
              <div className="mb-8">
                <h3 className="text-xl font-cormorant font-bold text-amber-900 mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="customerName"
                    placeholder="Full Name *"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="border-amber-200 focus:border-amber-500"
                    required
                  />
                  <Input
                    type="email"
                    name="customerEmail"
                    placeholder="Email Address *"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="border-amber-200 focus:border-amber-500"
                    required
                  />
                  <Input
                    type="tel"
                    name="customerPhone"
                    placeholder="Phone Number *"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="border-amber-200 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h3 className="text-xl font-cormorant font-bold text-amber-900 mb-4">
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <Textarea
                    name="address"
                    placeholder="Street Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border-amber-200 focus:border-amber-500"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="border-amber-200 focus:border-amber-500"
                      required
                    />
                    <Input
                      type="text"
                      name="state"
                      placeholder="State *"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="border-amber-200 focus:border-amber-500"
                      required
                    />
                    <Input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code *"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="border-amber-200 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-xl font-cormorant font-bold text-amber-900 mb-4">
                  Payment Method
                </h3>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>

              {/* Order Notes */}
              <div className="mb-8">
                <h3 className="text-xl font-cormorant font-bold text-amber-900 mb-4">
                  Order Notes (Optional)
                </h3>
                <Textarea
                  name="notes"
                  placeholder="Add any special instructions for your order..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="border-amber-200 focus:border-amber-500"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
