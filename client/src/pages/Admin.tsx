import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

  // Products queries and mutations
  const productsQuery = trpc.admin.products.list.useQuery();
  const createProductMutation = trpc.admin.products.create.useMutation();
  const updateProductMutation = trpc.admin.products.update.useMutation();
  const deleteProductMutation = trpc.admin.products.delete.useMutation();

  // Categories queries and mutations
  const categoriesQuery = trpc.admin.categories.list.useQuery();
  const createCategoryMutation = trpc.admin.categories.create.useMutation();
  const updateCategoryMutation = trpc.admin.categories.update.useMutation();
  const deleteCategoryMutation = trpc.admin.categories.delete.useMutation();

  // Page content queries and mutations
  const pageContentQuery = trpc.admin.pageContent.list.useQuery();
  const createPageContentMutation = trpc.admin.pageContent.create.useMutation();
  const updatePageContentMutation = trpc.admin.pageContent.update.useMutation();
  const deletePageContentMutation = trpc.admin.pageContent.delete.useMutation();

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to access the admin panel.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-amber-900">Admin Dashboard</h1>
          <p className="text-amber-700 mt-2">Manage products, categories, and page content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="content">Page Content</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Create a new spice product</DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    categories={categoriesQuery.data || []}
                    onSubmit={async (data) => {
                      try {
                        await createProductMutation.mutateAsync(data);
                        await productsQuery.refetch();
                        toast.success("Product created successfully");
                      } catch (error) {
                        toast.error("Failed to create product");
                      }
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {productsQuery.isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {productsQuery.data?.map((product) => (
                  <Card key={product.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>SKU: {product.sku || "N/A"}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                await deleteProductMutation.mutateAsync({ id: product.id });
                                await productsQuery.refetch();
                                toast.success("Product deleted");
                              } catch (error) {
                                toast.error("Failed to delete product");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500">Price</Label>
                          <p className="font-semibold">₹{(product.price / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Stock</Label>
                          <p className="font-semibold">{product.stock} units</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Sizes</Label>
                          <p className="text-sm">{product.sizes}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Status</Label>
                          <p className="text-sm">{product.isActive ? "Active" : "Inactive"}</p>
                        </div>
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-600">{product.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* CATEGORIES TAB */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new product category</DialogDescription>
                  </DialogHeader>
                  <CategoryForm
                    onSubmit={async (data) => {
                      try {
                        await createCategoryMutation.mutateAsync(data);
                        await categoriesQuery.refetch();
                        toast.success("Category created successfully");
                      } catch (error) {
                        toast.error("Failed to create category");
                      }
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {categoriesQuery.isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {categoriesQuery.data?.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{category.icon} {category.name}</CardTitle>
                          <CardDescription>Slug: {category.slug}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                await deleteCategoryMutation.mutateAsync({ id: category.id });
                                await categoriesQuery.refetch();
                                toast.success("Category deleted");
                              } catch (error) {
                                toast.error("Failed to delete category");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {category.description && (
                      <CardContent>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* PAGE CONTENT TAB */}
          <TabsContent value="content" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Page Content</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Section
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Content Section</DialogTitle>
                    <DialogDescription>Create a new page content section</DialogDescription>
                  </DialogHeader>
                  <PageContentForm
                    onSubmit={async (data) => {
                      try {
                        await createPageContentMutation.mutateAsync(data);
                        await pageContentQuery.refetch();
                        toast.success("Content section created successfully");
                      } catch (error) {
                        toast.error("Failed to create content section");
                      }
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {pageContentQuery.isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {pageContentQuery.data?.map((content) => (
                  <Card key={content.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{content.title || content.sectionKey}</CardTitle>
                          <CardDescription>Section: {content.sectionKey}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                await deletePageContentMutation.mutateAsync({ id: content.id });
                                await pageContentQuery.refetch();
                                toast.success("Content deleted");
                              } catch (error) {
                                toast.error("Failed to delete content");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {content.subtitle && (
                        <div>
                          <Label className="text-xs text-gray-500">Subtitle</Label>
                          <p className="text-sm">{content.subtitle}</p>
                        </div>
                      )}
                      {content.description && (
                        <div>
                          <Label className="text-xs text-gray-500">Description</Label>
                          <p className="text-sm">{content.description}</p>
                        </div>
                      )}
                      {content.buttonText && (
                        <div>
                          <Label className="text-xs text-gray-500">Button</Label>
                          <p className="text-sm">{content.buttonText} → {content.buttonLink}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// Form Components
function ProductForm({ categories, onSubmit }: { categories: any[]; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    categoryId: categories[0]?.id || 0,
    name: "",
    description: "",
    price: 0,
    sku: "",
    sizes: "1kg,500g,250g",
    stock: 0,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Product Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Turmeric Powder"
          required
        />
      </div>
      <div>
        <Label>Price (in paise) *</Label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          placeholder="e.g., 50000 for ₹500"
          required
        />
      </div>
      <div>
        <Label>Stock</Label>
        <Input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description"
        />
      </div>
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
        Create Product
      </Button>
    </form>
  );
}

function CategoryForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "🌿",
    description: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Category Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Whole Spices"
          required
        />
      </div>
      <div>
        <Label>Slug *</Label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., whole-spices"
          required
        />
      </div>
      <div>
        <Label>Icon (Emoji)</Label>
        <Input
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="🌿"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Category description"
        />
      </div>
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
        Create Category
      </Button>
    </form>
  );
}

function PageContentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    sectionKey: "",
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Section Key *</Label>
        <Input
          value={formData.sectionKey}
          onChange={(e) => setFormData({ ...formData, sectionKey: e.target.value })}
          placeholder="e.g., hero, spice-up-bite"
          required
        />
      </div>
      <div>
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Section title"
        />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="Section subtitle"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Section description"
        />
      </div>
      <div>
        <Label>Button Text</Label>
        <Input
          value={formData.buttonText}
          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
          placeholder="e.g., Learn More"
        />
      </div>
      <div>
        <Label>Button Link</Label>
        <Input
          value={formData.buttonLink}
          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
          placeholder="e.g., /products"
        />
      </div>
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
        Create Section
      </Button>
    </form>
  );
}
