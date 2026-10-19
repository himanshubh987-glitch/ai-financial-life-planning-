const fs = require('fs');
const path = require('path');

// Read all 4 screen HTML files
const s1Html = fs.readFileSync('stitch_downloads/screen_1_financial_pulse_d1135e3d0d7d4bde95f62369efc429a5.html', 'utf8');
const s2Html = fs.readFileSync('stitch_downloads/screen_2_life_goals_33ac66aea64f4d4a9d8e96bf98e33152.html', 'utf8');
const s3Html = fs.readFileSync('stitch_downloads/screen_3_strategic_roadmap_1df98ab4e5c0478b9ea9d593d605309c.html', 'utf8');
const s4Html = fs.readFileSync('stitch_downloads/screen_4_ai_advisor_400ddf6af30c4e97985d4218f262c9e0.html', 'utf8');

function extractMainInner(html) {
  const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!match) return { inner: '', script: '' };
  let content = match[1];
  
  // Extract script
  let script = '';
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (scriptMatch) {
    script = scriptMatch[1];
    content = content.replace(scriptMatch[0], '');
  }
  
  return { inner: content.trim(), script: script.trim() };
}

const s1 = extractMainInner(s1Html);
const s2 = extractMainInner(s2Html);
const s3 = extractMainInner(s3Html);
const s4 = extractMainInner(s4Html);

// Build Screen 5 (Money & Assets)
const s5Inner = `
<div class="flex flex-col w-full px-margin-mobile gap-space-lg pb-10">
  <!-- Asset Class Telemetry Header -->
  <div class="flex items-center justify-between pt-2">
    <div class="flex flex-col">
      <span class="font-label-tag text-label-tag uppercase tracking-wider text-text-secondary-dark font-medium">Balance Sheet Architecture</span>
      <h1 class="font-headline-md text-headline-md text-text-primary-dark tracking-tight">Consolidated Assets</h1>
    </div>
    <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-growth-tint text-growth-deep">
      <span class="w-2 h-2 rounded-full bg-growth-vibrant animate-pulse"></span>
      <span class="font-label-tag text-label-tag font-medium">Real-Time NAV</span>
    </div>
  </div>

  <!-- Hero Net Worth Card -->
  <section class="relative w-full rounded-xl bg-surface-card-dark text-text-primary-light p-space-md shadow-xl overflow-hidden">
    <div class="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-ai-violet/20 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-20 -left-16 w-52 h-52 rounded-full bg-growth-vibrant/15 blur-3xl pointer-events-none"></div>
    <div class="relative z-10 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="font-label-tag text-label-tag tracking-wider uppercase text-text-muted-dark">Portfolio Valuation</span>
        <span class="px-2.5 py-0.5 rounded-full bg-growth-deep/20 text-growth-soft font-label-tag text-label-tag font-semibold">Tier 1 Private</span>
      </div>
      <div>
        <div class="font-headline-xl-mobile text-headline-xl-mobile text-text-primary-light tracking-tight font-bold">₹58,42,500</div>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-growth-soft font-label-tag text-label-tag font-semibold flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[14px]">trending_up</span> +₹1,84,000 (3.2%)
          </span>
          <span class="text-text-muted-dark font-body-sm text-body-sm">past 30 days</span>
        </div>
      </div>

      <!-- Asset Allocation Spectrum Bar -->
      <div class="mt-2 flex flex-col gap-1.5">
        <div class="flex justify-between font-label-tag text-label-tag text-text-muted-dark">
          <span>Allocation Distribution</span>
          <span>4 Asset Classes</span>
        </div>
        <div class="w-full h-3 rounded-full overflow-hidden flex bg-surface-card-dark-secondary">
          <div class="h-full bg-growth-vibrant" style="width: 55.6%;" title="Equities 55.6%"></div>
          <div class="h-full bg-ai-violet" style="width: 24.3%;" title="Fixed Income & EPF 24.3%"></div>
          <div class="h-full bg-alert-amber" style="width: 8.2%;" title="Gold SGB 8.2%"></div>
          <div class="h-full bg-surface-container-high" style="width: 11.9%;" title="Liquid Reserves 11.9%"></div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-body-sm text-[11px] text-text-muted-dark">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-growth-vibrant"></span>
            <span>Equities (55.6%)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-ai-violet"></span>
            <span>Debt/EPF (24.3%)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-alert-amber"></span>
            <span>Gold (8.2%)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-surface-container-high"></span>
            <span>Liquid (11.9%)</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Detailed Asset Class Holdings -->
  <section class="flex flex-col gap-space-sm">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-sm text-headline-sm text-text-primary-dark">Holding Accounts</h2>
      <button class="font-body-sm text-body-sm text-growth-deep font-semibold hover:underline flex items-center gap-0.5" id="syncAccountsBtn">
        <span class="material-symbols-outlined text-[16px]">sync</span> Refresh NAV
      </button>
    </div>

    <!-- Asset 1: Equity Mutual Funds & Stocks -->
    <div class="rounded-xl bg-surface-card-light p-space-md shadow-sm border border-border-subtle flex flex-col gap-2.5">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-growth-tint text-growth-deep flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[22px]">candlestick_chart</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-headline-sm text-body-lg text-text-primary-dark font-semibold">Equities & Mutual Funds</span>
              <span class="px-2 py-0.5 rounded-full bg-growth-tint text-growth-deep font-label-tag text-[10px] font-bold">55.6%</span>
            </div>
            <span class="font-body-sm text-body-sm text-text-secondary-dark">4 Mutual Funds, 12 Stocks • Zerodha & Groww</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="font-label-numeric-md text-label-numeric-md font-bold text-text-primary-dark">₹32,50,000</span>
          <span class="font-label-tag text-[11px] text-growth-deep font-semibold">+16.4% XIRR</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-border-subtle text-body-sm text-[12px] text-text-secondary-dark">
        <span>Active SIP: ₹45,000/mo</span>
        <span class="text-text-primary-dark font-medium">Unrealized Gain: +₹6.82L</span>
      </div>
    </div>

    <!-- Asset 2: Provident Fund & Debt -->
    <div class="rounded-xl bg-surface-card-light p-space-md shadow-sm border border-border-subtle flex flex-col gap-2.5">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-ai-violet/10 text-ai-violet flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[22px]">account_balance</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-headline-sm text-body-lg text-text-primary-dark font-semibold">EPF & Debt Securities</span>
              <span class="px-2 py-0.5 rounded-full bg-ai-violet/10 text-ai-violet font-label-tag text-[10px] font-bold">24.3%</span>
            </div>
            <span class="font-body-sm text-body-sm text-text-secondary-dark">UAN EPFO & Corporate Bond Fund</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="font-label-numeric-md text-label-numeric-md font-bold text-text-primary-dark">₹14,20,000</span>
          <span class="font-label-tag text-[11px] text-ai-violet font-semibold">8.25% Guaranteed</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-border-subtle text-body-sm text-[12px] text-text-secondary-dark">
        <span>Monthly PF Inflow: ₹22,200</span>
        <span class="text-text-primary-dark font-medium">Maturity: Tax-free at 58</span>
      </div>
    </div>

    <!-- Asset 3: Sovereign Gold Bonds -->
    <div class="rounded-xl bg-surface-card-light p-space-md shadow-sm border border-border-subtle flex flex-col gap-2.5">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-alert-amber-soft text-alert-amber flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[22px]">stars</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-headline-sm text-body-lg text-text-primary-dark font-semibold">Sovereign Gold Bonds (SGB)</span>
              <span class="px-2 py-0.5 rounded-full bg-alert-amber-soft text-alert-amber font-label-tag text-[10px] font-bold">8.2%</span>
            </div>
            <span class="font-body-sm text-body-sm text-text-secondary-dark">68 Grams @ ₹7,058/g • RBI Tranches 2028-31</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="font-label-numeric-md text-label-numeric-md font-bold text-text-primary-dark">₹4,80,000</span>
          <span class="font-label-tag text-[11px] text-alert-amber font-semibold">+2.5% Semi-annual payout</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-border-subtle text-body-sm text-[12px] text-text-secondary-dark">
        <span>Hedge status: Inflation shielded</span>
        <span class="text-text-primary-dark font-medium">Exempt from LTCG on maturity</span>
      </div>
    </div>

    <!-- Asset 4: Liquid Buffer & Savings -->
    <div class="rounded-xl bg-surface-card-light p-space-md shadow-sm border border-border-subtle flex flex-col gap-2.5">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[22px]">payments</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-headline-sm text-body-lg text-text-primary-dark font-semibold">Liquid Emergency Reserves</span>
              <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-tag text-[10px] font-bold">11.9%</span>
            </div>
            <span class="font-body-sm text-body-sm text-text-secondary-dark">HDFC Salary & ICICI Liquid Fund</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="font-label-numeric-md text-label-numeric-md font-bold text-text-primary-dark">₹6,92,500</span>
          <span class="font-label-tag text-[11px] text-growth-deep font-semibold">6.2 months coverage</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-border-subtle text-body-sm text-[12px] text-text-secondary-dark">
        <span>Instant withdrawal capacity: 100%</span>
        <span class="text-growth-deep font-medium">Safe Surplus: ₹2.42L</span>
      </div>
    </div>
  </section>

  <!-- Rebalance Action Card -->
  <section class="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm border border-border-subtle">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-growth-deep text-[20px]">repartition</span>
        <h3 class="font-headline-sm text-body-lg font-semibold text-text-primary-dark">AI Portfolio Rebalancing</h3>
      </div>
      <span class="px-2 py-0.5 rounded-full bg-growth-tint text-growth-deep font-label-tag text-[10px] font-bold">3.6% Drift</span>
    </div>
    <p class="font-body-sm text-body-sm text-text-secondary-dark">
      Due to the recent mid-cap rally, equities (55.6%) are 3.6% above your strategic baseline of 52%. We recommend routing the next ₹35,000 surplus to debt funds to lock in risk-adjusted parity.
    </p>
    <div class="flex items-center justify-end gap-2 pt-1">
      <button class="px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-surface-card-dark-secondary transition-all active:scale-95 flex items-center gap-1.5 shadow-sm" id="rebalanceBtn">
        <span class="material-symbols-outlined text-[16px]">tune</span>
        <span>Apply Auto-Rebalance</span>
      </button>
    </div>
  </section>
</div>
`;

