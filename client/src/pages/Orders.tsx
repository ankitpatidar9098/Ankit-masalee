import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Orders() {
  const { data: allOrders = [], refetch } = trpc.orders.listAll.useQuery();
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: newStatus as any,
      });
      toast.success("Order status updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(2)}`;
  const formatDate = (date: Date) => new Date(date).toLocaleDateString();

  const selectedOrder = allOrders.find((o) => o.id === selectedOrderId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and track shipments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOrders.length > 0 ? (
                  allOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <TableCell className="font-mono text-sm">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No orders yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow p-6">
          {selectedOrder ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Order Number</p>
                    <p className="font-mono font-semibold">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="text-blue-600 break-all">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="text-sm">
                      {selectedOrder.address}
                      <br />
                      {selectedOrder.city}, {selectedOrder.state} {selectedOrder.postalCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatPrice(selectedOrder.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-semibold uppercase">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <p className="text-gray-600">Notes</p>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm mb-2">Update Status</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) =>
                    handleStatusChange(selectedOrder.id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
