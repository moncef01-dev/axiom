import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 360 Spin Viewer Component in React
interface Spin360ViewerProps {
  frontUrl: string;
  sideUrl: string;
  backUrl: string;
}

function Spin360Viewer({ frontUrl, sideUrl, backUrl }: Spin360ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = containerRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 4 keyframes: 0=front, 90=side, 180=back, 270=side-mirrored
    const imgs = [
      { src: frontUrl, mirror: false },
      { src: sideUrl, mirror: false },
      { src: backUrl, mirror: false },
      { src: sideUrl, mirror: true }
    ];

    const loaded = [false, false, false, false];
    const imgEls = imgs.map((d, i) => {
      const im = new Image();
      im.onload = () => {
        loaded[i] = true;
        if (loaded.every(Boolean)) draw();
      };
      im.src = d.src;
      return im;
    });

    let angle = 0; // degrees 0-360
    let dragging = false;
    let lastX = 0;
    let velocity = 0;
    let raf: number | null = null;

    function getBlend(angleVal: number) {
      const a = ((angleVal % 360) + 360) % 360;
      const seg = Math.floor(a / 90); // 0,1,2,3
      const t = (a % 90) / 90;        // 0-1 progress
      const from = seg;
      const to = (seg + 1) % 4;
      return { from, to, t };
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return;

      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const b = getBlend(angle);
      const imgA = imgEls[b.from];
      const imgB = imgEls[b.to];
      const mirA = imgs[b.from].mirror;
      const mirB = imgs[b.to].mirror;

      if (!imgA.complete || imgA.naturalWidth === 0 || !imgB.complete || imgB.naturalWidth === 0) return;

      function drawFrame(im: HTMLImageElement, mirror: boolean, alpha: number) {
        if (alpha <= 0.01 || !ctx) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        const aspect = im.naturalWidth / im.naturalHeight;
        const drawH = h * 0.92;
        const drawW = drawH * aspect;
        
        ctx.translate(w / 2, h / 2);
        if (mirror) ctx.scale(-1, 1);
        ctx.drawImage(im, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const et = ease(b.t);

      drawFrame(imgA, mirA, 1 - et);
      drawFrame(imgB, mirB, et);
    }

    function momentumLoop() {
      if (Math.abs(velocity) < 0.05) {
        raf = null;
        return;
      }
      velocity *= 0.94;
      angle += velocity;
      draw();
      raf = requestAnimationFrame(momentumLoop);
    }

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      setHintVisible(false);
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      velocity = dx * 0.5;
      angle += dx * 0.5;
      lastX = e.clientX;
      draw();
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      raf = requestAnimationFrame(momentumLoop);
    };

    const onTouchStart = (e: TouchEvent) => {
      dragging = true;
      lastX = e.touches[0].clientX;
      velocity = 0;
      setHintVisible(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - lastX;
      velocity = dx * 0.5;
      angle += dx * 0.5;
      lastX = e.touches[0].clientX;
      draw();
    };

    const onTouchEnd = () => {
      dragging = false;
      raf = requestAnimationFrame(momentumLoop);
    };

    // Attach event listeners
    wrap.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    const resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(canvas);

    // Initial draw in case images are pre-cached
    setTimeout(draw, 100);

    return () => {
      wrap.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      wrap.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      resizeObserver.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [frontUrl, sideUrl, backUrl]);

  return (
    <div ref={containerRef} className="spin360-wrap w-full h-full relative cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} className="spin360-canvas w-full h-full block" />
      {hintVisible && (
        <div className="spin360-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline mr-1">
            <path d="M21 12a9 9 0 1 1-18 0" />
            <polyline points="12 3 8 7 12 11" />
          </svg>
          Drag to spin
        </div>
      )}
    </div>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<{ id: number; emoji: string; name: string; price: number; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navBorder, setNavBorder] = useState(false);

  // Animated counters state
  const [athletesCount, setAthletesCount] = useState(0);
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [coachesCount, setCoachesCount] = useState(0);
  
  const statsSectionRef = useRef<HTMLDivElement | null>(null);

  // Ticker marquee texts
  const tickerItems = [
    'Live Biometric Data',
    'AI Performance Models',
    'Injury Prevention',
    'Elite Athlete Gear',
    'Real-Time Analytics',
    'Team Intelligence',
    'Where Movement Meets Intelligence',
  ];

  // Static product list matching original
  const products = [
    { id: 1, emoji: '👟', name: 'AXIOM Sprint X1', cat: 'Footwear', price: 18500, tag: 'New' },
    { id: 2, emoji: '👟', name: 'AXIOM Court Pro', cat: 'Footwear', price: 15900, tag: null },
    { id: 3, emoji: '__TEE__', name: 'Performance Tee', cat: 'Apparel', price: 3200, tag: 'Bestseller' },
    { id: 4, emoji: '🧥', name: 'Training Jacket', cat: 'Apparel', price: 8900, tag: null },
    { id: 5, emoji: '⌚', name: 'AXIOM Sensor Band', cat: 'Technology', price: 28000, tag: 'New' },
    { id: 6, emoji: '🧢', name: 'Training Cap', cat: 'Accessories', price: 1800, tag: 'Limited' },
    { id: 7, emoji: '🩳', name: 'Compression Shorts', cat: 'Apparel', price: 4200, tag: null },
    { id: 8, emoji: '🎒', name: 'AXIOM Kit Bag', cat: 'Accessories', price: 6500, tag: null },
  ];

  // Bar chart stats
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const barVals = [72, 85, 78, 91, 88, 95, 83];
  const maxBarVal = Math.max(...barVals);

  // Scroll handler for nav border
  useEffect(() => {
    const handleScroll = () => {
      setNavBorder(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for stats counters animation
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(2400, setAthletesCount);
            animate(98.4, setAccuracyRate, true);
            animate(76, setCoachesCount);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function animate(target: number, setter: React.Dispatch<React.SetStateAction<number>>, isFloat = false) {
    const dur = 1400;
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      cur = Math.min(cur + inc, target);
      setter(isFloat ? parseFloat(cur.toFixed(1)) : Math.round(cur));
      if (step >= steps) {
        setter(target);
        clearInterval(timer);
      }
    }, dur / steps);
  }

  // Cart operations
  const addToCart = (productId: number) => {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => item.id === productId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: p.id, emoji: p.emoji, name: p.name, price: p.price, qty: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const totalCartQty = cart.reduce((a, b) => a + b.qty, 0);
  const totalCartPrice = cart.reduce((a, b) => a + b.price * b.qty, 0);

  return (
    <div className="bg-axiom-black text-axiom-white min-h-screen font-body select-none">
      {/* CART OVERLAY & DRAWER */}
      {cartOpen && (
        <div
          id="cartOverlay"
          onClick={() => {
            setCartOpen(false);
            document.body.style.overflow = '';
          }}
          className="cart-overlay open"
        />
      )}
      <div id="cartDrawer" className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-head">
          <h3>Your Cart <span id="cartCountHead" style={{ color: 'var(--lime)' }}>{totalCartQty ? `(${totalCartQty})` : ''}</span></h3>
          <button
            className="cart-close"
            onClick={() => {
              setCartOpen(false);
              document.body.style.overflow = '';
            }}
          >
            ✕
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="ci-emoji">
                  {item.emoji === '__TEE__' ? '👕' : item.emoji}
                </div>
                <div>
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-price">DZD {item.price.toLocaleString()} × {item.qty}</div>
                </div>
                <button className="ci-remove" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-foot" id="cartFoot">
            <div className="cart-total-row">
              <span className="cart-total-lbl">Total</span>
              <span className="cart-total-val" id="cartTotalVal">DZD {totalCartPrice.toLocaleString()}</span>
            </div>
            <button className="checkout-btn" onClick={() => alert('Proceeding to checkout...')}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* NAVIGATION BAR */}
      <nav id="mainNav" style={{ borderBottomColor: navBorder ? 'var(--border)' : 'transparent' }}>
        <div className="nav-container">
          <div className="nav-logo cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="AXIOM logo" className="h-6" />
          </div>
          <div className="nav-links hidden lg:flex">
            <a href="#platform">Platform</a>
            <a href="#analytics">Analytics</a>
            <a href="#athletes">Athletes</a>
            <a href="#shop">Shop</a>
          </div>
          <div className="nav-right">
            <button
              className="cart-btn hidden md:flex"
              onClick={() => {
                setCartOpen(true);
                document.body.style.overflow = 'hidden';
              }}
            >
              🛒 Cart <span className="cart-count" id="cartCount">{totalCartQty}</span>
            </button>
            <button className="nav-cta hidden md:block" onClick={() => navigate('/login')}>
              Dashboard Login
            </button>
            <button className="hamburger" onClick={() => { setMobileMenuOpen(true); document.body.style.overflow = 'hidden'; }} aria-label="Menu">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-tag">Where Movement Meets Intelligence</div>
          <h1 className="hero-title font-condensed tracking-tighter leading-[0.88] mb-6">
            Peak <span className="accent text-lime block my-1">Performance</span> Data
          </h1>
          <p className="hero-sub font-body leading-relaxed max-w-2xl mx-auto mb-8">
            Sports Intelligence &nbsp;·&nbsp; Performance Analytics &nbsp;·&nbsp; AI-Powered Athlete Optimization
          </p>
          <div className="hero-actions flex flex-wrap gap-5 justify-center mt-6">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              SPORTS INTELLIGENCE PLATFORM
            </button>
            <button className="btn-outline" onClick={() => navigate('/login')}>
              LOGIN TO DASHBOARD
            </button>
          </div>
        </div>
      </section>

      {/* HORIZONTAL TICKER */}
      <div className="ticker border-y border-axiom-border">
        <div className="ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span className="ticker-item" key={idx}>
              {item} ✦{' '}
            </span>
          ))}
        </div>
      </div>

      {/* STATISTICS SECTION */}
      <section ref={statsSectionRef} className="bg-axiom-black border-b border-axiom-border" style={{ padding: '3rem 1.5rem' }}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-axiom-card border border-axiom-border p-6 text-center hover:border-lime/30 transition-all duration-300 group">
              <span className="font-condensed font-black text-5xl text-lime block leading-none mb-2 group-hover:scale-105 transition-transform duration-300">
                {athletesCount.toLocaleString()}+
              </span>
              <span className="text-axiom-white font-condensed font-700 tracking-wider text-xs uppercase">
                Athletes Assessed
              </span>
            </div>
            <div className="bg-axiom-card border border-axiom-border p-6 text-center hover:border-lime/30 transition-all duration-300 group">
              <span className="font-condensed font-black text-5xl text-lime block leading-none mb-2 group-hover:scale-105 transition-transform duration-300">
                {accuracyRate}%
              </span>
              <span className="text-axiom-white font-condensed font-700 tracking-wider text-xs uppercase">
                Success Rate
              </span>
            </div>
            <div className="bg-axiom-card border border-axiom-border p-6 text-center hover:border-lime/30 transition-all duration-300 group">
              <span className="font-condensed font-black text-5xl text-lime block leading-none mb-2 group-hover:scale-105 transition-transform duration-300">
                {coachesCount}+
              </span>
              <span className="text-axiom-white font-condensed font-700 tracking-wider text-xs uppercase">
                Coaches Supported
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES SECTION */}
      <section id="platform" className="relative bg-axiom-black overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(191,255,0,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(191,255,0,0.02) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        
        {/* Neon Corners decoration */}
        <div className="absolute top-12 left-12 w-10 h-10 border-t border-l border-lime/50" />
        <div className="absolute top-12 right-12 w-10 h-10 border-t border-r border-lime/50" />
        <div className="absolute bottom-12 left-12 w-10 h-10 border-b border-l border-lime/50" />
        <div className="absolute bottom-12 right-12 w-10 h-10 border-b border-r border-lime/50" />

        <div className="text-center px-6" style={{ paddingTop: '3.5rem', paddingBottom: 0 }}>
          <div className="pie-section-eyebrow">Platform Capabilities</div>
          <h2 className="pie-section-title font-condensed">PLATFORM CAPABILITIES</h2>
          <div className="pie-divider" />
          <p className="pie-section-sub">Advanced Sports Intelligence Modules</p>
        </div>

        {/* 10 Capabilities Grid */}
        <div className="pie-grid" style={{ paddingBottom: 0 }}>
          <div className="pie-card"><span className="pie-num">01</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div><div className="pie-card-name">Analytics</div><div className="pie-card-desc">Transform raw sports data into actionable insights.</div></div>
          <div className="pie-card"><span className="pie-num">02</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg></div><div className="pie-card-name">Performance</div><div className="pie-card-desc">Track and improve athletic performance in real time.</div></div>
          <div className="pie-card"><span className="pie-num">03</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg></div><div className="pie-card-name">AI Intelligence</div><div className="pie-card-desc">Advanced machine learning for smarter decisions.</div></div>
          <div className="pie-card"><span className="pie-num">04</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z" /></svg></div><div className="pie-card-name">Movement</div><div className="pie-card-desc">Analyze movement patterns and efficiency.</div></div>
          <div className="pie-card"><span className="pie-num">05</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><path d="M12 7v6" /><path d="M9 10l3 3 3-3" /><path d="M9 20l3-4 3 4" /><line x1="12" y1="13" x2="12" y2="16" /></svg></div><div className="pie-card-name">Biomechanics</div><div className="pie-card-desc">Understand body mechanics and physical execution.</div></div>
          <div className="pie-card"><span className="pie-num">06</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /><path d="M8 6h8" /></svg></div><div className="pie-card-name">Wearables</div><div className="pie-card-desc">Connect seamlessly with athlete tracking devices.</div></div>
          <div className="pie-card"><span className="pie-num">07</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></div><div className="pie-card-name">Heart Rate</div><div className="pie-card-desc">Monitor cardiovascular performance continuously.</div></div>
          <div className="pie-card"><span className="pie-num">08</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg></div><div className="pie-card-name">Injury Risk</div><div className="pie-card-desc">Identify risk factors before injuries occur.</div></div>
          <div className="pie-card"><span className="pie-num">09</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><path d="M23 12a11.05 11.05 0 0 1-22 0zm-5 7a3 3 0 0 1-6 0v-7" /><path d="M12 5V2" /></svg></div><div className="pie-card-name">Recovery</div><div className="pie-card-desc">Optimize recovery strategies and readiness.</div></div>
          <div className="pie-card"><span className="pie-num">10</span><div className="pie-icon-wrap"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg></div><div className="pie-card-name">Reports</div><div className="pie-card-desc">Generate professional performance reports instantly.</div></div>
        </div>
      </section>

      {/* ANALYTICS SECTION */}
      <section id="analytics" className="bg-axiom-dark" style={{ padding: '4rem 2rem' }}>
        <div className="analytics-section max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label">Analytics Engine</div>
            <h2 className="section-title font-condensed">Data That <br /> Coaches <br /> Can Act On</h2>
            <p className="section-body font-body">Every metric is contextualised — not just what happened, but why, and what to do next. AXIOM translates raw sensor data into plain-language coaching cues your staff can apply immediately.</p>
            <button className="btn-primary mt-8" onClick={() => navigate('/login')}>See Live Demo</button>
          </div>
          <div className="analytics-visual bg-axiom-card border border-axiom-border p-8 shadow-[0_0_50px_rgba(191,255,0,0.06)] hover:shadow-[0_0_60px_rgba(191,255,0,0.09)] transition-shadow duration-500">
            {/* Badges showcase */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-axiom-border pb-4">
              <span className="text-[0.65rem] font-condensed font-700 tracking-wider uppercase bg-lime/10 text-lime px-2.5 py-1 border border-lime/20">Analytics</span>
              <span className="text-[0.65rem] font-condensed font-700 tracking-wider uppercase bg-lime/10 text-lime px-2.5 py-1 border border-lime/20">AI Insights</span>
              <span className="text-[0.65rem] font-condensed font-700 tracking-wider uppercase bg-lime/10 text-lime px-2.5 py-1 border border-lime/20">Biomechanics</span>
              <span className="text-[0.65rem] font-condensed font-700 tracking-wider uppercase bg-lime/10 text-lime px-2.5 py-1 border border-lime/20">Recovery</span>
            </div>
            <div className="chart-header flex justify-between items-center mb-6">
              <span className="chart-title-sm font-condensed">Weekly Performance Index</span>
              <span className="chart-badge text-lime">● Live</span>
            </div>
            {/* Custom Bar Chart to match original styles */}
            <div className="bar-chart flex items-end gap-2 h-36">
              {days.map((day, idx) => {
                const val = barVals[idx];
                const isPeak = val === maxBarVal;
                const pct = (val / maxBarVal) * 100;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center h-full">
                    <div className={`bar w-full bg-axiom-border relative flex-1 ${isPeak ? 'peak' : ''}`}>
                      <div
                        className={`bar-fill absolute bottom-0 left-0 right-0 transition-all duration-1000 ${isPeak ? 'bg-lime shadow-[0_0_12px_rgba(191,255,0,0.25)]' : 'bg-[#333]'}`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <div className="bar-day text-[0.65rem] text-axiom-muted mt-2 tracking-wider font-condensed font-700 uppercase">
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chart-metrics grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-axiom-border">
              <div className="mini-metric"><span className="mini-val">87.3</span><span className="mini-lbl">Avg Score</span></div>
              <div className="mini-metric"><span className="mini-val">+4.1%</span><span className="mini-lbl">vs Last Week</span></div>
              <div className="mini-metric"><span className="mini-val">3</span><span className="mini-lbl">Alerts</span></div>
            </div>

            {/* Karim Ait-Hamou Profile strip */}
            <div className="profile-strip" style={{ marginTop: '1.5rem' }}>
              <div className="flex items-center gap-4">
                <div className="profile-avatar w-12 h-12 border-2 border-lime text-lime font-condensed font-900 text-lg flex items-center justify-center bg-lime/5">
                  KA
                </div>
                <div>
                  <div className="pname font-condensed font-700 text-sm tracking-wider uppercase text-axiom-white">Karim Aït-Hamou</div>
                  <div className="prole text-[0.65rem] text-axiom-muted tracking-wider uppercase">Sprinter · Elite Track</div>
                </div>
              </div>
              <div className="profile-kpis flex gap-6">
                <div className="pkpi"><span className="pkpi-val text-lime">92</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase">Readiness</span></div>
                <div className="pkpi"><span className="pkpi-val text-lime">10.41s</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase">100m PB</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATHLETES SECTION */}
      <section id="athletes" className="bg-axiom-black" style={{ padding: '4rem 2rem' }}>
        <div className="max-w-6xl mx-auto">
          <div className="section-label">Athlete Profiles</div>
          <h2 className="section-title font-condensed">Know Every <br /> Athlete, Deeply</h2>
          <p className="section-body font-body">Individual dashboards for every athlete — history, benchmarks, recovery curves, and predictive form ratings updated after every session.</p>
          
          <div className="mt-10 space-y-3">
            <div className="profile-strip">
              <div className="flex items-center gap-4">
                <div className="profile-avatar w-12 h-12 border-2 border-lime text-lime font-condensed font-900 text-lg flex items-center justify-center bg-lime/5">
                  SA
                </div>
                <div>
                  <div className="pname font-condensed font-700 text-sm tracking-wider uppercase">Sofia Amrani</div>
                  <div className="prole text-[0.65rem] text-axiom-muted tracking-wider uppercase">Midfielder · Football</div>
                </div>
              </div>
              <div className="profile-kpis flex gap-6">
                <div className="pkpi"><span className="pkpi-val text-lime">88</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase">Readiness</span></div>
                <div className="pkpi"><span className="pkpi-val text-lime">11.2 km</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase">Avg Distance</span></div>
                <div className="pkpi"><span className="pkpi-val text-lime">Low</span><span className="pkpi-lbl text-green-500 text-[0.6rem] uppercase font-bold">Injury Risk</span></div>
              </div>
            </div>

            <div className="profile-strip">
              <div className="flex items-center gap-4">
                <div className="profile-avatar w-12 h-12 border-2 border-lime text-lime font-condensed font-900 text-lg flex items-center justify-center bg-lime/5">
                  YB
                </div>
                <div>
                  <div className="pname font-condensed font-700 text-sm tracking-wider uppercase">Yacine Boudiaf</div>
                  <div className="prole text-[0.65rem] text-axiom-muted tracking-wider uppercase">Weightlifter · 94kg</div>
                </div>
              </div>
              <div className="profile-kpis flex gap-6">
                <div className="pkpi"><span className="pkpi-val text-lime">76</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase">Readiness</span></div>
                <div className="pkpi"><span className="pkpi-val text-lime">210 kg</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase font-bold">Clean & Jerk</span></div>
                <div className="pkpi"><span className="pkpi-val text-lime">Medium</span><span className="pkpi-lbl text-amber-500 text-[0.6rem] uppercase font-bold">Injury Risk</span></div>
              </div>
            </div>

            <div className="profile-strip">
              <div className="flex items-center gap-4">
                <div className="profile-avatar w-12 h-12 border-2 border-lime text-lime font-condensed font-900 text-lg flex items-center justify-center bg-lime/5">
                  NR
                </div>
                <div>
                  <div className="pname font-condensed font-700 text-sm tracking-wider uppercase">Nour Rahmani</div>
                  <div className="prole text-[0.65rem] text-axiom-muted tracking-wider uppercase">Swimmer · 200m Butterfly</div>
                </div>
              </div>
              <div className="profile-kpis flex gap-6">
                <div className="pkpi"><span className="pkpi-val text-lime">94</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase">Readiness</span></div>
                <div className="pkpi"><span className="pkpi-val text-lime">2:03.4</span><span className="pkpi-lbl text-axiom-muted text-[0.6rem] uppercase">Personal Best</span></div>
                <div className="pkpi"><span className="pkpi-val text-lime">Low</span><span className="pkpi-lbl text-green-500 text-[0.6rem] uppercase font-bold">Injury Risk</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-axiom-dark" style={{ padding: '4rem 2rem' }}>
        <div className="max-w-6xl mx-auto">
          <div className="section-label">Trusted By</div>
          <h2 className="section-title font-condensed">What Coaches <br /> Are Saying</h2>
          <div className="testimonials-grid mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="tcard bg-axiom-card border border-axiom-border p-8">
              <div className="stars text-lime mb-3">★★★★★</div>
              <p className="tcard-quote font-body text-axiom-white text-sm italic">"AXIOM completely changed how we approach weekly load management. We went from gut feeling to evidence — injury rate dropped 40% in one season."</p>
              <div className="tcard-author flex items-center gap-3 mt-6">
                <div className="tcard-avatar w-10 h-10 border border-lime text-lime font-condensed font-700 text-sm flex items-center justify-center">
                  MK
                </div>
                <div>
                  <div className="tcard-name font-condensed font-700 text-xs tracking-wider uppercase">Mohamed Khaled</div>
                  <div className="tcard-role text-[0.65rem] text-axiom-muted uppercase">Head Coach · USM Alger</div>
                </div>
              </div>
            </div>
            <div className="tcard bg-axiom-card border border-axiom-border p-8">
              <div className="stars text-lime mb-3">★★★★★</div>
              <p className="tcard-quote font-body text-axiom-white text-sm italic">"The athlete readiness scores are eerily accurate. My sprinters now arrive at championship day in the best shape of their lives — consistently."</p>
              <div className="tcard-author flex items-center gap-3 mt-6">
                <div className="tcard-avatar w-10 h-10 border border-lime text-lime font-condensed font-700 text-sm flex items-center justify-center">
                  LB
                </div>
                <div>
                  <div className="tcard-name font-condensed font-700 text-xs tracking-wider uppercase">Leila Bensaid</div>
                  <div className="tcard-role text-[0.65rem] text-axiom-muted uppercase">Athletics Coach · Algerian Federation</div>
                </div>
              </div>
            </div>
            <div className="tcard bg-axiom-card border border-axiom-border p-8">
              <div className="stars text-lime mb-3">★★★★★</div>
              <p className="tcard-quote font-body text-axiom-white text-sm italic">"Having biometric data and gear all in one platform saves hours of admin every week. The shop quality is elite — athletes love the gear."</p>
              <div className="tcard-author flex items-center gap-3 mt-6">
                <div className="tcard-avatar w-10 h-10 border border-lime text-lime font-condensed font-700 text-sm flex items-center justify-center">
                  AR
                </div>
                <div>
                  <div className="tcard-name font-condensed font-700 text-xs tracking-wider uppercase">Anis Rouabah</div>
                  <div className="tcard-role text-[0.65rem] text-axiom-muted uppercase">Performance Director · CRB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="bg-axiom-black" style={{ padding: '4rem 2rem' }}>
        <div className="max-w-6xl mx-auto">
          <div className="shop-intro flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="section-label">AXIOM Store</div>
              <h2 className="section-title font-condensed">Gear Up. <br /> Perform.</h2>
            </div>
            <button className="btn-outline font-condensed" onClick={() => alert('Browse catalog coming soon!')}>
              View All Products
            </button>
          </div>

          {/* Products Grid */}
          <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => {
              const isTee = p.emoji === '__TEE__';
              return (
                <div className="product-card flex flex-col justify-between bg-axiom-card border border-axiom-border overflow-hidden group hover:border-lime hover:-translate-y-1 transition-all duration-300 h-full" key={p.id}>
                  <div className="product-img h-52 bg-[#181818] flex items-center justify-center text-5xl relative">
                    {isTee ? (
                      <Spin360Viewer
                        frontUrl="/front.png"
                        sideUrl="/side.png"
                        backUrl="/back.png"
                      />
                    ) : (
                      p.emoji
                    )}
                    {p.tag && (
                      <span className="product-tag-badge absolute top-3 left-3 bg-lime text-axiom-black font-condensed font-900 text-[0.65rem] tracking-wider uppercase px-2 py-0.5">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <div className="product-info p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="product-cat text-[0.65rem] text-axiom-muted uppercase tracking-widest">{p.cat}</div>
                      <div className="product-name font-condensed font-700 text-sm uppercase tracking-wider text-axiom-white mt-1 min-h-[40px]">{p.name}</div>
                    </div>
                    <div>
                      <div className="product-price text-lime font-condensed font-700 mt-2">DZD {p.price.toLocaleString()}</div>
                      <button
                        className="product-add mt-4 w-full bg-transparent border border-axiom-border text-axiom-muted font-condensed font-700 text-xs uppercase tracking-widest py-2.5 hover:bg-lime hover:text-axiom-black hover:border-lime transition-all duration-200"
                        onClick={() => addToCart(p.id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <h2 className="font-condensed font-black text-axiom-black text-4xl sm:text-6xl uppercase leading-none mb-4 tracking-tighter">
          Ready to Move Smarter?
        </h2>
        <p className="text-axiom-black/80 font-condensed font-700 tracking-wider text-xs sm:text-sm uppercase mb-8 max-w-xl mx-auto">
          Join the next generation of sports intelligence.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="btn-dark font-condensed font-900 text-xs sm:text-sm tracking-widest uppercase py-3 px-8" onClick={() => navigate('/login')}>
            SPORTS INTELLIGENCE PLATFORM
          </button>
          <button className="btn-dark-outline font-condensed font-900 text-xs sm:text-sm tracking-widest uppercase py-3 px-8" onClick={() => navigate('/login')}>
            LOGIN TO DASHBOARD
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-axiom-border bg-axiom-black">
        <div className="footer-top grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 max-w-6xl mx-auto mb-16">
          <div className="lg:col-span-2">
            <div className="footer-logo font-condensed font-black text-2xl tracking-widest text-axiom-white uppercase mb-4">
              A<span className="text-lime">X</span>IOM
            </div>
            <p className="text-xs text-axiom-muted leading-relaxed max-w-sm font-body">
              The intelligent bridge between athletic movement and data-driven performance — built for coaches, athletes, and sports science professionals.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="font-condensed font-700 text-xs tracking-wider uppercase text-axiom-white mb-4">Platform</h4>
            <ul className="text-xs text-axiom-muted space-y-2 font-body">
              <li><a href="#" className="hover:text-lime transition-colors">Biometric Tracking</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">AI Load Models</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Injury Prevention</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Team Analytics</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">API Access</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="font-condensed font-700 text-xs tracking-wider uppercase text-axiom-white mb-4">Company</h4>
            <ul className="text-xs text-axiom-muted space-y-2 font-body">
              <li><a href="#" className="hover:text-lime transition-colors">About AXIOM</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Research</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="font-condensed font-700 text-xs tracking-wider uppercase text-axiom-white mb-4">Support</h4>
            <ul className="text-xs text-axiom-muted space-y-2 font-body">
              <li><a href="#" className="hover:text-lime transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Help Centre</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom border-t border-axiom-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="footer-copy text-[0.65rem] text-axiom-muted tracking-wider uppercase">
            © 2026 AXIOM Sports Intelligence. All rights reserved.
          </div>
          <div className="footer-socials flex gap-3 text-xs font-condensed font-700 tracking-wider">
            <a href="#" className="social-link w-9 h-9 border border-axiom-border text-axiom-muted hover:border-lime hover:text-lime transition-all flex items-center justify-center">IG</a>
            <a href="#" className="social-link w-9 h-9 border border-axiom-border text-axiom-muted hover:border-lime hover:text-lime transition-all flex items-center justify-center">𝕏</a>
            <a href="#" className="social-link w-9 h-9 border border-axiom-border text-axiom-muted hover:border-lime hover:text-lime transition-all flex items-center justify-center">IN</a>
            <a href="#" className="social-link w-9 h-9 border border-axiom-border text-axiom-muted hover:border-lime hover:text-lime transition-all flex items-center justify-center">YT</a>
          </div>
        </div>
      </footer>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div
          id="menuOverlay"
          onClick={() => {
            setMobileMenuOpen(false);
            document.body.style.overflow = '';
          }}
          className="cart-overlay open"
        />
      )}
      <div id="mobileMenuDrawer" className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-head">
          <div className="nav-logo" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            A<span className="text-lime">X</span>IOM
          </div>
          <button
            className="mobile-nav-close"
            onClick={() => {
              setMobileMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            ✕
          </button>
        </div>
        <div className="mobile-nav-links">
          <a href="#platform" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>Platform</a>
          <a href="#analytics" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>Analytics</a>
          <a href="#athletes" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>Athletes</a>
          <a href="#shop" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>Shop</a>
        </div>
        <div className="mobile-nav-actions">
          <button
            className="cart-btn w-full"
            onClick={() => {
              setMobileMenuOpen(false);
              setCartOpen(true);
            }}
          >
            🛒 Cart <span className="cart-count" id="cartCount">{totalCartQty}</span>
          </button>
          <button className="nav-cta w-full" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; navigate('/login'); }}>
            Dashboard Login
          </button>
        </div>
      </div>
    </div>
  );
}