// Build the master index.html
const masterHtml = `<!DOCTYPE html>
<html class="light" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" name="viewport"/>
  <title>LifePlan AI - Financial Planner & Wealth Architecture</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-error": "#ffffff",
            "on-error-container": "#93000a",
            "growth-vibrant": "#10B981",
            "error": "#ba1a1a",
            "surface-canvas": "#F9F9FB",
            "surface-card-light": "#FFFFFF",
            "surface-container-high": "#dce9ff",
            "primary-fixed-dim": "#c2c6da",
            "on-surface-variant": "#46464c",
            "on-background": "#0b1c30",
            "surface-container-highest": "#d3e4fe",
            "surface": "#f8f9ff",
            "surface-container": "#e5eeff",
            "on-tertiary-container": "#7073ff",
            "surface-container-lowest": "#ffffff",
            "outline-variant": "#c6c6cc",
            "on-secondary": "#ffffff",
            "on-secondary-fixed": "#002113",
            "primary-fixed": "#dee2f6",
            "text-muted-dark": "#9CA3AF",
            "secondary-fixed": "#6ffbbe",
            "text-secondary-light": "#9CA3AF",
            "outline": "#76767d",
            "tertiary-container": "#07006c",
            "secondary-container": "#6cf8bb",
            "on-secondary-fixed-variant": "#005236",
            "inverse-primary": "#c2c6da",
            "text-secondary-dark": "#4B5563",
            "on-primary": "#ffffff",
            "surface-tint": "#595e6f",
            "inverse-on-surface": "#eaf1ff",
            "tertiary-fixed-dim": "#c0c1ff",
            "growth-deep": "#059669",
            "text-primary-dark": "#0A0F1D",
            "secondary-fixed-dim": "#4edea3",
            "growth-soft": "#34D399",
            "on-primary-container": "#7f8395",
            "secondary": "#006c49",
            "on-primary-fixed-variant": "#424657",
            "tertiary-fixed": "#e1e0ff",
            "on-surface": "#0b1c30",
            "tertiary": "#000000",
            "surface-container-low": "#eff4ff",
            "surface-variant": "#d3e4fe",
            "text-primary-light": "#F9FAFB",
            "on-primary-fixed": "#161b2a",
            "alert-amber": "#F59E0B",
            "growth-tint": "rgba(16, 185, 129, 0.08)",
            "border-subtle": "rgba(10, 15, 29, 0.06)",
            "surface-card-dark": "#0A0F1D",
            "primary-container": "#161b2a",
            "surface-card-dark-secondary": "#111827",
            "ai-violet": "#8B5CF6",
            "primary": "#000000",
            "on-secondary-container": "#00714d",
            "on-tertiary": "#ffffff",
            "border-dark-subtle": "rgba(255, 255, 255, 0.08)",
            "alert-amber-soft": "rgba(245, 158, 11, 0.10)",
            "background": "#f8f9ff",
            "inverse-surface": "#213145",
            "on-tertiary-fixed": "#07006c",
            "surface-muted": "#F3F4F6",
            "surface-bright": "#f8f9ff",
            "on-tertiary-fixed-variant": "#2f2ebe",
            "surface-dim": "#cbdbf5",
            "error-container": "#ffdad6"
          },
          borderRadius: {
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
          },
          spacing: {
            "gutter-lg": "2rem",
            "gutter-sm": "1rem",
            "margin-desktop": "3rem",
            "space-xl": "2.5rem",
            "space-lg": "1.5rem",
            "space-xs": "0.25rem",
            "gutter": "1.5rem",
            "margin": "2rem",
            "margin-mobile": "1rem",
            "space-sm": "0.5rem",
            "space-md": "1rem"
          },
          fontFamily: {
            "label-numeric-lg": ["JetBrains Mono"],
            "body-sm": ["Inter"],
            "body-md": ["Inter"],
            "body-xl": ["Inter"],
            "headline-sm": ["Plus Jakarta Sans"],
            "label-tag": ["Inter"],
            "display-hero-mobile": ["Plus Jakarta Sans"],
            "headline-xl-mobile": ["Plus Jakarta Sans"],
            "headline-md": ["Plus Jakarta Sans"],
            "headline-xl": ["Plus Jakarta Sans"],
            "display-hero": ["Plus Jakarta Sans"],
            "label-numeric-md": ["JetBrains Mono"],
            "headline-lg": ["Plus Jakarta Sans"],
            "body-lg": ["Inter"]
          }
        }
      }
    };
  </script>
  <style>
    @layer base {
      html, body {
        width: 100vw;
        margin: 0;
        padding: 0;
        background-color: #0b1120;
      }
      body {
        overscroll-behavior: none;
        -webkit-tap-highlight-color: transparent;
        font-family: 'Inter', sans-serif;
      }
      .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
      .pt-safe { padding-top: env(safe-area-inset-top, 0px); }
    }
    ::-webkit-scrollbar { display: none; }
    
    /* Device frame styling */
    .mobile-frame-container {
      width: 100%;
      max-width: 420px;
      height: 890px;
      margin: 1.5rem auto;
      border-radius: 44px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 12px #1e293b, 0 0 0 14px #0f172a;
      overflow: hidden;
      position: relative;
      background-color: #f8f9ff;
      display: flex;
      flex-direction: column;
    }
    .mobile-frame-container .app-main-viewport {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      position: relative;
    }
    
    /* Fluid responsive mode */
    .fluid-mode-container {
      width: 100%;
      max-width: 820px;
      min-height: 100vh;
      margin: 0 auto;
      border-radius: 0;
      box-shadow: none;
      background-color: #f8f9ff;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .fluid-mode-container .app-main-viewport {
      flex: 1;
      width: 100%;
    }

    /* Dynamic Island in mobile view */
    .dynamic-island {
      width: 120px;
      height: 28px;
      background-color: #000000;
      border-radius: 20px;
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      pointer-events: none;
    }
  </style>
</head>

<body class="min-h-screen text-on-surface antialiased flex flex-col selection:bg-growth-tint bg-slate-950">

  <!-- Top Global Toolbar / Switcher -->
  <header class="w-full bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50 shadow-md">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-growth-vibrant animate-pulse"></span>
        <span class="font-bold tracking-tight text-white font-headline-sm text-sm">LifePlan AI</span>
        <span class="bg-growth-deep/20 text-growth-soft px-2 py-0.5 rounded-full text-[10px] font-semibold">Stitch Project #326514280975318869</span>
      </div>

      <nav class="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-slate-700">
        <button onclick="switchTab('tab-pulse')" class="tab-pill-btn px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" data-for="tab-pulse">1. Pulse</button>
        <button onclick="switchTab('tab-goals')" class="tab-pill-btn px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" data-for="tab-goals">2. Goals</button>
        <button onclick="switchTab('tab-roadmap')" class="tab-pill-btn px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" data-for="tab-roadmap">3. Roadmap</button>
        <button onclick="switchTab('tab-advisor')" class="tab-pill-btn px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" data-for="tab-advisor">4. Advisor</button>
        <button onclick="switchTab('tab-money')" class="tab-pill-btn px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" data-for="tab-money">5. Assets</button>
      </nav>
    </div>

    <div class="flex items-center gap-2">
      <!-- Device mode toggle -->
      <div class="bg-slate-800 p-0.5 rounded-lg flex items-center border border-slate-700">
        <button id="toggleMobileBtn" class="px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 bg-growth-deep text-white shadow-sm transition-all">
          <span class="material-symbols-outlined text-[15px]">smartphone</span>
          <span class="hidden sm:inline">Mobile Frame</span>
        </button>
        <button id="toggleDesktopBtn" class="px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 text-slate-400 hover:text-white transition-all">
          <span class="material-symbols-outlined text-[15px]">desktop_windows</span>
          <span class="hidden sm:inline">Responsive</span>
        </button>
      </div>

      <!-- Raw Screens Dropdown / Link -->
      <div class="relative group">
        <button class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700 transition-all">
          <span class="material-symbols-outlined text-[15px]">folder_open</span>
          <span class="hidden sm:inline">Screens</span>
          <span class="material-symbols-outlined text-[14px]">arrow_drop_down</span>
        </button>
        <div class="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
          <div class="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Downloaded Screens</div>
          <a href="stitch_downloads/screen_1_financial_pulse_d1135e3d0d7d4bde95f62369efc429a5.html" target="_blank" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            <span>1. Financial Pulse</span>
            <span class="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
          </a>
          <a href="stitch_downloads/screen_2_life_goals_33ac66aea64f4d4a9d8e96bf98e33152.html" target="_blank" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            <span>2. Life Goals</span>
            <span class="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
          </a>
          <a href="stitch_downloads/screen_3_strategic_roadmap_1df98ab4e5c0478b9ea9d593d605309c.html" target="_blank" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            <span>3. Strategic Roadmap</span>
            <span class="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
          </a>
          <a href="stitch_downloads/screen_4_ai_advisor_400ddf6af30c4e97985d4218f262c9e0.html" target="_blank" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            <span>4. AI Advisor</span>
            <span class="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main App Shell Container (Phone Mockup / Responsive) -->
  <div id="appContainer" class="mobile-frame-container">
    
    <!-- iPhone Dynamic Island (visible in mobile frame mode) -->
    <div id="dynamicIsland" class="dynamic-island">
      <span class="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></span>
    </div>

    <!-- App Unified Top Header Bar -->
    <header class="w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe sticky top-0 shrink-0">
      <div class="h-16 px-gutter-sm flex items-center justify-between">
        <div class="flex items-center gap-space-sm cursor-pointer" onclick="switchTab('tab-pulse')">
          <img alt="LifePlan AI Brand Mark" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1UnNhzJRUHWDyISrKtm9UntmjL43n9YZ4FNZRQNIAKUtoQ08N9L98Kv9f2kBtqnaOI0-uu0Qx774IrX6iyqf3cp_UeGirdKf1k3ikzuZy4OQUlTgN0PqRwq6GrzKLjdYCxJT_fMrR4_QWALdYFAFBFWJCkJu64uiFkAC0-iwS0XUukPQWJ0h6qu0_GN2Pk_nik8QuI_WVdiTicP8rIznIPR5JFDJjRtfAN-kx91wCY756ouGfQSFaNJEg"/>
          <div class="flex flex-col">
            <span class="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">LifePlan AI</span>
            <span class="font-label-tag text-label-tag text-on-surface-variant font-medium uppercase tracking-wider mt-0.5" id="appHeaderSubtitle">Financial Pulse</span>
          </div>
        </div>
        <div class="flex items-center gap-space-xs">
          <button id="notificationCenterBtn" aria-label="Notifications" class="relative w-11 h-11 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-muted transition-colors active:scale-95">
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-growth-vibrant ring-2 ring-surface" id="notifPing"></span>
          </button>
          <button id="profileModalBtn" aria-label="User Profile" class="w-11 h-11 flex items-center justify-center rounded-full active:scale-95 transition-transform">
            <img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq_h77ALzHF7qQIzjBIwFxj7UScS-y402TaFM7ltgKYI4BG_AMjUfBi_1fJpBXV6J0rYsbvroCDSVDVH7NVXIYkMz1vHPqXJasP7WQ2e1pk8IdzXZF_FD-zfEjD1aNmvQitl2wxoNZM2sDB_YFdBFCH8e7UMnRLTxmX7ZxM7FpJ6bYySaGwTRp4VeAye547kdVrZTL2FhLW6dB13iLEY70AWiSEMMfiA2wGblr7HryX09Ln1_4CEs"/>
          </button>
        </div>
      </div>
    </header>

    <!-- App Viewport for Screen Tabs -->
    <div class="app-main-viewport">
      
      <!-- SCREEN 1: FINANCIAL PULSE -->
      <div id="tab-pulse" class="tab-view block w-full bg-surface pb-24 pt-2">
        ${s1.inner}
      </div>

      <!-- SCREEN 2: TARGET HORIZONS / GOALS -->
      <div id="tab-goals" class="tab-view hidden w-full bg-surface pb-24 pt-2">
        ${s2.inner}
      </div>

      <!-- SCREEN 3: STRATEGIC ROADMAP -->
      <div id="tab-roadmap" class="tab-view hidden w-full bg-surface pb-24 pt-2">
        ${s3.inner}
      </div>

      <!-- SCREEN 4: AI ADVISOR -->
      <div id="tab-advisor" class="tab-view hidden w-full bg-surface pb-24 pt-2">
        ${s4.inner}
      </div>

      <!-- SCREEN 5: MONEY & CONSOLIDATED ASSETS -->
      <div id="tab-money" class="tab-view hidden w-full bg-surface pb-24 pt-2">
        ${s5Inner}
      </div>

    </div>

    <!-- App Unified Bottom Navigation Bar -->
    <nav class="w-full z-40 pb-safe bg-surface/90 backdrop-blur-2xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] sticky bottom-0 border-t border-border-subtle shrink-0" id="appBottomNav">
      <div class="flex justify-around items-center h-16 px-space-xs max-w-lg mx-auto">
        <button class="nav-tab flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all active:scale-95 text-growth-deep" data-target="tab-pulse" data-title="Financial Pulse">
          <span class="material-symbols-outlined text-[24px]">ssid_chart</span>
          <span class="font-label-tag text-label-tag tracking-normal mt-0.5">Home</span>
        </button>
        <button class="nav-tab flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl text-on-surface-variant transition-all hover:text-on-surface active:scale-95" data-target="tab-goals" data-title="Financial Goals">
          <span class="material-symbols-outlined text-[24px]">flag</span>
          <span class="font-label-tag text-label-tag tracking-normal mt-0.5">Goals</span>
        </button>
        <button class="nav-tab flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl text-on-surface-variant transition-all hover:text-on-surface active:scale-95" data-target="tab-roadmap" data-title="Strategic Roadmap">
          <span class="material-symbols-outlined text-[24px]">timeline</span>
          <span class="font-label-tag text-label-tag tracking-normal mt-0.5">Roadmap</span>
        </button>
        <button class="nav-tab flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl text-on-surface-variant transition-all hover:text-on-surface active:scale-95" data-target="tab-advisor" data-title="AI Advisor">
          <div class="relative flex items-center justify-center">
            <span class="material-symbols-outlined text-[24px]">auto_awesome</span>
            <span class="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-ai-violet/15 text-ai-violet text-[9px] font-semibold tracking-tight">AI</span>
          </div>
          <span class="font-label-tag text-label-tag tracking-normal mt-0.5">Advisor</span>
        </button>
        <button class="nav-tab flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl text-on-surface-variant transition-all hover:text-on-surface active:scale-95" data-target="tab-money" data-title="Consolidated Assets">
          <span class="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span class="font-label-tag text-label-tag tracking-normal mt-0.5">Money</span>
        </button>
      </div>
    </nav>

  </div>

  <!-- Notification Center Drawer Modal -->
  <div id="notificationDrawer" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-end sm:items-center justify-center">
    <div class="w-full max-w-md bg-surface-card-light rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
      <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-growth-deep text-[22px]">notifications_active</span>
          <h3 class="font-headline-sm text-headline-sm text-text-primary-dark">Activity & Alerts</h3>
        </div>
        <button id="closeNotifBtn" class="w-8 h-8 rounded-full hover:bg-surface-muted flex items-center justify-center text-text-secondary-dark">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <div class="space-y-3">
        <div class="p-3 rounded-xl bg-growth-tint flex items-start gap-3">
          <span class="material-symbols-outlined text-growth-deep text-[20px] mt-0.5">check_circle</span>
          <div class="flex-1">
            <div class="flex justify-between items-baseline">
              <span class="font-body-sm font-semibold text-text-primary-dark">Monthly SIP Executed</span>
              <span class="text-[10px] text-text-secondary-dark font-label-tag">Today, 09:15 AM</span>
            </div>
            <p class="font-body-sm text-xs text-text-secondary-dark mt-0.5">₹67,200 invested across 4 active mutual fund schemes.</p>
          </div>
        </div>
        <div class="p-3 rounded-xl bg-surface-muted flex items-start gap-3">
          <span class="material-symbols-outlined text-ai-violet text-[20px] mt-0.5">auto_graph</span>
          <div class="flex-1">
            <div class="flex justify-between items-baseline">
              <span class="font-body-sm font-semibold text-text-primary-dark">All-Time High Net Worth</span>
              <span class="text-[10px] text-text-secondary-dark font-label-tag">Yesterday</span>
            </div>
            <p class="font-body-sm text-xs text-text-secondary-dark mt-0.5">Consolidated balance crossed ₹58,40,000 (+3.2% 30d CAGR).</p>
          </div>
        </div>
        <div class="p-3 rounded-xl bg-alert-amber-soft flex items-start gap-3">
          <span class="material-symbols-outlined text-alert-amber text-[20px] mt-0.5">warning</span>
          <div class="flex-1">
            <div class="flex justify-between items-baseline">
              <span class="font-body-sm font-semibold text-text-primary-dark">Villa Goal Inflation Drift</span>
              <span class="text-[10px] text-text-secondary-dark font-label-tag">3 days ago</span>
            </div>
            <p class="font-body-sm text-xs text-text-secondary-dark mt-0.5">₹4,800/mo pacing drift detected for Goa Villa 2028 horizon.</p>
          </div>
        </div>
      </div>
      <button onclick="document.getElementById('notificationDrawer').classList.add('hidden')" class="w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm">Mark All as Read</button>
    </div>
  </div>

  <!-- Profile Modal -->
  <div id="profileModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-end sm:items-center justify-center">
    <div class="w-full max-w-md bg-surface-card-light rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
      <div class="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div class="flex items-center gap-3">
          <img alt="Profile" class="w-12 h-12 rounded-full object-cover ring-2 ring-growth-vibrant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq_h77ALzHF7qQIzjBIwFxj7UScS-y402TaFM7ltgKYI4BG_AMjUfBi_1fJpBXV6J0rYsbvroCDSVDVH7NVXIYkMz1vHPqXJasP7WQ2e1pk8IdzXZF_FD-zfEjD1aNmvQitl2wxoNZM2sDB_YFdBFCH8e7UMnRLTxmX7ZxM7FpJ6bYySaGwTRp4VeAye547kdVrZTL2FhLW6dB13iLEY70AWiSEMMfiA2wGblr7HryX09Ln1_4CEs"/>
          <div>
            <h3 class="font-headline-sm text-headline-sm font-bold text-text-primary-dark">Aarav Joshi</h3>
            <span class="text-xs text-growth-deep font-semibold">Tier 1 Wealth Architect</span>
          </div>
        </div>
        <button id="closeProfileBtn" class="w-8 h-8 rounded-full hover:bg-surface-muted flex items-center justify-center text-text-secondary-dark">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-3 bg-surface-muted rounded-xl">
          <span class="text-text-secondary-dark block">Age / Horizon</span>
          <span class="font-bold text-sm text-text-primary-dark mt-0.5 block">29 Yrs (to 52)</span>
        </div>
        <div class="p-3 bg-surface-muted rounded-xl">
          <span class="text-text-secondary-dark block">Risk Mandate</span>
          <span class="font-bold text-sm text-growth-deep mt-0.5 block">Moderately High</span>
        </div>
        <div class="p-3 bg-surface-muted rounded-xl">
          <span class="text-text-secondary-dark block">Monthly Inflow</span>
          <span class="font-bold text-sm text-text-primary-dark mt-0.5 block">₹2,10,000</span>
        </div>
        <div class="p-3 bg-surface-muted rounded-xl">
          <span class="text-text-secondary-dark block">Target Freedom</span>
          <span class="font-bold text-sm text-ai-violet mt-0.5 block">₹7.82 Cr @ Age 52</span>
        </div>
      </div>
      <button onclick="document.getElementById('profileModal').classList.add('hidden')" class="w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm">Close Profile</button>
    </div>
  </div>

  <!-- Global Toast Notification -->
  <div id="globalToast" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 transition-opacity duration-300">
    <div class="px-4 py-2.5 rounded-full bg-surface-card-dark text-text-primary-light font-body-sm text-sm flex items-center gap-2 shadow-2xl border border-white/10">
      <span class="material-symbols-outlined text-[18px] text-growth-vibrant" id="globalToastIcon">check_circle</span>
      <span id="globalToastMsg">Action completed successfully</span>
    </div>
  </div>

  <!-- MASTER SCRIPTS: Tab Navigation, Device Mode, and Screen Interactions -->
  <script>
    // --- Global Tab Switching ---
    const tabViews = document.querySelectorAll('.tab-view');
    const navTabs = document.querySelectorAll('.nav-tab');
    const headerSubtitle = document.getElementById('appHeaderSubtitle');
    const pillBtns = document.querySelectorAll('.tab-pill-btn');

    function switchTab(targetId) {
      tabViews.forEach(v => {
        if (v.id === targetId) {
          v.classList.remove('hidden');
          v.classList.add('block');
        } else {
          v.classList.add('hidden');
          v.classList.remove('block');
        }
      });

      navTabs.forEach(t => {
        if (t.getAttribute('data-target') === targetId) {
          t.classList.remove('text-on-surface-variant');
          t.classList.add('text-growth-deep');
          if (headerSubtitle) {
            headerSubtitle.textContent = t.getAttribute('data-title');
          }
        } else {
          t.classList.add('text-on-surface-variant');
          t.classList.remove('text-growth-deep');
        }
      });

      pillBtns.forEach(p => {
        if (p.getAttribute('data-for') === targetId) {
          p.classList.add('bg-growth-deep', 'text-white');
          p.classList.remove('text-slate-300');
        } else {
          p.classList.remove('bg-growth-deep', 'text-white');
          p.classList.add('text-slate-300');
        }
      });

      // Scroll viewport to top
      const viewport = document.querySelector('.app-main-viewport');
      if (viewport) viewport.scrollTop = 0;
      window.scrollTo(0, 0);
    }

    navTabs.forEach(t => {
      t.addEventListener('click', () => {
        switchTab(t.getAttribute('data-target'));
      });
    });

    // --- Device Frame Switcher ---
    const appContainer = document.getElementById('appContainer');
    const toggleMobileBtn = document.getElementById('toggleMobileBtn');
    const toggleDesktopBtn = document.getElementById('toggleDesktopBtn');
    const dynamicIsland = document.getElementById('dynamicIsland');

    toggleMobileBtn.addEventListener('click', () => {
      appContainer.className = 'mobile-frame-container';
      dynamicIsland.style.display = 'flex';
      toggleMobileBtn.classList.add('bg-growth-deep', 'text-white');
      toggleMobileBtn.classList.remove('text-slate-400');
      toggleDesktopBtn.classList.remove('bg-growth-deep', 'text-white');
      toggleDesktopBtn.classList.add('text-slate-400');
    });

    toggleDesktopBtn.addEventListener('click', () => {
      appContainer.className = 'fluid-mode-container';
      dynamicIsland.style.display = 'none';
      toggleDesktopBtn.classList.add('bg-growth-deep', 'text-white');
      toggleDesktopBtn.classList.remove('text-slate-400');
      toggleMobileBtn.classList.remove('bg-growth-deep', 'text-white');
      toggleMobileBtn.classList.add('text-slate-400');
    });

    // --- Toast Helper ---
    function showToast(message, icon = 'check_circle') {
      const toast = document.getElementById('globalToast');
      const msgEl = document.getElementById('globalToastMsg');
      const iconEl = document.getElementById('globalToastIcon');
      msgEl.textContent = message;
      iconEl.textContent = icon;
      toast.classList.remove('opacity-0');
      setTimeout(() => {
        toast.classList.add('opacity-0');
      }, 2800);
    }

    // --- Notification & Profile Modals ---
    const notifBtn = document.getElementById('notificationCenterBtn');
    const notifDrawer = document.getElementById('notificationDrawer');
    const closeNotifBtn = document.getElementById('closeNotifBtn');
    const notifPing = document.getElementById('notifPing');

    notifBtn.addEventListener('click', () => {
      notifDrawer.classList.remove('hidden');
      if (notifPing) notifPing.remove();
    });
    closeNotifBtn.addEventListener('click', () => notifDrawer.classList.add('hidden'));

    const profileBtn = document.getElementById('profileModalBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    profileBtn.addEventListener('click', () => profileModal.classList.remove('hidden'));
    closeProfileBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

    // --- Auto-Allocate High Yield Button (Screen 1) ---
    document.querySelectorAll('button').forEach(btn => {
      if (btn.textContent.includes('Auto-Allocate')) {
        btn.addEventListener('click', () => {
          showToast('₹3.5L reallocated to 7.2% Liquid Fund. +₹25,200/yr secured!');
          btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">done</span> Allocated';
          btn.disabled = true;
          btn.classList.add('bg-growth-deep');
        });
      }
      if (btn.textContent.includes('View Fix')) {
        btn.addEventListener('click', () => {
          switchTab('tab-goals');
        });
      }
      if (btn.textContent.includes('See All (5)')) {
        btn.addEventListener('click', () => {
          switchTab('tab-goals');
        });
      }
    });

    // --- Rebalance Button (Screen 5) ---
    const rebalanceBtn = document.getElementById('rebalanceBtn');
    if (rebalanceBtn) {
      rebalanceBtn.addEventListener('click', () => {
        showToast('Strategic rebalance order created. SIPs adjusted for parity.');
        rebalanceBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">done</span> Rebalanced';
        rebalanceBtn.classList.remove('bg-primary');
        rebalanceBtn.classList.add('bg-growth-deep');
      });
    }

    const syncAccountsBtn = document.getElementById('syncAccountsBtn');
    if (syncAccountsBtn) {
      syncAccountsBtn.addEventListener('click', () => {
        showToast('Holdings synced with BSE StarMF & EPFO in 0.4s');
      });
    }
  </script>

  <!-- SCREEN 1 ORIGINAL SCRIPTS -->
  <script>
    ${s1.script}
  </script>

  <!-- SCREEN 2 ORIGINAL SCRIPTS + ENHANCED ADD GOAL LOGIC -->
  <script>
    ${s2.script}

    // Enhanced Goal Creator
    const customSaveGoal = document.getElementById('saveGoalBtn');
    if (customSaveGoal) {
      customSaveGoal.addEventListener('click', () => {
        const titleInput = document.querySelector('#createGoalModal input[placeholder*="Villa"]') || document.querySelector('#createGoalModal input[type="text"]');
        const targetInput = document.querySelector('#createGoalModal input[placeholder*="1,20,00,000"]') || document.querySelectorAll('#createGoalModal input[type="text"]')[1];
        
        const title = (titleInput && titleInput.value.trim()) || 'New Dream Venture';
        const target = (targetInput && targetInput.value.trim()) || '₹25,00,000';

        const goalsContainer = document.getElementById('goalsContainer');
        if (goalsContainer) {
          const newCard = document.createElement('div');
          newCard.className = 'goal-card rounded-xl bg-surface-card-light p-space-md shadow-sm transition-all duration-200 border border-growth-vibrant/30';
          newCard.setAttribute('data-category', 'lifestyle');
          newCard.innerHTML = \`
            <div class="flex items-start justify-between gap-space-sm mb-2">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-xl bg-growth-tint flex items-center justify-center text-growth-deep">
                  <span class="material-symbols-outlined text-[20px]">stars</span>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-label-tag text-label-tag uppercase tracking-wider text-on-surface-variant font-medium">Target: 2029</span>
                    <span class="px-2 py-0.5 rounded-full bg-growth-tint text-growth-deep font-label-tag text-[10px] font-bold">Just Created</span>
                  </div>
                  <h3 class="font-headline-sm text-body-lg font-semibold text-text-primary-dark">\${title}</h3>
                </div>
              </div>
              <span class="font-label-numeric-md text-label-numeric-md font-semibold text-growth-deep">\${target}</span>
            </div>
            <div class="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
              <div class="h-full bg-growth-vibrant rounded-full" style="width: 12%;"></div>
            </div>
            <div class="flex justify-between items-center text-body-sm text-[12px] text-text-secondary-dark mt-2">
              <span>SIP ₹15,000/mo active</span>
              <span>12% funded</span>
            </div>
          \`;
          goalsContainer.prepend(newCard);
          showToast(\`Goal "\${title}" initialized and indexed into roadmap!\`);
        }
      });
    }
  </script>

  <!-- SCREEN 3 ORIGINAL SCRIPTS -->
  <script>
    ${s3.script}
  </script>

  <!-- SCREEN 4 ORIGINAL SCRIPTS + LIVE CONVERSATIONAL AI & SPEECH SYNTHESIS -->
  <script>
    ${s4.script}

    (function() {
      const chatForm = document.getElementById('chatForm');
      const queryInput = document.getElementById('queryInput');
      const conversationContainer = queryInput ? queryInput.closest('.tab-view') || document.getElementById('tab-advisor') : null;
      const soundBtn = document.getElementById('soundToggleBtn');
      let speechEnabled = false;

      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          speechEnabled = !speechEnabled;
          showToast(speechEnabled ? 'Voice narration enabled' : 'Voice narration muted', 'volume_up');
        });
      }

      function speakText(text) {
        if (!speechEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      // Predefined AI knowledge base responses
      const responses = [
        {
          triggers: ['1.2 cr', 'home', 'house', 'apartment', 'villa', 'afford'],
          verdict: 'Feasible with minor ₹4,500/mo SIP adjustment.',
          confidence: '98.2% Confidence',
          badgeClass: 'bg-growth-tint text-growth-deep',
          downPayment: '₹24,00,000 (20%)',
          cashBuffer: '₹28,50,000 (Liquid)',
          emi: '₹84,200/mo (at 8.65% ROI)',
          speech: 'Yes Aarav, you can comfortably afford the ₹1.2 Crore property by late 2028. Your liquidity cushions the down payment safely without liquidating core equity holdings.'
        },
        {
          triggers: ['sabbatical', 'career pause', 'break', 'leave'],
          verdict: 'Safe for up to 9 months without depleting investments.',
          confidence: '94.6% Confidence',
          badgeClass: 'bg-growth-tint text-growth-deep',
          downPayment: '₹8.5L Buffer cost',
          cashBuffer: '6.2 Mos emergency cushion',
          emi: 'Retirement shifts +7 months',
          speech: 'A 6-month career sabbatical is fully sustainable. Your emergency reserves protect baseline expenses and your retirement freedom date shifts by only 7 months.'
        },
        {
          triggers: ['idle cash', '80k', 'tax', 'nps', 'save'],
          verdict: 'Reallocate ₹80,000 into NPS Tier 1 & Arbitrage Fund.',
          confidence: '99.1% Confidence',
          badgeClass: 'bg-growth-tint text-growth-deep',
          downPayment: '₹18,400 immediate tax savings',
          cashBuffer: '7.4% Expected return',
          emi: 'Zero lock-in on surplus',
          speech: 'Deploying eighty thousand rupees into NPS under section 80CCD saves eighteen thousand four hundred rupees in taxes while enhancing compound growth.'
        },
        {
          triggers: ['prepay', 'prepayment', 'loan', 'sip', 'compare'],
          verdict: 'Equities CAGR (12%) outpaces Loan Interest (8.6%). Continue SIPs.',
          confidence: '91.8% Confidence',
          badgeClass: 'bg-ai-violet/15 text-ai-violet',
          downPayment: '+₹14.8L Net Wealth Advantage',
          cashBuffer: 'Liquid flexibility retained',
          emi: 'Tax rebate on interest',
          speech: 'Our simulation confirms that continuing your equity SIP yields fourteen point eight lakh rupees higher net worth over seven years than prepaying the low-rate loan.'
        }
      ];

      function generateReply(userQuery) {
        const q = userQuery.toLowerCase();
        let match = responses.find(r => r.triggers.some(t => q.includes(t)));
        if (!match) {
          match = {
            verdict: 'Analyzed portfolio cashflow: Highly sustainable within active roadmap.',
            confidence: '96.4% Algorithmic Confidence',
            badgeClass: 'bg-growth-tint text-growth-deep',
            downPayment: 'Surplus: ₹67,200/mo',
            cashBuffer: '₹58.4L Net Worth',
            emi: 'Retirement on track: Age 52',
            speech: 'Based on your fifty-eight lakh consolidated net worth and current monthly surplus, this decision maintains full alignment with your goal timeline.'
          };
        }

        // Find the conversation section
        const flowSection = document.querySelector('#tab-advisor section.flex.flex-col.gap-space-md');
        if (!flowSection) return;

        // Add user bubble
        const userDiv = document.createElement('div');
        userDiv.className = 'flex items-start justify-end gap-space-sm pl-8 animate-in fade-in duration-300';
        userDiv.innerHTML = \`
          <div class="flex flex-col items-end">
            <div class="bg-surface-card-dark text-text-primary-light rounded-2xl rounded-tr-xs p-space-md shadow-md">
              <p class="font-body-md text-body-md leading-relaxed">\${userQuery}</p>
            </div>
            <div class="flex items-center gap-1 mt-1 text-on-surface-variant font-label-tag text-label-tag">
              <span>Just now</span>
              <span class="material-symbols-outlined text-[14px] text-growth-deep">done_all</span>
            </div>
          </div>
          <div class="w-7 h-7 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center text-on-surface font-headline-sm text-[12px] font-bold">AJ</div>
        \`;
        flowSection.appendChild(userDiv);

        // Add thinking indicator
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'flex items-center gap-2 text-ai-violet text-xs p-3 font-medium animate-pulse';
        thinkingDiv.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Computing Monte Carlo portfolio trajectories...';
        flowSection.appendChild(thinkingDiv);

        setTimeout(() => {
          thinkingDiv.remove();

          // Add AI reply card
          const aiDiv = document.createElement('div');
          aiDiv.className = 'flex items-start gap-space-sm pr-1 animate-in fade-in duration-500';
          aiDiv.innerHTML = \`
            <div class="w-8 h-8 rounded-full bg-ai-violet/15 flex-shrink-0 flex items-center justify-center text-ai-violet shadow-sm">
              <span class="material-symbols-outlined text-[19px]">auto_awesome</span>
            </div>
            <div class="flex flex-col gap-space-sm flex-1 min-w-0">
              <div class="bg-surface-card-light rounded-2xl rounded-tl-xs p-space-md shadow-sm flex flex-col gap-space-sm border border-border-subtle">
                <div class="flex items-center justify-between pb-1">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded-full \${match.badgeClass} font-label-tag text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">check_circle</span> \${match.confidence}
                    </span>
                  </div>
                  <button class="text-on-surface-variant hover:text-on-surface" onclick="showToast('Copied analysis to clipboard!')" title="Copy response">
                    <span class="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>
                <div class="bg-surface-container-low rounded-xl p-space-sm flex items-start gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-growth-vibrant text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <h3 class="font-headline-sm text-body-lg text-on-surface leading-tight font-semibold">\${match.verdict}</h3>
                    <p class="font-body-sm text-xs text-on-surface-variant mt-1">Based on Aarav's ₹58.4L portfolio & ₹2.1L/mo cash inflows.</p>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-1 text-xs">
                  <div class="bg-surface-muted rounded-xl p-2.5 flex flex-col">
                    <span class="text-text-secondary-dark text-[10px]">Impact</span>
                    <span class="font-bold text-on-surface mt-0.5">\${match.downPayment}</span>
                  </div>
                  <div class="bg-surface-muted rounded-xl p-2.5 flex flex-col">
                    <span class="text-text-secondary-dark text-[10px]">Buffer</span>
                    <span class="font-bold text-growth-deep mt-0.5">\${match.cashBuffer}</span>
                  </div>
                  <div class="bg-surface-muted rounded-xl p-2.5 flex flex-col">
                    <span class="text-text-secondary-dark text-[10px]">Roadmap Shift</span>
                    <span class="font-bold text-on-surface mt-0.5">\${match.emi}</span>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
                  <button onclick="switchTab('tab-roadmap')" class="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-slate-800 transition-all flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">timeline</span> Simulate in Roadmap
                  </button>
                  <button onclick="showToast('Goal drafted from AI simulation!')" class="px-3 py-1.5 rounded-xl bg-growth-tint text-growth-deep text-xs font-semibold hover:bg-growth-vibrant/20 transition-all flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">add_circle</span> Add to Goals
                  </button>
                </div>
              </div>
            </div>
          \`;
          flowSection.appendChild(aiDiv);
          speakText(match.speech);

          // Scroll to the new message
          const viewport = document.querySelector('.app-main-viewport');
          if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
          }
        }, 800);
      }

      if (chatForm && queryInput) {
        chatForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const query = queryInput.value.trim();
          if (!query) return;
          queryInput.value = '';
          generateReply(query);
        });
      }

      // Hook up Quick Scenario Pills to generateReply directly
      document.querySelectorAll('.scenario-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const prompt = pill.getAttribute('data-prompt');
          if (prompt) {
            generateReply(prompt);
          }
        });
      });

      // Voice Mic Simulation
      const micBtn = document.getElementById('micBtn');
      if (micBtn) {
        micBtn.addEventListener('click', () => {
          if ('webkitSpeechRecognition' in window) {
            try {
              const recognition = new webkitSpeechRecognition();
              recognition.lang = 'en-IN';
              recognition.start();
              micBtn.classList.add('text-error', 'animate-pulse');
              queryInput.placeholder = 'Listening... Speak your financial query';
              recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                queryInput.value = speechResult;
                generateReply(speechResult);
                micBtn.classList.remove('text-error', 'animate-pulse');
                queryInput.placeholder = 'Ask about goals, tax, EMI, portfolio...';
              };
              recognition.onerror = () => {
                micBtn.classList.remove('text-error', 'animate-pulse');
                queryInput.placeholder = 'Ask about goals, tax, EMI, portfolio...';
              };
              return;
            } catch(e) {}
          }
          // Fallback simulation
          queryInput.value = 'Can I afford a ₹1.2 Cr home by 2028?';
          generateReply(queryInput.value);
        });
      }

      // Download PDF / Executive Summary
      const downloadBtn = document.getElementById('downloadPdfBtn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          showToast('Preparing LifePlan AI Wealth Executive Summary...');
          setTimeout(() => {
            window.print();
          }, 600);
        });
      }
    })();
  </script>
</body>
</html>
`;

