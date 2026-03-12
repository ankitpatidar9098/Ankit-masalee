import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Package } from "lucide-react";
import { toast } from "sonner";

export function InventoryDashboard() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restockNotes, setRestockNotes] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");

  // Queries
  const { data: lowStockProducts } = trpc.inventory.getLowStockProducts.useQuery();
  const { data: pendingAlerts } = trpc.inventory.getPendingAlerts.useQuery();
  const { data: inventoryHistory } = trpc.inventory.getHistory.useQuery(
    selectedProductId ? { productId: selectedProductId } : undefined,
    { enabled: !!selectedProductId }
  );

  // Mutations
  const restockMutation = trpc.inventory.restock.useMutation({
    onSuccess: () => {
      toast.success("Product restocked successfully");
      setRestockQuantity("");
      setRestockNotes("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to restock product");
    },
  });

  const thresholdMutation = trpc.inventory.setThreshold.useMutation({
    onSuccess: () => {
      toast.success("Low-stock threshold updated");
      setThresholdValue("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update threshold");
    },
  });

  const acknowledgeMutation = trpc.inventory.acknowledgeAlert.useMutation({
    onSuccess: () => {
      toast.success("Alert acknowledged");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to acknowledge alert");
    },
  });

  const handleRestock = () => {
    if (!selectedProductId || !restockQuantity) {
      toast.error("Please select a product and enter quantity");
      return;
    }

    restockMutation.mutate({
      productId: selectedProductId,
      quantity: parseInt(restockQuantity),
      notes: restockNotes || undefined,
    });
  };

  const handleSetThreshold = (productId: number) => {
    if (!thresholdValue) {
      toast.error("Please enter a threshold value");
      return;
    }

    thresholdMutation.mutate({
      productId,
      thresholdQuantity: parseInt(thresholdValue),
    });
  };

  return (
    <Tabs defaultValue="low-stock" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="low-stock">Low Stock Products</TabsTrigger>
        <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      {/* Low Stock Products Tab */}
      <TabsContent value="low-stock" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>Products below their low-stock threshold</CardDescription>
          </CardHeader>
          <CardContent>
            {!lowStockProducts || lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>All products have sufficient stock</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((item: any) => (
                  <Card key={item.product.id} className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">{item.product.stock}</p>
                          <p className="text-xs text-muted-foreground">Current Stock</p>
                        </div>
                      </div>

                      <div className="bg-white rounded p-3 mb-4 border border-orange-200">
                        <p className="text-sm">
                          <span className="font-semibold">Threshold:</span> {item.threshold} units
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          ⚠️ Stock below threshold by {item.threshold - item.product.stock} units
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Restock Quantity</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="number"
                              placeholder="Enter quantity"
                              value={selectedProductId === item.product.id ? restockQuantity : ""}
                              onChange={(e) => {
                                setSelectedProductId(item.product.id);
                                setRestockQuantity(e.target.value);
                              }}
                              min="1"
                            />
                            <Button
                              onClick={handleRestock}
                              disabled={restockMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {restockMutation.isPending ? "Restocking..." : "Restock"}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">Update Threshold</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="number"
                              placeholder="New threshold"
                              value={thresholdValue}
                              onChange={(e) => setThresholdValue(e.target.value)}
                              min="1"
                            />
                            <Button
                              onClick={() => handleSetThreshold(item.product.id)}
                              disabled={thresholdMutation.isPending}
                              variant="outline"
                            >
                              {thresholdMutation.isPending ? "Updating..." : "Update"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Stock Alerts Tab */}
      <TabsContent value="alerts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>Notifications for low stock items</CardDescription>
          </CardHeader>
          <CardContent>
            {!pendingAlerts || pendingAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50 text-green-600" />
                <p>No pending alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAlerts.map((alert: any) => (
                  <Card key={alert.id} className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold">{alert.productName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Current Stock: <span className="font-semibold text-red-600">{alert.currentStock}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Threshold: {alert.thresholdQuantity} units
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => acknowledgeMutation.mutate({ alertId: alert.id })}
                          disabled={acknowledgeMutation.isPending}
                          size="sm"
                          variant="outline"
                        >
                          {acknowledgeMutation.isPending ? "..." : "Acknowledge"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* History Tab */}
      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory History</CardTitle>
            <CardDescription>Transaction history for selected product</CardDescription>
          </CardHeader>
          <CardContent>
            {!inventoryHistory || inventoryHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transaction history</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-left py-2 px-2">Quantity</th>
                      <th className="text-left py-2 px-2">Previous Stock</th>
                      <th className="text-left py-2 px-2">New Stock</th>
                      <th className="text-left py-2 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryHistory.map((transaction: any) => (
                      <tr key={transaction.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2">
                          <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                            {transaction.transactionType}
                          </span>
                        </td>
                        <td className="py-2 px-2">{transaction.quantity}</td>
                        <td className="py-2 px-2">{transaction.previousStock}</td>
                        <td className="py-2 px-2 font-semibold">{transaction.newStock}</td>
                        <td className="py-2 px-2 text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
