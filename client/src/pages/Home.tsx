import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

/**
 * Quality Kitchen Spices - Home Page
 * Design Philosophy: Warm Maximalism with Texture
 * 
 * Key Design Elements:
 * - Warm color palette with terracotta, ochre, cream, and charcoal
 * - Organic, flowing layout with curved dividers
 * - Staggered product grids
 * - Premium typography (Cormorant Garamond + Poppins)
 * - Layered textures and depth
 */

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("whole");

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
            <a href="#whole" className="text-amber-900 hover:text-amber-700 font-poppins transition">Whole Spices</a>
            <a href="#ground" className="text-amber-900 hover:text-amber-700 font-poppins transition">Ground Spices</a>
            <a href="#special" className="text-amber-900 hover:text-amber-700 font-poppins transition">Special Blends</a>
            <a href="#contact" className="text-amber-900 hover:text-amber-700 font-poppins transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="h-96 bg-cover bg-center relative" style={{
          backgroundImage: 'url(https://private-us-east-1.manuscdn.com/sessionFile/58YSlluZlFLAuFds37LL1a/sandbox/6RJF99DJwz3AGMrFhip9TQ-img-1_1771079828000_na1fn_aGVyby1zcGljZXMtYmFubmVy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNThZU2xsdVpsRkxBdUZkczM3TEwxYS9zYW5kYm94LzZSSkY5OURKd3ozQUdNckZoaXA5VFEtaW1nLTFfMTc3MTA3OTgyODAwMF9uYTFmbl9hR1Z5YnkxemNHbGpaWE10WW1GdWJtVnkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=eMuvEHOmZuT23uaoBa3upJ9Nsks7~pGa5XHRrNs12RDJTv3G8qzyja9xpOubahDAqFAg7penmbATZoZk4y~GR-8XxMXNAB6b9J0k~rPTAK1tm8grrmeZKSRKE8fP-hSW~RmEcnNYfUmGg~LqOgP-m8WG1~nwWCNbYPhVtmPAiMfyZKCXNnVpqDYLUpT~8q4sBrkeIC14dMzbOXkrN8ve~tva~3y97E~TbmKIsXpxtcfBecP~BK5A5BlyqLEag~7MbOgoszSdfmOsa-D7j6xPm6Ae7hjUM0ty4cg00kFTMSpSlaPcxjHB-EY~bR2VM4ygbiH3bGeidDoOKV8syF6Hcg__)',
        }}>
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-5xl font-cormorant font-bold mb-4">Premium Spices for Every Kitchen</h2>
              <p className="text-xl font-poppins mb-8">Authentic flavors, carefully sourced and packaged</p>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white font-poppins">Explore Our Collection</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Whole Spices Section */}
      <section id="whole" className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h2 className="text-5xl font-cormorant font-bold text-amber-900 mb-2">Whole Spices</h2>
            <p className="text-amber-700 font-poppins text-lg">Quality Kitchen Spices - Authentic & Fresh</p>
          </div>

          <div className="mb-8 flex justify-center gap-4">
            <Button 
              variant={activeSection === "whole" ? "default" : "outline"}
              onClick={() => setActiveSection("whole")}
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
          </div>

          {/* Product Showcase */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img 
              src="https://private-us-east-1.manuscdn.com/sessionFile/58YSlluZlFLAuFds37LL1a/sandbox/6RJF99DJwz3AGMrFhip9TQ-img-2_1771079825000_na1fn_c3BpY2UtY2Fyb3VzZWwtd2hvbGU.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNThZU2xsdVpsRkxBdUZkczM3TEwxYS9zYW5kYm94LzZSSkY5OURKd3ozQUdNckZoaXA5VFEtaW1nLTJfMTc3MTA3OTgyNTAwMF9uYTFmbl9jM0JwWTJVdFkyRnliM1Z6Wld3dGQyaHZiR1UucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=eAW32lmDhHDpc1tO4wnNr0ft1TLzGJF5QSqN9rdQjn4x8L0wkNnW0YjqCEpF-0H6T4wsqcx0ECt0BHq8R8o3VXalV~TrghYS7BtbXH~~hQCA-AuBYZVq0bOnsS6NGwizEDToDra9tBdA2~1Fn6zOeaJU4DLHW7jwZyPxpofzmxeXhxpD48pWCqi2NnS~va6IfIk9hLlXWzfQno7S7L1Ib-cISNbZxeel8Cs1mww8LLvKYemOAF3wALKNSov8QHhqJLLxM877UDGD-1NYQTQ-d~Kh~-oHxq~5M5g~k1W9hXwwUBdYkwueaQwmlK1GaVKA8r1zMaF9Hq8G6dLRRjYUSw__"
              alt="Whole Spices Collection"
              className="w-full h-auto"
            />
            <div className="p-8 text-center bg-gradient-to-r from-amber-50 to-orange-50">
              <p className="text-amber-900 font-poppins text-lg mb-4">Available in</p>
              <div className="flex justify-center gap-6">
                <span className="px-4 py-2 bg-white rounded-lg font-poppins font-semibold text-amber-900">1 Kg</span>
                <span className="px-4 py-2 bg-white rounded-lg font-poppins font-semibold text-amber-900">500g</span>
                <span className="px-4 py-2 bg-white rounded-lg font-poppins font-semibold text-amber-900">250g</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ground Spices Section */}
      <section id="ground" className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <span className="text-2xl">🌾</span>
            </div>
            <h2 className="text-5xl font-cormorant font-bold text-amber-900 mb-2">Ground Spices</h2>
            <p className="text-amber-700 font-poppins text-lg">Quality Kitchen Spices - Finely Ground</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img 
              src="https://private-us-east-1.manuscdn.com/sessionFile/58YSlluZlFLAuFds37LL1a/sandbox/6RJF99DJwz3AGMrFhip9TQ-img-3_1771079828000_na1fn_c3BpY2UtY2Fyb3VzZWwtZ3JvdW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNThZU2xsdVpsRkxBdUZkczM3TEwxYS9zYW5kYm94LzZSSkY5OURKd3ozQUdNckZoaXA5VFEtaW1nLTNfMTc3MTA3OTgyODAwMF9uYTFmbl9jM0JwWTJVdFkyRnliM1Z6Wld3dFozSnZkVzVrLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=WkO8GJvTuSQe0odMM65kgnLEO4atxAK6YtQCpsi2F~6uP8inVAKF-Q71WFNCXnO33hblolGYVOlj6Pzmw7FHbfFo~CbQhm7sI2CwHm8-NrvBoasZi5-fprAANTDcmOZZnv~WCGECipEZNl26RA9~ieBs05WQjqWSJGmPr~LKUV31C811UHN7AIsZvVhdBXXhS55M20jYyHpO3XE6vNN04JnamHsWZ1CYtuam~knoV-rZfLhr5AgHQmDt0okwHUEvDC4PBTuCgKHpn4OADJmJrKzYU5FD5~898Tfod68RTHj4DOZLhyrykfdCta9BXufe26T-V-QXC~x1R0DR9to~Aw__"
              alt="Ground Spices Collection"
              className="w-full h-auto"
            />
            <div className="p-8 text-center bg-gradient-to-r from-orange-50 to-amber-50">
              <p className="text-amber-900 font-poppins text-lg mb-4">Available in</p>
              <div className="flex justify-center gap-6">
                <span className="px-4 py-2 bg-white rounded-lg font-poppins font-semibold text-amber-900">1 Kg</span>
                <span className="px-4 py-2 bg-white rounded-lg font-poppins font-semibold text-amber-900">500g</span>
                <span className="px-4 py-2 bg-white rounded-lg font-poppins font-semibold text-amber-900">250g</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Section - Spice Up Every Bite */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-cormorant font-bold text-amber-900 mb-6">Spice Up Every Bite</h2>
              <p className="text-amber-800 font-poppins text-lg mb-4 leading-relaxed">
                Discover the art of authentic spice blending. Our carefully curated collection brings the warmth of traditional flavors to your kitchen. Each spice is sourced for quality and freshness, ensuring that every meal becomes a culinary adventure.
              </p>
              <p className="text-amber-700 font-poppins mb-8">
                From everyday cooking to special occasions, our spices elevate your dishes with genuine, time-honored flavors.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white font-poppins flex items-center gap-2">
                Learn More <ChevronRight size={18} />
              </Button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/58YSlluZlFLAuFds37LL1a/sandbox/6RJF99DJwz3AGMrFhip9TQ-img-4_1771079826000_na1fn_Y29va2luZy1zY2VuZS1pbnNwaXJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNThZU2xsdVpsRkxBdUZkczM3TEwxYS9zYW5kYm94LzZSSkY5OURKd3ozQUdNckZoaXA5VFEtaW1nLTRfMTc3MTA3OTgyNjAwMF9uYTFmbl9ZMjl2YTJsdVp5MXpZMlZ1WlMxcGJuTndhWEpoZEdsdmJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=L0iZZxoPsb-jvDinMWhZ1AGuwYQoT1AJnAUWckQeE7mJVEz9rE9IOhjHj8leT1IBlXUMszjkwqcE7lH2HhabbnTdXEqCGkBcsXsLH-UzzfzdSQP7obG9Fb8JhJl-XJ00CjgMsiq~raH35gggjoPtm529l~OGSuadQWJYI3AvyiI~kbYNcYmNGBcVCooZ9bsOAx8SnotVldAgqfRJCIbSI42~XvYwlRwA3A6M-hD9amu6Hnoiw1eGc4r2OHYX3HX70W7dd3sDMqJzglpPY9VvSVYXd9egclmvtThYT9~6RO6V4m0e-OmK9u35zJmmnrZ0aOne1NJWff8Xwxgn2-0Z4A__"
                alt="Cooking with spices"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Discovery Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/58YSlluZlFLAuFds37LL1a/sandbox/6RJF99DJwz3AGMrFhip9TQ-img-5_1771079826000_na1fn_Y3VsaW5hcnktZGlzY292ZXJ5.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNThZU2xsdVpsRkxBdUZkczM3TEwxYS9zYW5kYm94LzZSSkY5OURKd3ozQUdNckZoaXA5VFEtaW1nLTVfMTc3MTA3OTgyNjAwMF9uYTFmbl9ZM1ZzYVc1aGNua3RaR2x6WTI5MlpYSjUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Y3YKP1pSaE5y4hSZC7M5~8SfJr1FlwwHhDoXglCZ1PiAL~Kiwhd-s7V21ngaWHGxlNX--lb4BVFljnS64I3qk-K6~3eciaTbljgPjVuNBMst8JHTeOshJ721w4hzanVBpL~AunSW4Lt4AD-c~4~DRZw16VJdlt0Tg4nRDRuUaRB9ORDv1GVlSsPNWazbl2nkE3RqpggBYzoSjTL4Dk~qg7rxvoxMtI3-92t4W4WVAqQ8x0kWXk0jmiogRL3teP~DUku0LU6bCYtO-0-h2RMUGuSfgU-BvTnN8ppMS7gf1yH5vj~SUwPq9A4LJ-jl41wDSKuoyRGHCoxLDovGLO7wOg__"
                alt="Culinary discovery"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-cormorant font-bold text-amber-900 mb-6">Discover the Culinary Magic</h2>
              <p className="text-amber-800 font-poppins text-lg mb-4 leading-relaxed">
                Transform your cooking with the right spices. Our collection represents generations of culinary tradition, bringing authentic flavors from around the world to your table.
              </p>
              <p className="text-amber-700 font-poppins mb-8">
                Whether you're a professional chef or a home cook, our premium spices provide the foundation for extraordinary meals.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white font-poppins flex items-center gap-2">
                Explore Recipes <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Special Collections Section */}
      <section id="special" className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-cormorant font-bold text-amber-900 mb-2">Special Collections</h2>
            <p className="text-amber-700 font-poppins text-lg">Curated blends for every occasion</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Everyday Essentials", desc: "The must-have spices for daily cooking" },
              { title: "Premium Blends", desc: "Expertly crafted masala combinations" },
              { title: "Gourmet Selection", desc: "Rare and exotic spices for adventurous cooks" }
            ].map((collection, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4"></div>
                <h3 className="text-2xl font-cormorant font-bold text-amber-900 mb-3">{collection.title}</h3>
                <p className="text-amber-700 font-poppins mb-6">{collection.desc}</p>
                <Button variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-50 font-poppins">
                  Explore <ChevronRight size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-cormorant font-bold text-amber-900 mb-6">Get in Touch</h2>
          <p className="text-amber-800 font-poppins text-lg mb-8 max-w-2xl mx-auto">
            Have questions about our spices? We'd love to hear from you. Contact us for bulk orders, partnerships, or just to share your favorite recipes.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white font-poppins px-8 py-3 text-lg">
            Contact Us
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-cormorant font-bold mb-4">Quality Kitchen Spices</h3>
              <p className="font-poppins text-sm text-amber-100">Premium spices for authentic flavors</p>
            </div>
            <div>
              <h4 className="font-cormorant font-bold mb-4">Products</h4>
              <ul className="space-y-2 font-poppins text-sm">
                <li><a href="#whole" className="hover:text-amber-200 transition">Whole Spices</a></li>
                <li><a href="#ground" className="hover:text-amber-200 transition">Ground Spices</a></li>
                <li><a href="#special" className="hover:text-amber-200 transition">Special Blends</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-cormorant font-bold mb-4">Company</h4>
              <ul className="space-y-2 font-poppins text-sm">
                <li><a href="#" className="hover:text-amber-200 transition">About Us</a></li>
                <li><a href="#" className="hover:text-amber-200 transition">Blog</a></li>
                <li><a href="#" className="hover:text-amber-200 transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-cormorant font-bold mb-4">Legal</h4>
              <ul className="space-y-2 font-poppins text-sm">
                <li><a href="#" className="hover:text-amber-200 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-200 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-amber-200 transition">Shipping Info</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 pt-8 text-center font-poppins text-sm text-amber-100">
            <p>&copy; 2026 Quality Kitchen Spices. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
