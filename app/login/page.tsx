'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password. Hint: Try admin@osm.org / admin");
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1628] font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#F97316]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#161D32]/80 backdrop-blur-xl border border-[#F97316]/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10 relative overflow-hidden">
        
        {/* Border glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F97316] to-transparent opacity-80" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your OSM Localize account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@osm.org"
              className="w-full bg-[#0F1628]/50 border border-[#2A344A] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#0F1628]/50 border border-[#2A344A] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-[#F97316] focus:ring-[#F97316]" />
              <span className="text-slate-400">Remember me</span>
            </label>
            <a href="#" className="text-[#F97316] hover:text-[#F97316]/80 transition-colors">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="h-px bg-[#2A344A] flex-1" />
          <span className="text-slate-500 text-sm">Or continue with</span>
          <div className="h-px bg-[#2A344A] flex-1" />
        </div>

        <div className="mt-6">
          <button 
            type="button" 
            onClick={() => signIn('openstreetmap')}
            className="w-full bg-[#2A344A]/50 hover:bg-[#2A344A] border border-[#2A344A] text-white py-3 px-4 rounded-xl transition-all flex items-center justify-center font-medium"
          >
            OpenStreetMap Single Sign-On
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account? <Link href="/signup" className="text-[#F97316] hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
