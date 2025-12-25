
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { Lock, Mail, ArrowLeft, Loader2, Info } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulated network delay for premium feel
    setTimeout(() => {
      if (email === 'admin@brand.com' && password === 'admin123') {
        dataService.setAuth('mock-jwt-token');
        navigate('/admin');
      } else {
        setError('Email atau password salah. Silakan coba lagi.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] p-10 md:p-12 border border-white">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Lock size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 font-light">Kelola katalog dan konten Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode='wait'>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider border border-red-100 flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${
                isLoading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 text-white hover:bg-green-600 hover:shadow-green-100 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Hint Card */}
          <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="flex items-center gap-3 text-gray-400 mb-3">
              <Info size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Login Demo Kredensial</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 flex justify-between"><span>Email:</span> <span className="font-mono font-bold text-gray-900">admin@brand.com</span></p>
              <p className="text-xs text-gray-500 flex justify-between"><span>Pass:</span> <span className="font-mono font-bold text-gray-900">admin123</span></p>
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="mt-8 mx-auto flex items-center gap-2 text-gray-400 hover:text-gray-900 text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Landing Page
        </motion.button>
      </motion.div>
      
      <div className="mt-16 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
        Luxe Beauty Admin System v2.1
      </div>
    </div>
  );
};

export default AdminLogin;
