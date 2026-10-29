# ReLife Passport 🌱📱

> **Repair & Reuse Connect: Empowering circular electronics through transparent economics, benchmark pricing, and zero-risk data safety certificates.**

Built for the **Repair and Reuse Connect** Hackathon challenge.

---

## 🎯 Problem Statement
> *"How might we design a solution that connects users to repair, refurbishment, donation, or resale options and builds their confidence through cost estimates and data-safety guidance?"*

Every year, millions of smartphones and laptops in India are discarded prematurely into landfills due to:
1. **Information Asymmetry**: Users don't know whether fixing a device is economically viable compared to buying new.
2. **Fear of Overcharging**: Lack of benchmark pricing at local unauthorized repair centers.
3. **Data Security Anxiety**: Consumers hoard broken devices at home out of fear that personal photos, banking apps (UPI), or credentials will be stolen during repair or resale.

**ReLife Passport** bridges this trust deficit with an algorithmic 5-step circular lifecycle passport that delivers transparent repair benchmarking, customized data-sanitization checklists with cryptographically sealed handover receipts, and direct connection to vetted local circular partners.

---

## 🌟 Core Features & 5-Screen Flow

1. **Screen 1: Device Diagnosis (Problem Input)**
   - Category toggles: Smartphone 📱 / Laptop 💻
   - Dynamic model selector (15 cataloged models with realistic Indian market MSRPs)
   - Device age slider (0 to 10 years)
   - Visual symptom cards (Cracked screen, Battery drains, Won't charge, Slow performance, Water damage)
   - Power state toggle ("Does device still turn on?")
   - Instant **⚡ Try Demo Example** button pre-filling the hackathon benchmark scenario (Redmi Note 11, Battery issue, 3 years old, working)

2. **Screen 2: Second-Life Evaluation (Algorithmic Decision)**
   - Animated circular **Second-Life Score (0–100)** with dynamic color grading (Green = Repair, Amber = Refurbish/Resell, Red = Recycle)
   - Big recommendation badge with clear reasoning:
     - **REPAIR**: Economical repair under 40% of replacement cost.
     - **SELL / REFURBISH**: Viable secondary market resale demand.
     - **DONATE**: Digital literacy outreach for schools and community youth.
     - **RECYCLE**: End-of-life recovery of precious metals with zero landfill.

3. **Screen 3: Economic & Environmental Impact (Cost Card)**
   - Side-by-side comparison: **Repair Cost vs New Replacement Price**
   - Largest text on screen: **"You save ₹12,599"** with lively count-up animation
   - Ecological metrics: **CO₂ avoided (kg)** and **E-waste avoided (kg)**
   - **Repair Price Fairness Meter**: Visual horizontal bar indicating the fair market range and the consumer protection guidance note: *"Don't pay more than ₹X at local shops."*

4. **Screen 4: Zero-Data-Risk Handover Wizard**
   - Tailored 6-step checklist adapting dynamically to **Android**, **Apple iOS**, or **Windows**:
     1. Cloud backup (Google Drive / iCloud / OneDrive)
     2. Account decoupling & Factory Reset Protection (FRP) release
     3. UPI / Net-Banking app authorization removal
     4. SIM tray & MicroSD card extraction
     5. Cryptographic storage encryption verification (FBE / Secure Enclave / BitLocker)
     6. Full factory reset / Secure cryptographic wipe
   - Interactive accordion with step-by-step how-to guide and security rationale
   - **Data-Safe Certificate (Sealed Handover Receipt)**: Generated upon completing all 6 steps, featuring a unique reference (`RLP-2026-XXXX`), timestamp, device model, and scannable QR verification code.

5. **Screen 5: Verified Local Partners & Impact Dashboard**
   - 10 mock circular providers situated around **Chengalpattu, Tambaram, Guindy, and Chennai**
   - Vetted trust badges: *Verified Partner*, *Data-Safe Handover*, *90-Day Warranty*, *CPCB Authorized*
   - Real-world community donation needs (e.g., *"Needs 8 smartphones for Class 10 government school students"*)
   - Accessible **Booking Modal** with service mode (Direct Drop-off / Doorstep Pickup), date picker, and time slot selection
   - **Live Impact Dashboard**: Tracks cumulative devices diverted, rupees saved, e-waste prevented, and CO₂ emissions eliminated. Persisted in `localStorage` across user sessions.

---

## 🌐 Bilingual Support (English & தமிழ்)
ReLife Passport includes full English and Tamil localization:
- Tap the **🌐 தமிழ் / English** button in the header at any point.
- All screen titles, form controls, symptoms, advice, checklist steps, and impact metrics translate instantly with zero page reloads.

---

## 🛠️ Architecture & Tech Stack

- **Zero-Dependency Core**: Pure Semantic HTML5, Vanilla CSS3, Vanilla ES6+ JavaScript.
- **No Frameworks / No Build Steps / No Bundlers**: Loads instantly in any standard browser directly from `index.html` or over static CDNs.
- **Mobile-First Responsive Layout**: Centered 420px mobile viewport on desktop with subtle shadow frame; full-bleed native phone experience on mobile devices.
- **Clean URLs & Static Ready**: Configured with `vercel.json` for one-click static hosting.

### File Structure
```
├── index.html       # Single-page application structure & semantic layout
├── style.css        # Modern eco-theme design system (#1B8A5A), variables & micro-animations
├── app.js           # Decision engine, 5-screen flow controller, event handling
├── data.js          # 15 devices, 10 Tamil Nadu providers, OS checklists, EN/TA translations
├── vercel.json      # Static deployment configuration (cleanUrls: true)
├── .gitignore       # Standard git ignore rules
└── README.md        # Comprehensive documentation & 3-minute demo script
```

---

## 🚀 How to Run Locally

### Option 1: Direct File Open (Zero Install)
Simply double-click `index.html` in your file explorer, or open it in Google Chrome, Microsoft Edge, Firefox, or Safari:
```text
file:///c:/path/to/E-WASTE%20COLLECTION/index.html
```

### Option 2: Local HTTP Server (Optional)
If you prefer testing over a local server:
```bash
# Using Python 3
python -m http.server 3000

# Or using Node npx
npx serve .
```
Then visit `http://localhost:3000`.

---

## ☁️ Deploy on Vercel

ReLife Passport is pre-configured for instant zero-configuration static deployment on Vercel:

1. Push this repository to GitHub (main branch).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import your **ReLife Passport** GitHub repository.
5. In the Project Configuration:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (No build step needed)
   - **Output Directory**: Leave empty / `./` (Root directory)
6. Click **Deploy**. Your static web application will be live globally within seconds!

---

## ⏱️ 3-Minute Hackathon Demo Script

| Time | Screen / Action | Talking Points & What to Demonstrate |
| :--- | :--- | :--- |
| **0:00 - 0:35** | **Problem Statement & Screen 1 (Diagnosis)** | *"Judges, over 80% of electronics in India are discarded prematurely because consumers fear being overcharged or having their personal data compromised. ReLife Passport solves this. Notice the mobile-first design and Tamil language toggle. Let's tap '⚡ Try Demo Example': it automatically selects a Redmi Note 11 with 3 years of usage, draining battery, and still powering on."* |
| **0:35 - 1:15** | **Screen 2 & 3 (Score & Economics)** | *"Click 'Calculate Second-Life Viability'. Our algorithm scores this device at 82/100—high viability—and recommends REPAIR. Moving to Economics, the screen shows the massive highlight: 'You save ₹12,599' compared to buying a replacement at ₹13,999. Below, notice the Repair Price Fairness Meter. It tells the user: 'Fair range is ₹1,100 to ₹1,800. Do not pay more than ₹1,800 at local shops.' This eliminates price exploitation."* |
| **1:15 - 2:05** | **Screen 4 (Zero-Data-Risk Wizard)** | *"Now the biggest user barrier: Data Security. The wizard detects this is an Android device and prescribes 6 actionable steps: cloud backup, removing Google FRP accounts, UPI decoupling, and cryptographic wipe. As we tick off the items, once 6/6 are verified, ReLife Passport issues a tamper-evident 'Data-Safe Certificate' with unique ID RLP-2026-XXXX and a scannable QR verification code."* |
| **2:05 - 2:45** | **Screen 5 (Local Connect & Booking)** | *"With certificate in hand, the user connects to verified circular partners in Chengalpattu and Chennai. We see EcoFix Tech Lab (1.2 km away) with 'Data-Safe Handover' and '90-Day Warranty' badges. Notice NGO cards highlighting urgent community needs like 8 phones for Class 10 students. Let's click 'Book / Schedule Handover', pick tomorrow's morning slot, and confirm. We get Booking ID BK-CHEN-XXXX."* |
| **2:45 - 3:00** | **Impact Dashboard & Wrap-up** | *"Every completed flow instantly updates our Community Impact Dashboard: devices diverted, rupees saved, kg of toxic e-waste avoided, and CO₂ prevented. ReLife Passport turns e-waste from a disposal dilemma into an empowering, circular economic reality."* |

---

## 📈 Impact Measures

- **Share of Devices Diverted from Disposal**: Directly drives consumers toward verified repair and school donation before considering recycling.
- **Cost Saved for the User**: Quantified transparently in Rupees (`₹`) against manufacturer MSRP, backed by localized price-fairness boundaries.
- **E-Waste & Carbon Abatement**: Quantified in kilograms of CO₂ avoided and kilograms of electronic toxins diverted from unorganized scrap burning.

---

## 📄 License
MIT License. Built for open circular economy innovation.
