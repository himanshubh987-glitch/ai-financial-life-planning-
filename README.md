# LifePlan AI Financial Planner 📊

A wealth intelligence and financial planning platform built with modern design principles (Editorial Minimalism + Tonal Glassmorphism), synthesized from Google Stitch Project `#326514280975318869`.

---

## 🚀 Quick Start

The app is powered by a zero-dependency Node.js HTTP server.

```bash
# Start the local server
node server.js
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📱 App Highlights & Architecture

The application brings together 4 core Stitch screens into a unified Single Page Application (`index.html`), complete with a dedicated **Money & Asset Breakdown** view:

### 1. Financial Pulse (Home) — Screen `d1135e3d0d7d4bde95f62369efc429a5`
- **Consolidated Net Worth Card**: Dynamic privacy mask toggle (`••••••••` ↔ `₹58,42,500`).
- **Interactive Sparkline**: Real-time timeframe selector (`1M`, `6M`, `1Y`, `ALL`) that morphs the SVG compounding curve with glow gradients.
- **Financial Vitality Score**: Gauge ring showing 84/100 health score with diagnostic cohort benchmarks (Top 8%).
- **Monthly Cashflow & Surplus**: Interactive allocation breakdown (Fixed Needs 48%, Lifestyle 20%, Wealth 32%).
- **Smart Actions**: One-click "Auto-Allocate" for liquid fund optimization (+₹25,200/yr).
- **Interactive Checklist**: Dynamic task completion counter with strike-through states and celebratory toasts.

### 2. Target Horizons (Goals) — Screen `33ac66aea64f4d4a9d8e96bf98e33152`
- **Monte Carlo Probability Engine**: 88% confidence visual indicator based on 10,000 simulations.
- **Category Filter Tabs**: Filter between *All*, *Lifestyle*, *Essential*, and *Wealth & Legacy*.
- **Interactive Trade-Off Simulator**: Move the monthly diversion slider (₹0 to ₹25,000/mo) to recalculate in real-time how many months earlier target goals are funded.
- **New Goal Creator**: Interactive modal form that adds new life targets directly into the active portfolio.

### 3. Strategic Roadmap — Screen `1df98ab4e5c0478b9ea9d593d605309c`
- **Trajectory Projection**: Nominal vs. Real (6% Inflation Discount) switcher.
- **Milestone Navigation**: Interactive age anchors (Age 29, 33, 38, 45, 52 FIRE, 75 Legacy) with animated progress bar.
- **Macro Scenarios**: One-tap simulation of *Base Plan*, *Conservative*, *High Growth*, and *1-Yr Sabbatical*.
- **Interactive Levers**: Live sliders for Monthly SIP, Retirement Age, and Equities CAGR that dynamically re-compute the 31-year multi-year compounding curve and SVG path.

### 4. AI Financial Advisor — Screen `400ddf6af30c4e97985d4218f262c9e0`
- **Live Conversational Copilot**: Ask any question about property affordability, career sabbaticals, tax optimization, and SIP vs. loan prepayment.
- **Dynamic Scenario Responses**: Generates comprehensive feasibility verdicts, impact grids, and actionable buttons.
- **Speech Synthesis (Voice Narration)**: Listen to the AI advisor's recommendations spoken aloud.
- **Voice Mic Input**: Speak your financial queries directly into the app.
- **Executive Summary Export**: One-click formatted PDF export.

### 5. Consolidated Assets (Money Tab)
- Real-time NAV breakdown across Equities (55.6%), EPF & Debt (24.3%), Sovereign Gold Bonds (8.2%), and Liquid Reserves (11.9%).
- AI portfolio rebalancing trigger with drift detection.

---

## 📂 Downloaded Stitch Assets

All screens and screenshots were downloaded via `curl -L` and organized into dedicated folders:

| # | Screen Name | Screen ID | Screenshot | Standalone HTML |
|---|-------------|-----------|------------|-----------------|
| 1 | **Home - Financial Pulse** | `d1135e3d0d7d4bde95f62369efc429a5` | [`screen_1.png`](screens/screen_1_financial_pulse.png) | [`1_financial_pulse.html`](screens/1_financial_pulse.html) |
| 2 | **Life Goals & Planning** | `33ac66aea64f4d4a9d8e96bf98e33152` | [`screen_2.png`](screens/screen_2_life_goals.png) | [`2_life_goals.html`](screens/2_life_goals.html) |
| 3 | **Strategic Life Roadmap** | `1df98ab4e5c0478b9ea9d593d605309c` | [`screen_3.png`](screens/screen_3_strategic_roadmap.png) | [`3_strategic_roadmap.html`](screens/3_strategic_roadmap.html) |
| 4 | **AI Financial Advisor** | `400ddf6af30c4e97985d4218f262c9e0` | [`screen_4.png`](screens/screen_4_ai_advisor.png) | [`4_ai_advisor.html`](screens/4_ai_advisor.html) |

---

## 🎨 Dual Viewport Modes

In `index.html`, toggle seamlessly between:
- **📱 Mobile App View**: Renders inside a titanium iPhone 16 Pro mockup with Dynamic Island, rounded glass borders, and internal momentum scrolling.
- **💻 Responsive Desktop View**: Fluid layout that expands gracefully across laptop and desktop screens.
