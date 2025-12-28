import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
// Fix: Import motion as motionBase and cast to any to bypass broken type definitions in the environment.
import { motion as motionBase, AnimatePresence } from "framer-motion";
const motion = motionBase as any;
import { dataService } from "../services/dataService";
import { Product, Category, SiteContent, FooterContent } from "../types";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Plus,
  Globe,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Search,
  ChevronRight,
  Package,
  Sparkles,
  Info,
  Layers,
  Clock,
} from "lucide-react";

const Overview: React.FC = () => {
  const products = dataService.getProducts();
  const categories = dataService.getCategories();

  const stats = [
    {
      label: "Total Produk",
      value: products.length,
      icon: <ShoppingBag size={20} />,
      color: "bg-gray-900",
    },
    {
      label: "Kategori Aktif",
      value: categories.filter((c) => c.isActive).length,
      icon: <LayoutDashboard size={20} />,
      color: "bg-green-600",
    },
    {
      label: "Live Site",
      value: "Online",
      icon: <Globe size={20} />,
      color: "bg-blue-600",
    },
    {
      label: "Status Server",
      value: "Active",
      icon: <CheckCircle size={20} />,
      color: "bg-emerald-600",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div
              className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}
            >
              {stat.icon}
            </div>
            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              {stat.label}
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Aktivitas Terbaru
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Produk yang baru saja Anda tambahkan atau perbarui.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-[10px] font-bold text-green-600 hover:text-green-700 flex items-center gap-1 uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl transition-colors"
          >
            Semua Produk <ChevronRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {products.slice(0, 5).map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 md:px-10 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-5">
                <img
                  src={p.imageUrl}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm"
                />
                <div>
                  <div className="font-bold text-gray-900 text-sm md:text-base">
                    {p.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                    <Clock size={12} />{" "}
                    {new Date(p.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="text-base font-bold text-gray-900 pr-2">
                IDR {p.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setProducts(dataService.getProducts());
    setCategories(dataService.getCategories());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      dataService.saveProducts(updated);
    }
  };

  const handleToggle = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    setProducts(updated);
    dataService.saveProducts(updated);
  };

  const filteredItems = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductForm = () => {
    const [formData, setFormData] = useState<Partial<Product>>(
      editingProduct
        ? { ...editingProduct }
        : {
            name: "",
            price: 0,
            description: "",
            longDescription: "",
            ingredients: "",
            usage: "",
            weight: "",
            imageUrl:
              "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
            categoryId: categories[0]?.id || "",
            isActive: true,
          }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      let updatedProducts: Product[];
      if (editingProduct) {
        updatedProducts = products.map((p) =>
          p.id === editingProduct.id
            ? ({
                ...p,
                ...formData,
                createdAt: new Date().toISOString(),
              } as Product)
            : p
        );
      } else {
        const newProduct: Product = {
          ...(formData as Product),
          id: "p" + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        updatedProducts = [...products, newProduct];
      }
      setProducts(updatedProducts);
      dataService.saveProducts(updatedProducts);
      setIsModalOpen(false);
      setEditingProduct(null);
    };

    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl flex items-center justify-center z-[200] p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Sticky Header */}
          <div className="p-8 md:px-12 md:py-10 border-b border-gray-50 flex justify-between items-center bg-white shrink-0 relative">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {editingProduct ? "Edit Produk" : "Tambah Produk"}
              </h3>
              <p className="text-sm text-gray-400 font-light mt-1">
                Lengkapi informasi produk secara mendetail.
              </p>
            </div>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
              className="p-3 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="flex-grow overflow-y-auto p-8 md:p-12 space-y-12"
          >
            {/* Section 1: Dasar */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                <Info size={14} className="text-green-600" /> Informasi Utama
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    Nama Produk
                  </label>
                  <input
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all font-medium"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Contoh: Midnight Rose Eau de Parfum"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    Harga (IDR)
                  </label>
                  <input
                    type="number"
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    Kategori
                  </label>
                  <select
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Spesifikasi */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                <Package size={14} className="text-green-600" /> Spesifikasi &
                Badge
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    Berat / Isi
                  </label>
                  <input
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="Contoh: 50ml"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    Badge Produk
                  </label>
                  <select
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium appearance-none"
                    value={formData.badge || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        badge: (e.target.value as any) || undefined,
                      })
                    }
                  >
                    <option value="">Tanpa Badge</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New">New</option>
                    <option value="Limited">Limited</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Deskripsi */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                <Layers size={14} className="text-green-600" /> Deskripsi &
                Konten
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    Deskripsi Singkat
                  </label>
                  <input
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Ringkasan untuk kartu katalog..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    Deskripsi Lengkap
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium resize-none"
                    value={formData.longDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longDescription: e.target.value,
                      })
                    }
                    placeholder="Penjelasan detail tentang produk..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                      Komposisi (Ingredients)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium resize-none"
                      value={formData.ingredients}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ingredients: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                      Cara Penggunaan
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium resize-none"
                      value={formData.usage}
                      onChange={(e) =>
                        setFormData({ ...formData, usage: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                    URL Gambar
                  </label>
                  <input
                    className="w-full px-7 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:bg-white transition-all font-medium"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Sticky Footer */}
          <div className="p-8 md:px-12 md:py-8 border-t border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
              className="px-10 py-4 rounded-2xl border border-gray-200 font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white transition-colors order-2 sm:order-1"
            >
              Batal
            </button>
            <button
              form="product-form"
              type="submit"
              className="px-12 py-4 rounded-2xl bg-gray-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-green-600 shadow-xl shadow-green-100 transition-all active:scale-95 order-1 sm:order-2"
            >
              Simpan Produk
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Katalog Produk</h2>
          <p className="text-gray-400 text-sm font-light mt-1">
            Kelola daftar produk dan inventaris toko Anda.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-grow sm:w-80">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm outline-none focus:border-green-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-100 transition-all active:scale-95"
          >
            <Plus size={18} /> Tambah Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-7 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Produk
                </th>
                <th className="px-8 py-7 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Kategori
                </th>
                <th className="px-8 py-7 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Harga
                </th>
                <th className="px-8 py-7 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-10 py-7 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((p) => (
                <tr
                  key={p.id}
                  className="group hover:bg-gray-50/30 transition-colors"
                >
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img
                          src={p.imageUrl}
                          className="w-16 h-16 rounded-2xl object-cover border border-gray-100 bg-gray-50 shadow-sm"
                        />
                        {p.badge && (
                          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-600 text-white text-[8px] font-bold uppercase rounded-full border-2 border-white shadow-sm">
                            {p.badge}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-base">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">
                          {p.weight || "Reguler"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                      {categories.find((c) => c.id === p.categoryId)?.name ||
                        "General"}
                    </span>
                  </td>
                  <td className="px-8 py-7 font-mono font-bold text-gray-900 text-sm">
                    IDR {p.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-7">
                    <button
                      onClick={() => handleToggle(p.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                        p.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.isActive ? "bg-green-600" : "bg-red-600"
                        }`}
                      ></div>
                      {p.isActive ? "Aktif" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsModalOpen(true);
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-white text-gray-400 hover:bg-gray-900 hover:text-white rounded-2xl transition-all shadow-sm border border-gray-100"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-12 h-12 flex items-center justify-center bg-white text-gray-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm border border-gray-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <ProductForm />}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dataService.setAuth(null);
    navigate("/admin/login");
  };

  const menuItems = [
    { label: "Ringkasan", path: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      label: "Produk",
      path: "/admin/products",
      icon: <ShoppingBag size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[110] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-[#111827] text-white flex flex-col z-[120] transition-transform duration-500 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-12 flex justify-between items-center">
          <Link to="/admin" className="text-3xl font-bold tracking-tighter">
            LUXE<span className="text-green-500">.</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-3 bg-gray-800 rounded-2xl"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-grow px-8 space-y-4 mt-10">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-8 px-4">
            Menu Navigasi
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-5 px-6 py-5 rounded-2xl transition-all font-bold text-sm ${
                  isActive
                    ? "bg-green-600 text-white shadow-2xl shadow-green-900/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-12 border-t border-gray-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-gray-500 hover:text-red-400 transition-colors font-bold text-sm px-4"
          >
            <LogOut size={20} /> Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow lg:ml-80 min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-8 md:px-14 py-6 md:py-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-4 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {menuItems.find((m) => m.path === location.pathname)?.label ||
                  "Dashboard"}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                Sistem Manajemen Bisnis
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-gray-200"
          >
            Preview Site
          </Link>
        </header>

        <div className="p-8 md:p-14 lg:p-20 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/products" element={<ProductManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