// Write the master index.html
fs.writeFileSync('index.html', masterHtml, 'utf8');
console.log('Successfully generated index.html! Size:', fs.statSync('index.html').size, 'bytes');

// Also create screens/ folder with updated relative cross-links
const screensDir = 'screens';
if (!fs.existsSync(screensDir)) fs.mkdirSync(screensDir);

function updateCrossLinks(html, currentIdx) {
  return html
    .replace(/data-path="financial-pulse"[^>]*href="#"/g, 'data-path="financial-pulse" href="1_financial_pulse.html"')
    .replace(/data-path="financial-goals"[^>]*href="#"/g, 'data-path="financial-goals" href="2_life_goals.html"')
    .replace(/data-path="strategic-roadmap"[^>]*href="#"/g, 'data-path="strategic-roadmap" href="3_strategic_roadmap.html"')
    .replace(/data-path="ai-advisor"[^>]*href="#"/g, 'data-path="ai-advisor" href="4_ai_advisor.html"')
    .replace(/data-path="money-and-net-worth"[^>]*href="#"/g, 'data-path="money-and-net-worth" href="../index.html"');
}

fs.writeFileSync(path.join(screensDir, '1_financial_pulse.html'), updateCrossLinks(s1Html, 1), 'utf8');
fs.writeFileSync(path.join(screensDir, '2_life_goals.html'), updateCrossLinks(s2Html, 2), 'utf8');
fs.writeFileSync(path.join(screensDir, '3_strategic_roadmap.html'), updateCrossLinks(s3Html, 3), 'utf8');
fs.writeFileSync(path.join(screensDir, '4_ai_advisor.html'), updateCrossLinks(s4Html, 4), 'utf8');

console.log('Screens updated in screens/ directory.');

// Also copy screenshot images into screens/
fs.copyFileSync(
  'stitch_downloads/screen_1_financial_pulse_d1135e3d0d7d4bde95f62369efc429a5.png',
  path.join(screensDir, 'screen_1_financial_pulse.png')
);
fs.copyFileSync(
  'stitch_downloads/screen_2_life_goals_33ac66aea64f4d4a9d8e96bf98e33152.png',
  path.join(screensDir, 'screen_2_life_goals.png')
);
fs.copyFileSync(
  'stitch_downloads/screen_3_strategic_roadmap_1df98ab4e5c0478b9ea9d593d605309c.png',
  path.join(screensDir, 'screen_3_strategic_roadmap.png')
);
fs.copyFileSync(
  'stitch_downloads/screen_4_ai_advisor_400ddf6af30c4e97985d4218f262c9e0.png',
  path.join(screensDir, 'screen_4_ai_advisor.png')
);

console.log('All screens and assets created and linked successfully!');
