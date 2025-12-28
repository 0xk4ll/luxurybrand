import React, { useState, useEffect, useMemo, useCallback } from "react";
// Fix: Import motion as motionBase and cast to any to bypass broken type definitions in the environment.
import { motion as motionBase, AnimatePresence } from "framer-motion";
const motion = motionBase as any;
import { Link } from "react-router-dom";
import { dataService } from "../services/dataService";
import { Product, Category, SiteContent, FooterContent } from "../types";
import {
  ShoppingBag,
  ChevronRight,
  Star,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  X,
  Info,
  Package,
  Sparkles,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [footer, setFooter] = useState<FooterContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    setProducts(dataService.getProducts());
    setCategories(dataService.getCategories());
    setSiteContent(dataService.getSiteContent());
    setFooter(dataService.getFooter());

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["home", "products", "tentang-kami", "testimoni"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: sectionId === "home" ? 0 : offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .filter(
        (p) => selectedCategory === "all" || p.categoryId === selectedCategory
      );
  }, [products, selectedCategory]);

  const activeCategories = categories.filter((c) => c.isActive);

  if (!siteContent || !footer)
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-400">
        Loading elegance...
      </div>
    );

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const navLinks = [
    { name: "Produk", id: "products" },
    { name: "Tentang Kami", id: "tentang-kami" },
    { name: "Testimoni", id: "testimoni" },
  ];

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "py-4 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm"
            : "py-5 md:py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <button
              onClick={() => scrollToSection("home")}
              className="text-lg md:text-2xl font-bold tracking-tighter text-gray-900 drop-shadow-sm hover:opacity-70 transition-opacity"
            >
              {siteContent.brandName}
            </button>
          </motion.div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className={`group relative text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${
                  activeSection === item.id
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-2 left-0 h-0.5 bg-green-600 transition-all duration-300 ${
                    activeSection === item.id
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:block"
            >
              <a
                href={`https://wa.me/${siteContent.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-900 hover:bg-green-600 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-green-200 inline-block"
              >
                Order Now
              </a>
            </motion.div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
            >
              <div className="px-6 py-10 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-xl font-bold transition-colors text-left ${
                      activeSection === link.id
                        ? "text-green-600"
                        : "text-gray-900"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                <div className="pt-4 border-t border-gray-50">
                  <a
                    href={`https://wa.me/${siteContent.whatsappNumber}?text=Halo, saya ingin bertanya mengenai produk Luxe & Beauty`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-2xl text-center font-bold shadow-xl shadow-green-100"
                  >
                    <MessageCircle size={20} /> WhatsApp Us
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Full Mobile Height */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-24 md:pt-32 mesh-gradient overflow-hidden"
      >
        {/* Decorative elements for mobile filler */}
        <div className="absolute top-[-5%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-green-100/30 rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[200px] h-[200px] bg-blue-50/20 rounded-full blur-[60px] md:hidden"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 py-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-5 py-2 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-6 md:mb-8"
            >
              Premium Collection 2024
            </motion.span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.15] mb-6 md:mb-8 max-w-lg lg:max-w-2xl tracking-tight">
              {siteContent.heroTitle}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-10 md:mb-12 max-w-md md:max-w-lg leading-relaxed font-light">
              {siteContent.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection("products")}
                className="w-full sm:w-auto bg-gray-900 text-white px-10 md:px-12 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all text-center shadow-2xl shadow-gray-200"
              >
                Jelajahi Produk
              </motion.button>

              <a
                href={`https://wa.me/${siteContent.whatsappNumber}?text=Halo, saya ingin konsultasi gratis mengenai produk Luxe & Beauty`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-center gap-3 text-gray-900 font-bold uppercase tracking-widest text-[11px] py-4 px-8 transition-colors hover:text-green-600"
              >
                Konsultasi Gratis{" "}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 animate-float">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"
                className="rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.18)] border-[12px] border-white w-full max-w-sm mx-auto object-cover aspect-[4/5]"
                alt="Premium Perfume"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section - Full Mobile Height */}
      <section
        id="products"
        className="min-h-screen py-20 md:py-32 lg:py-48 bg-white border-b border-gray-50 flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-12 md:mb-20"
          >
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Katalog Pilihan
              </h2>
              <p className="text-gray-500 font-light text-xs md:text-base">
                Pilih kategori yang sesuai dengan kebutuhan perawatan diri Anda.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 md:px-8 py-2.5 md:py-3 rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === "all"
                    ? "bg-green-600 text-white shadow-lg shadow-green-100"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 md:px-8 py-2.5 md:py-3 rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                    selectedCategory === cat.id
                      ? "bg-green-600 text-white shadow-lg shadow-green-100"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.badge && (
                      <div className="absolute top-4 md:top-6 right-4 md:right-6 px-3 md:px-4 py-1 md:py-1.5 bg-green-600 text-white rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white p-3 md:p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                        <Info className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 px-3 md:px-4 py-1.5 md:py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[9px] md:text-[10px] font-bold tracking-widest text-gray-900 shadow-sm uppercase">
                      IDR {product.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-5 px-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm mt-1 font-light line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-light italic text-sm">
                Belum ada produk di kategori ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-[10] p-2 bg-white/80 backdrop-blur-md hover:bg-white text-gray-900 rounded-full shadow-lg border border-gray-100 transition-all active:scale-95 group"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="md:w-1/2 aspect-square md:aspect-auto h-64 md:h-auto overflow-hidden">
                <img
                  src={selectedProduct.imageUrl}
                  className="w-full h-full object-cover"
                  alt={selectedProduct.name}
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-12 lg:p-14 flex flex-col">
                <div className="mb-6">
                  <span className="text-[9px] md:text-[10px] font-bold text-green-600 uppercase tracking-widest block mb-2">
                    {
                      activeCategories.find(
                        (c) => c.id === selectedProduct.categoryId
                      )?.name
                    }
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight pr-8">
                    {selectedProduct.name}
                  </h2>
                </div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 mb-6 md:mb-10 font-mono">
                  IDR {selectedProduct.price.toLocaleString()}
                </div>
                <div className="space-y-6 md:space-y-8 flex-grow">
                  <div>
                    <h4 className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 md:mb-3">
                      <Info className="w-4 h-4" /> Deskripsi
                    </h4>
                    <p className="text-gray-600 leading-relaxed font-light text-xs md:text-base">
                      {selectedProduct.longDescription ||
                        selectedProduct.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:gap-8">
                    <div>
                      <h4 className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        <Sparkles className="w-4 h-4" /> Bahan
                      </h4>
                      <p className="text-gray-600 text-[10px] md:text-sm font-light leading-relaxed">
                        {selectedProduct.ingredients || "-"}
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        <Package className="w-4 h-4" /> Isi
                      </h4>
                      <p className="text-gray-600 text-[10px] md:text-sm font-bold">
                        {selectedProduct.weight || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 md:mt-16">
                  <a
                    href={`https://wa.me/${siteContent.whatsappNumber}?text=Halo, saya ingin memesan ${selectedProduct.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 md:py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-center shadow-xl shadow-green-100 block transition-all active:scale-[0.98]"
                  >
                    Pesan via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Us Section - Full Mobile Height */}
      <section
        id="tentang-kami"
        className="min-h-screen py-20 md:py-32 lg:py-48 bg-gray-50 overflow-hidden relative flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-32 items-center w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="order-2 lg:order-1"
          >
            <span className="text-green-600 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 md:mb-6 block">
              Our Legacy
            </span>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight">
              Mendefinisikan Ulang Kecantikan Modern.
            </h2>
            <p className="text-sm md:text-lg text-gray-500 mb-8 md:mb-12 leading-relaxed font-light">
              {siteContent.aboutText}
            </p>
            <div className="grid grid-cols-2 gap-6 md:gap-12">
              <div>
                <h4 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">
                  100%
                </h4>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                  Natural Elements
                </p>
              </div>
              <div>
                <h4 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">
                  24h
                </h4>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                  Fragrance Stability
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-green-100/50 rounded-full blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=800"
                className="rounded-[2rem] md:rounded-[3.5rem] shadow-2xl w-full border-[6px] md:border-[15px] border-white relative z-10"
                alt="Process"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Full Mobile Height */}
      <section
        id="testimoni"
        className="min-h-screen py-20 md:py-32 lg:py-48 bg-white flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="text-center mb-12 md:mb-24">
            <span className="text-gray-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-3 block">
              Testimonials
            </span>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900">
              Apa Kata Mereka?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {[
              {
                name: "Siska Amelia",
                role: "Makeup Artist",
                text: "Parfumnya tahan seharian! Benar-benar sesuai ekspektasi saya untuk acara formal.",
                img: "https://i.pravatar.cc/150?u=siska",
              },
              {
                name: "Rendra Putra",
                role: "Digital Creator",
                text: "Serumnya ringan sekali, tidak lengket sama sekali. Kulit jadi lebih sehat dalam 2 minggu.",
                img: "https://i.pravatar.cc/150?u=rendra",
              },
              {
                name: "Linda Sari",
                role: "Entrepeneur",
                text: "Packagingnya mewah, pengiriman cepat. Bakal langganan terus di sini karena kualitasnya.",
                img: "https://i.pravatar.cc/150?u=linda",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 md:w-4 md:h-4 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm md:text-lg font-light leading-relaxed italic mb-8 group-hover:text-gray-900 transition-colors">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.img}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full grayscale group-hover:grayscale-0 transition-all border-2 border-transparent group-hover:border-green-100"
                    alt={t.name}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs md:text-sm">
                      {t.name}
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white pt-16 md:pt-32 pb-12 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-32">
            <div className="sm:col-span-2">
              <span className="text-xl md:text-3xl font-bold text-gray-900 block mb-6 tracking-tighter">
                {siteContent.brandName}
              </span>
              <p className="text-gray-400 max-w-sm mb-8 font-light leading-relaxed text-xs md:text-base">
                {footer.text}
              </p>
              <div className="flex gap-6">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection("home")}
                    className="text-gray-300 hover:text-green-600 transition-all hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-10">
                Links
              </h4>
              <ul className="space-y-4 text-gray-400 text-xs md:text-sm font-light">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="hover:text-gray-900 transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    to="/admin/login"
                    className="hover:text-green-600 transition-colors font-bold text-[10px] md:text-xs"
                  >
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-10">
                Legal
              </h4>
              <ul className="space-y-4 text-gray-400 text-xs md:text-sm font-light">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="hover:text-gray-900 transition-colors text-left"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="hover:text-gray-900 transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 text-center text-gray-300 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} {siteContent.brandName}.
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <motion.a
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href={`https://wa.me/${siteContent.whatsappNumber}?text=Halo, saya ingin bertanya sesuatu.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 md:w-20 md:h-20 bg-green-600 text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-2xl z-[150] transition-colors shadow-green-200"
      >
        <MessageCircle className="w-7 h-7 md:w-10 md:h-10" strokeWidth={2} />
      </motion.a>
    </div>
  );
};

export default LandingPage;
