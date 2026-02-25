import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, ShoppingCart } from "lucide-react";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data from backend
  const { data: categories = [] } = trpc.products.listCategories.useQuery();
  const { data: allProducts = [] } = trpc.products.listAll.useQuery();
  const { data: featuredProducts = [] } = trpc.products.listFeatured.useQuery();
  const { data: popularProducts = [] } = trpc.products.listPopular.useQuery();

  // Filter products based on active section
  const displayedProducts = useMemo(() => {
    if (activeSection === "featured") {
      return featuredProducts;
    } else if (activeSection === "popular") {
      return popularProducts;
    }
    return allProducts;
  }, [activeSection, featuredProducts, popularProducts, allProducts]);

  // Search products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return displayedProducts;
    
    return displayedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayedProducts, searchQuery]);

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-cormorant text-lg font-bold">Q</span>
            </div>
            <h1 className="text-2xl font-cormorant font-bold text-amber-900">Quality Kitchen Spices</h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#whole" className="text-amber-900 hover:text-amber-700 font-poppins transition">
              Whole Spices
            </a>
            <a href="#ground" className="text-amber-900 hover:text-amber-700 font-poppins transition">
              Ground Spices
            </a>
            <a href="#special" className="text-amber-900 hover:text-amber-700 font-poppins transition">
              Special Blends
            </a>
            <a href="#contact" className="text-amber-900 hover:text-amber-700 font-poppins transition">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <ShoppingCart className="w-6 h-6 text-amber-900 cursor-pointer hover:text-orange-600 transition" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="h-96 bg-cover bg-center relative"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1596040708502-c3f5f0f3c0d0?w=1920&h=1920&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-5xl font-cormorant font-bold mb-4">Premium Spices for Every Kitchen</h2>
              <p className="text-xl font-poppins mb-8">Authentic flavors, carefully sourced and packaged</p>
              <Button
                onClick={() => setActiveSection("featured")}
                className="bg-amber-500 hover:bg-amber-600 text-white font-poppins"
              >
                Explore Our Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b border-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
              <input
                type="text"
                placeholder="Search spices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="whole" className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h2 className="text-5xl font-cormorant font-bold text-amber-900 mb-2">Our Spices</h2>
            <p className="text-amber-700 font-poppins text-lg">Quality Kitchen Spices - Authentic & Fresh</p>
          </div>

          {/* Filter Buttons */}
          <div className="mb-8 flex justify-center gap-4 flex-wrap">
            <Button
              variant={activeSection === "featured" ? "default" : "outline"}
              onClick={() => setActiveSection("featured")}
              className="font-poppins"
            >
              Featured
            </Button>
            <Button
              variant={activeSection === "popular" ? "default" : "outline"}
              onClick={() => setActiveSection("popular")}
              className="font-poppins"
            >
              Popular
            </Button>
            <Button
              variant={activeSection === "all" ? "default" : "outline"}
              onClick={() => setActiveSection("all")}
              className="font-poppins"
            >
              All Products
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-cormorant font-bold text-amber-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-amber-700 font-poppins text-sm mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        {formatPrice(product.price)}
                      </span>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-amber-700 font-poppins text-lg">
                  No products found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-cormorant font-bold text-amber-900 text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 text-center hover:shadow-lg transition cursor-pointer"
              >
                <div className="text-5xl mb-4">{category.icon || "🌿"}</div>
                <h3 className="text-2xl font-cormorant font-bold text-amber-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-amber-700 font-poppins mb-4">{category.description}</p>
                <Button
                  variant="outline"
                  className="border-amber-500 text-amber-900 hover:bg-amber-50"
                >
                  Explore <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-cormorant font-bold text-amber-900 mb-4">
            Culinary Inspiration
          </h2>
          <p className="text-amber-700 font-poppins text-lg mb-12 max-w-2xl mx-auto">
            Discover how to use our premium spices in your favorite recipes
          </p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white font-poppins">
            Get Inspired
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-cormorant font-bold mb-4">About Us</h4>
              <p className="font-poppins text-amber-100">
                Premium spices sourced from the finest regions around the world.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-cormorant font-bold mb-4">Quick Links</h4>
              <ul className="font-poppins text-amber-100 space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-cormorant font-bold mb-4">Contact</h4>
              <p className="font-poppins text-amber-100">Email: info@qualityspices.com</p>
              <p className="font-poppins text-amber-100">Phone: +91 1234567890</p>
            </div>
            <div>
              <h4 className="text-lg font-cormorant font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-amber-300 transition">
                  Facebook
                </a>
                <a href="#" className="hover:text-amber-300 transition">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-amber-800 pt-8 text-center font-poppins text-amber-100">
            <p>&copy; 2026 Quality Kitchen Spices. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
