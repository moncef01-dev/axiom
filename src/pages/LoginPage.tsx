import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Activity } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('coach@axiomsports.ai');
  const [password, setPassword] = useState('Axiom2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use the pre-filled credentials.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-axiom-black flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.4,
        }}
      />
      {/* Lime glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(191,255,0,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <Activity size={18} className="text-lime" />
            <span className="font-condensed font-900 text-2xl tracking-[6px] uppercase text-axiom-white">
              AXI<span className="text-lime">OM</span>
            </span>
          </a>
          <p className="text-[0.65rem] tracking-[4px] uppercase text-axiom-muted">
            Sports Intelligence Platform
          </p>
        </div>

        {/* Card */}
        <div
          className="border border-axiom-border p-8"
          style={{ background: 'rgba(15,15,15,0.8)', backdropFilter: 'blur(20px)' }}
        >
          <div className="mb-8">
            <h2 className="font-condensed font-900 text-2xl tracking-widest uppercase text-axiom-white mb-1">
              Access Platform
            </h2>
            <p className="text-xs text-axiom-muted tracking-wider">
              Performance Intelligence Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[0.65rem] tracking-[2px] uppercase text-axiom-muted mb-2 font-condensed font-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-axiom-black border border-axiom-border px-4 py-3 text-sm text-axiom-white placeholder-axiom-muted outline-none focus:border-lime transition-colors tracking-wide"
                placeholder="coach@axiomsports.ai"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] tracking-[2px] uppercase text-axiom-muted mb-2 font-condensed font-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-axiom-black border border-axiom-border px-4 py-3 text-sm text-axiom-white placeholder-axiom-muted outline-none focus:border-lime transition-colors tracking-wide pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-axiom-muted hover:text-lime transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs tracking-wider border border-red-400/20 bg-red-400/5 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-condensed font-900 text-sm tracking-[3px] uppercase transition-all disabled:opacity-60"
              style={{ background: loading ? '#8FBF00' : '#BFFF00', color: '#080808' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-axiom-black/30 border-t-axiom-black rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Platform
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 pt-6 border-t border-axiom-border">
            <p className="text-[0.6rem] tracking-wider uppercase text-axiom-muted text-center mb-3">Demo Credentials</p>
            <div className="bg-axiom-black/50 border border-axiom-border/50 p-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-[0.6rem] tracking-wider uppercase text-axiom-muted">Email</span>
                <span className="text-[0.65rem] text-lime font-condensed font-700 tracking-wider">coach@axiomsports.ai</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[0.6rem] tracking-wider uppercase text-axiom-muted">Password</span>
                <span className="text-[0.65rem] text-lime font-condensed font-700 tracking-wider">Axiom2026</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-[0.6rem] tracking-wider uppercase text-axiom-muted">
          © 2026 AXIOM Sports · Performance Intelligence Platform
        </p>
      </div>
    </div>
  );
}
