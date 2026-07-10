import React, { useState, useEffect, useRef } from 'react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import { Mail, Phone, Send } from 'lucide-react';

// The exact 8 colors chosen by the user
const THEME_COLORS = [
  "#F7C2D3", // Peony
  "#A9AFE0", // Iris
  "#DFCEEA", // Lavender
  "#A7C1D9", // Sierra Blue
  "#D8EFD5", // Green (12)
  "#DCE5D9", // Jade
  "#DFE3B0", // Lemongrass
  "#EDE7DE"  // Porcelain
];

// Weighted selection to minimize bright/white/yellowish colors
const COLOR_WEIGHTS = [
  10, // Peony (Pink)
  10, // Iris (Purple)
  2,  // Lavender (Light Purple - lowered)
  10, // Sierra Blue (Blue)
  2,  // Green 12 (Bright Green - lowered)
  3,  // Jade (Green)
  1,  // Lemongrass (Yellowish - very low)
  1   // Porcelain (White - very low)
];

function pickRandomColor(excludeColor?: string) {
  const totalWeight = COLOR_WEIGHTS.reduce((a, b) => a + b, 0);
  let newColor = excludeColor;
  let attempts = 0;
  
  // Try up to 10 times to pick a color different from excludeColor
  while ((newColor === excludeColor || !newColor) && attempts < 10) {
    let r = Math.random() * totalWeight;
    for (let i = 0; i < THEME_COLORS.length; i++) {
      if (r < COLOR_WEIGHTS[i]) {
        newColor = THEME_COLORS[i];
        break;
      }
      r -= COLOR_WEIGHTS[i];
    }
    attempts++;
  }
  return newColor || THEME_COLORS[0];
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Helper to smoothly interpolate between two hex colors
function lerpColor(a: string, b: string, amount: number) { 
    const ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

// Brand Icons
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const SteamIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
  </svg>
);

function App() {
  // Global shader colors, initialized randomly to ensure uniqueness on refresh
  const globalColorsTarget = useRef([
    pickRandomColor(), pickRandomColor(), pickRandomColor(), 
    pickRandomColor(), pickRandomColor(), pickRandomColor()
  ]);
  const globalColorsCurrent = useRef([...globalColorsTarget.current]);

  const [colors, setColors] = useState({
    c1: globalColorsCurrent.current[0], c2: globalColorsCurrent.current[1],
    c3: globalColorsCurrent.current[2], c4: globalColorsCurrent.current[3],
    c5: globalColorsCurrent.current[4], c6: globalColorsCurrent.current[5]
  });
  
  const [dynamics, setDynamics] = useState({
    momentum: 13,
    aberration: 0.61,
    radius: 3.5
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track physical mouse & virtual cursor
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const virtualMouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  // Interactions
  const lastMoveTimeRef = useRef(Date.now());
  const isDraggingRef = useRef(false);
  const activeBrushColor = useRef(pickRandomColor());
  const lastBrushPos = useRef({ x: 0, y: 0 });
  const globalTimeRef = useRef(0);
  
  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let frame: number;
    
    const loop = () => {
      globalTimeRef.current += 0.01;
      const now = Date.now();
      const idleTime = now - lastMoveTimeRef.current;
      
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Target coordinates
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;
      
      // Autonomous wandering if idle
      if (idleTime > 2000 && !isDraggingRef.current) {
         const wanderRadiusX = vw * 0.35;
         const wanderRadiusY = vh * 0.35;
         targetX = vw / 2 + Math.sin(globalTimeRef.current * 0.6) * wanderRadiusX * Math.cos(globalTimeRef.current * 0.35);
         targetY = vh / 2 + Math.cos(globalTimeRef.current * 0.45) * wanderRadiusY * Math.sin(globalTimeRef.current * 0.25);
      }
      
      const dx = targetX - virtualMouseRef.current.x;
      const dy = targetY - virtualMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Smooth tracking
      const trackingSpeed = isDraggingRef.current ? 0.03 : 0.08;
      virtualMouseRef.current.x += dx * trackingSpeed;
      virtualMouseRef.current.y += dy * trackingSpeed;
      
      // --- CANVAS FADE LOGIC ---
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'; // Slow fade out (calms down automatically)
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }

      // --- GLOBAL COLOR MIXING LOGIC ---
      // Randomly autonomous color drift very slowly
      if (Math.random() < 0.005) {
        globalColorsTarget.current[Math.floor(Math.random() * 6)] = pickRandomColor();
      }

      // Smoothly interpolate current colors to target colors
      for (let i = 0; i < 6; i++) {
        globalColorsCurrent.current[i] = lerpColor(globalColorsCurrent.current[i], globalColorsTarget.current[i], 0.02);
      }
      
      setColors({
        c1: globalColorsCurrent.current[0],
        c2: globalColorsCurrent.current[1],
        c3: globalColorsCurrent.current[2],
        c4: globalColorsCurrent.current[3],
        c5: globalColorsCurrent.current[4],
        c6: globalColorsCurrent.current[5]
      });
      
      // Fluid physics
      setDynamics({
        momentum: 13 + (dist / vw) * 60, 
        aberration: 0.61 + (dist / vw) * 1.5,
        radius: 3.5 + (dist / vw) * 4
      });
      
      frame = requestAnimationFrame(loop);
    };
    
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    activeBrushColor.current = pickRandomColor(activeBrushColor.current); // No repeating colors
    lastBrushPos.current = { x: e.clientX, y: e.clientY };
    mouseRef.current = { x: e.clientX, y: e.clientY };
    lastMoveTimeRef.current = Date.now();

    // Spawn initial local ripple
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.globalCompositeOperation = 'source-over';
      const grad = ctx.createRadialGradient(e.clientX, e.clientY, 0, e.clientX, e.clientY, 150);
      grad.addColorStop(0, hexToRgba(activeBrushColor.current, 0.9));
      grad.addColorStop(1, hexToRgba(activeBrushColor.current, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(e.clientX, e.clientY, 150, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Inject this color into global flow slowly so the fluid itself adopts it
    globalColorsTarget.current[Math.floor(Math.random() * 6)] = activeBrushColor.current;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = activeBrushColor.current;
        ctx.lineWidth = 140;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 50;
        ctx.shadowColor = activeBrushColor.current;

        ctx.beginPath();
        ctx.moveTo(lastBrushPos.current.x, lastBrushPos.current.y);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        
        ctx.shadowBlur = 0; // Reset
      }

      // Constantly inject brushed color into the global flow while dragging
      if (Math.random() < 0.1) {
        globalColorsTarget.current[Math.floor(Math.random() * 6)] = activeBrushColor.current;
      }
    }
    
    lastBrushPos.current = { x: e.clientX, y: e.clientY };
    mouseRef.current = { x: e.clientX, y: e.clientY };
    lastMoveTimeRef.current = Date.now();
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full bg-[#EFEFEF] m-0 p-0 overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-color" 
      />
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Shader style={{ width: '100vw', height: '100vh', display: 'block' }}>
          <Swirl 
            colorA={colors.c1} 
            colorB={colors.c2} 
            detail={1.7} 
          />
          <ChromaFlow 
            baseColor="#ffffff" 
            upColor={colors.c3}
            downColor={colors.c4} 
            leftColor={colors.c5} 
            rightColor={colors.c6} 
            momentum={dynamics.momentum} 
            radius={dynamics.radius} 
          />
          <FlutedGlass 
            aberration={dynamics.aberration} 
            angle={31} 
            frequency={8} 
            highlight={0.12} 
            highlightSoftness={0} 
            lightAngle={-90} 
            refraction={4} 
            shape="rounded" 
            softness={1} 
            speed={0.15} 
          />
          <FilmGrain strength={0.05} />
        </Shader>
      </div>

      {/* Foreground Content */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none p-4 overflow-y-auto">
        
        {/* The large base frame */}
        <div className="dark-glass dark-glass-frame rounded-3xl p-8 max-w-xl w-full pointer-events-auto flex flex-col gap-8 shadow-2xl mt-32 md:mt-0">
          
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-neutral-800 drop-shadow-sm mb-2 font-serif italic">Contact Me</h1>
            <p className="text-neutral-600 font-medium">Let's connect and build something extraordinary.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Twitter */}
            <a href="https://twitter.com/fredwjk" target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full group cursor-pointer">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform">
                <XIcon className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform h-[52px]">
                <div className="absolute inset-0 rounded-xl dark-glass tint-twitter tint-active-twitter opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-4 flex flex-col justify-center h-full">
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-0.5 group-hover:text-neutral-700 transition-colors">Twitter / X</span>
                  <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">@fredwjk</span>
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com/tsinwang" target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full group cursor-pointer">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform">
                <InstagramIcon className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform h-[52px]">
                <div className="absolute inset-0 rounded-xl dark-glass tint-instagram tint-active-instagram opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-4 flex flex-col justify-center h-full">
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-0.5 group-hover:text-neutral-700 transition-colors">Instagram</span>
                  <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">tsinwang</span>
                </div>
              </div>
            </a>

            {/* Github */}
            <a href="https://github.com/b0temperature" target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full group cursor-pointer">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform">
                <GithubIcon className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform h-[52px]">
                <div className="absolute inset-0 rounded-xl dark-glass tint-github tint-active-github opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-4 flex flex-col justify-center h-full">
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-0.5 group-hover:text-neutral-700 transition-colors">GitHub</span>
                  <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">b0temperature</span>
                </div>
              </div>
            </a>

            {/* Telegram */}
            <a href="https://t.me/fredwang105" target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full group cursor-pointer">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform">
                <Send className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform h-[52px]">
                <div className="absolute inset-0 rounded-xl dark-glass tint-telegram tint-active-telegram opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-4 flex flex-col justify-center h-full">
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-0.5 group-hover:text-neutral-700 transition-colors">Telegram</span>
                  <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">fredwang105</span>
                </div>
              </div>
            </a>

            {/* Facebook */}
            <a href="https://facebook.com/public/Fred-Wang" target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full group cursor-pointer">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform">
                <FacebookIcon className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform h-[52px]">
                <div className="absolute inset-0 rounded-xl dark-glass tint-facebook tint-active-facebook opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-4 flex flex-col justify-center h-full">
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-0.5 group-hover:text-neutral-700 transition-colors">Facebook</span>
                  <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">Fred Wang</span>
                </div>
              </div>
            </a>

            {/* Steam */}
            <a href="https://steamcommunity.com/id/wjkkkkkk" target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full group cursor-pointer">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform">
                <SteamIcon className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform h-[52px]">
                <div className="absolute inset-0 rounded-xl dark-glass tint-steam tint-active-steam opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-4 flex flex-col justify-center h-full">
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-0.5 group-hover:text-neutral-700 transition-colors">Steam</span>
                  <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">wjkkkkkk</span>
                </div>
              </div>
            </a>

            {/* Email Group */}
            <a href="mailto:wjkkkkk@gmail.com" className="flex items-start gap-3 w-full group cursor-pointer md:col-span-2">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform mt-1">
                <Mail className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform">
                <div className="absolute inset-0 rounded-xl dark-glass tint-email tint-active-email opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-5 py-4 flex flex-col justify-center h-full gap-3">
                  <div className="flex justify-between items-center border-b border-black/5 pb-2 group-hover:border-black/10 transition-colors">
                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider group-hover:text-neutral-700 transition-colors">Primary Email</span>
                    <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">wjkkkkk@gmail.com</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider group-hover:text-neutral-700 transition-colors">Secondary Email</span>
                    <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">ginkyzie@gmail.com</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Phone Group */}
            <a href="tel:+8618201776775" className="flex items-start gap-3 w-full group cursor-pointer md:col-span-2">
              <div className="w-12 h-12 rounded-full dark-glass dark-glass-sm flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform mt-1">
                <Phone className="w-5 h-5 text-neutral-800 drop-shadow-sm" />
              </div>
              <div className="relative flex-1 rounded-xl overflow-hidden group-active:scale-[0.98] transition-transform">
                <div className="absolute inset-0 rounded-xl dark-glass tint-phone tint-active-phone opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 px-5 py-4 flex flex-col justify-center h-full gap-3">
                  <div className="flex justify-between items-center border-b border-black/5 pb-2 group-hover:border-black/10 transition-colors">
                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider group-hover:text-neutral-700 transition-colors">Phone (CN)</span>
                    <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">+86 18201776775</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-black/5 pb-2 group-hover:border-black/10 transition-colors">
                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider group-hover:text-neutral-700 transition-colors">Phone (UK)</span>
                    <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">+44 7746714916</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider group-hover:text-neutral-700 transition-colors">Phone (HK)</span>
                    <span className="text-neutral-900 font-semibold text-sm drop-shadow-sm">+852 64735394</span>
                  </div>
                </div>
              </div>
            </a>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
