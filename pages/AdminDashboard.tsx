
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { Product, Category, SiteContent, FooterContent } from '../types';
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
  ChevronRight
} from 'lucide-react';

const Overview: React.FC = () => {
  const products = dataService.getProducts();
  const categories = dataService.getCategories();
  
  const stats = [
    { label: 'Total Produk', value: products.length, icon: <ShoppingBag size={20} />, color: 'bg-gray-900' },
    { label: 'Kategori Aktif', value: categories.filter(c => c.isActive).length, icon: <LayoutDashboard size={20} />, color: 'bg-green-600' },
    { label: 'Live Site', value: 'Online', icon: <Globe size={20} />, color: 'bg-blue-600' },
    { label: 'Status Server', value: 'Active', icon: <CheckCircle size={20} />, color: 'bg-emerald-600' },
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
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${stat.color.split('-')[1]}-100 transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">Aktivitas Terakhir</h3>
            <Link to="/admin/products" className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1">Lihat Semua <ChevronRight size={14} /></Link>
         </div>
         <div className="space-y-6">
            {products.slice(0, 3).map((p, i) => (
               <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                     <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-gray-50" />
                     <div>
                        <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Baru saja ditambahkan</div>
                     </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">IDR {p.price.toLocaleString()}</div>
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProducts(dataService.getProducts());
    setCategories(dataService.getCategories());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      dataService.saveProducts(updated);
    }
  };

  const handleToggle = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    setProducts(updated);
    dataService.saveProducts(updated);
  };

  const filteredItems = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const ProductForm = () => {
    const [formData, setFormData] = useState<Partial<Product>>(
      editingProduct || {
        name: '',
        price: 0,
        description: '',
        longDescription: '',
        ingredients: '',
        usage: '',
        weight: '',
        imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
        categoryId: categories[0]?.id || '',
        isActive: true,
        badge: undefined
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      let updatedProducts: Product[];
      if (editingProduct) {
        updatedProducts = products.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p);
      } else {
        const newProduct: Product = {
          ...formData as Product,
          id: 'p' + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString()
        };
        updatedProducts = [...products, newProduct];
      }
      setProducts(updatedProducts);
      dataService.saveProducts(updatedProducts);
      setIsModalOpen(false);
      setEditingProduct(null);
    };

    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-8 md:p-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <p className="text-sm text-gray-400 font-light mt-1">Lengkapi informasi produk secara detail.</p>
            </div>
            <button onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"><X size={20}/></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Nama Produk</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Contoh: Midnight Rose Perfume"
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Harga (IDR)</label>
                <input 
                  type="number" 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900" 
                  value={formData.price} 
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Kategori</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900 appearance-none" 
                  value={formData.categoryId} 
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Berat / Volume</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900" 
                  value={formData.weight} 
                  onChange={e => setFormData({ ...formData, weight: e.target.value })} 
                  placeholder="Contoh: 50ml / 30g"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Label / Badge</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900 appearance-none" 
                  value={formData.badge} 
                  onChange={e => setFormData({ ...formData, badge: e.target.value as any })}
                >
                  <option value="">Tidak ada label</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New">New Arrival</option>
                  <option value="Limited">Limited Edition</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Deskripsi Singkat</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900" 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Ringkasan singkat produk..."
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Deskripsi Lengkap</label>
                <textarea 
                  className="w-full px-6 py-5 rounded-[2rem] border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900 h-32 resize-none" 
                  value={formData.longDescription} 
                  onChange={e => setFormData({ ...formData, longDescription: e.target.value })} 
                  placeholder="Detail lengkap, manfaat, dan info produk lainnya..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Kandungan (Ingredients)</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:bg-white transition-all font-medium text-gray-900" 
                  value={formData.ingredients} 
                  onChange={e => setFormData({ ...formData, ingredients: e.target.value })} 
                  placeholder="Aqua, Glycerin, etc..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-gray-50">
              <button 
                type="button" 
                onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} 
                className="px-10 py-4 rounded-2xl border border-gray-100 font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors order-2 sm:order-1"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-12 py-4 rounded-2xl bg-gray-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-green-600 shadow-xl shadow-gray-100 transition-all active:scale-95 order-1 sm:order-2"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk</h2>
          <p className="text-gray-400 text-sm font-light mt-1">Kelola inventori dan penawaran terbaik brand Anda.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-grow sm:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
             <input 
                type="text" 
                placeholder="Cari produk..." 
                className="w-full pl-12 pr-6 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm outline-none focus:border-green-500 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} /> Tambah Produk
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Produk</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Kategori</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Harga</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map(p => (
                <tr key={p.id} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-6">
                     <div className="flex items-center gap-5">
                        <div className="relative">
                          <img src={p.imageUrl} className="w-16 h-16 rounded-[1.25rem] object-cover border border-gray-100 shadow-sm transition-transform group-hover:scale-105" />
                          {p.badge && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{p.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">{p.weight || 'Reguler'}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                      {categories.find(c => c.id === p.categoryId)?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-10 py-6 font-mono font-bold text-gray-900 text-sm">IDR {p.price.toLocaleString()}</td>
                  <td className="px-10 py-6">
                     <button 
                        onClick={() => handleToggle(p.id)} 
                        className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${p.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        {p.isActive ? 'Active' : 'Hidden'}
                      </button>
                  </td>
                  <td className="px-10 py-6">
                     <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} 
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-xl transition-all"
                          title="Edit Produk"
                        >
                          <Edit3 size={18}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                          title="Hapus Produk"
                        >
                          <Trash2 size={18}/>
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center"><Search size={24}/></div>
                      <p className="text-gray-400 font-light italic">Tidak ada produk yang ditemukan dengan kata kunci "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              )}
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
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Produk', path: '/admin/products', icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-['Inter']">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[110] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-80 bg-[#111827] text-white flex flex-col z-[120] transition-transform duration-500 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-2xl shadow-black/50'}`}>
        <div className="p-10 flex justify-between items-center">
          <span className="text-2xl font-bold tracking-tighter">LUXE<span className="text-green-500">ADMIN</span></span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-gray-800 rounded-xl"><X size={20}/></button>
        </div>
        <nav className="flex-grow px-6 space-y-3 mt-10">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6 px-4">Menu Utama</div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.label}
                to={item.path} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm group ${isActive ? 'bg-green-600 text-white shadow-xl shadow-green-900/20' : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'}`}
              >
                <span className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-green-500'} transition-colors`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-10 border-t border-gray-800/50">
          <button onClick={handleLogout} className="flex items-center gap-4 text-gray-500 hover:text-red-400 transition-colors font-bold text-sm px-4"><LogOut size={18} /> Keluar</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-80 min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all"><Menu size={24}/></button>
            <div className="hidden sm:block">
               <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Luxe Beauty Management System</p>
            </div>
          </div>
          <Link to="/" className="bg-gray-900 hover:bg-green-600 text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gray-100 transition-all active:scale-95">Preview Site</Link>
        </header>

        <div className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto">
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
