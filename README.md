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

---

## 🧩 Component Rescue Matcher (New Circular Feature)

One person's unusable smartphone or laptop often contains a perfectly functional RAM module, SSD, display panel, or charger that another repair urgently needs. The **Component Rescue Matcher** is a peer-to-peer circular parts pool connecting device owners and donor hardware with local repair technicians and workshops.

### Key Capabilities
1. **Three Seamless Entry Points**:
   - **Header Navigation**: Dedicated `🧩 Component Rescue` button accessible at any stage.
   - **Result Screen Callout**: When the recommendation engine flags a device as `DONATE` or `RECYCLE`, a prominent card guides users: *"Your device may contain reusable parts. List them on Component Rescue"*, pre-filling the donor form with the exact device model.
   - **Connect Screen Teaser**: A live ticker strip displaying the count of verified parts available nearby.

2. **Tab 1: "I Have Parts" (Donor / Seller Listing)**
   - 10 component categories: RAM, SSD, HDD, Screen/Display, Battery, Charger, Motherboard, Keyboard, Camera, Speaker.
   - Condition classification: *Tested - Working (100% Functional)* vs. *Tested - Minor Cosmetic Wear*.
   - Tested badge verification and optional physical photo upload with live data URL preview.
   - Flexible pricing: **Free (Community Donation)** or **Fixed Price (₹)**.
   - **Mandatory Safety Gates**:
     - **Lithium Battery Gate**: Proactively checks for battery swelling or physical damage. If swelling/damage is indicated, **the listing is strictly blocked** and the user is redirected to certified recyclers. If intact, all **4 mandatory safety declarations** must be verified before submission.
     - **Storage Data Gate**: For SSD and HDD listings, requires explicit confirmation that all data has been cryptographically erased.
     - **Anti-Static & ESD Handling**: Contextual handling advice per component (grounding, insulated packaging, power disconnection).

3. **Tab 2: "I Need Parts" (Repairer Request & Matching Engine)**
   - Quick-select chips from registered local workshops (e.g., *QuickFix Mobiles*, *EcoFix Tech Lab*).
   - Urgency preferences: *Today*, *This week*, *Flexible*.
   - **Algorithmic Matching Engine (`matchComponents`)**:
     - Evaluates donor listings against requests using a weighted 100-point algorithm:
       - **Spec Similarity**: Exact keyword match = 40 pts, Partial match = 20 pts
       - **Budget Compliance**: Within budget or free = 25 pts (over-budget listings excluded)
       - **Geographic Proximity**: Same area = 20 pts, Within 5 km = 15 pts
       - **Hardware Condition**: Tested - Working = 10 pts, Minor wear = 5 pts
       - **Verified Seller/Donor**: 5 pts
     - Returns top 3 candidate matches sorted by score, displaying Match % (e.g. `95% Match`), compatibility reasons, and distance.
   - **One-Click Part Request Modal**: Generates a tamper-evident reservation code (`RCM-2026-XXXX`) with scheduled handover timing and safety packaging instructions.

4. **Tab 3: "Browse Rescue Pool"**
   - Real-time search by keyword, spec, area, or device model.
   - Category filter chips (RAM, SSD, Display, Battery, Charger, etc.).
   - All user listings persist in `localStorage` alongside 12 pre-seeded Chennai/Chengalpattu listings.

5. **Extended Community Impact Metrics**:
   - **Parts Rescued**: Live count of individual modules saved from scrap burning.
   - **Rupees Saved by Repairers**: Calculated as benchmark new-part MSRP minus rescued listing price.
   - **Additional E-Waste Diverted**: Increments with every confirmed part match request.

---

## 📍 E-Waste Journey Tracker (Circular Chain of Custody)

Every old device receives a unique auto-incremented Circular ID (e.g. `EW-1001`, `EW-1005`) and an optical QR code. The device's entire lifecycle is tracked through **5 verifiable stages**:

$$\text{Registered} \longrightarrow \text{Collected} \longrightarrow \text{Inspected} \longrightarrow \text{Outcome Recorded} \longrightarrow \text{Completed - Verified}$$

Only audit-verified outcomes count toward the **Sustainability Dashboard**, preserving absolute data integrity.

### Role-by-Role Overview (Demo Roles)
> *Note: Production systems would use cryptographic multi-party authorization; demo mode features an instant role switcher.*

1. **👤 Device Owner**:
   - Registers device with hardware condition, problem description, locality, and mandatory data wipe certification.
   - Generates a **Circular Passport & QR Code**.
   - Views downloadable/printable asset labels for physical device tagging.
   - Schedules handover via **Direct Drop-off** at verified circular centers or **Doorstep Pickup**.
   - Tracks real-time status in the **"My Devices"** tab with a 5-segment progress bar.

2. **🚚 Collection Partner**:
   - Views the real-time queue of pending pickups.
   - Scans or enters the device ID (simulated camera viewfinder or manual input).
   - Records collector credentials, organization, timestamp, and location.
   - Advances status to **Collected & In Transit** with an automated audit log entry.

3. **🔬 Repair & Inspection Partner**:
   - Conducts physical hardware diagnostics: Power & Boot Test (Boots into BIOS/OS vs. Dead).
   - 8-Module Component Checklist: Screen, Battery, RAM, SSD/Storage, Motherboard, Power Port, Keyboard, Camera.
   - **Rule-Based Circular Pathway Auto-Suggestion**:
     - *Boots + key modules working* $\rightarrow$ **Repair**
     - *Boots + working + mature age* $\rightarrow$ **Refurbish**
     - *Dead motherboard + valuable components working* $\rightarrow$ **Component Recovery**
     - *Extensive damage* $\rightarrow$ **Recycle**
   - **Battery Safety Gate**: Flags damaged/swollen lithium batteries with a high-visibility hazard alert and strictly forces battery recycling.
   - **Component Recovery Bridge**: One-click **"List working parts on Component Rescue"** shortcut pre-fills donor listings.
   - **Outcome Recording & Evidence**: Records final circular outcome, handling entity, costs, and attaches receipts/invoices with image data preview.
   - **Audit Verification Action**: Verifies chain-of-custody evidence, elevating status to **Completed - Verified**.

4. **🌱 Sustainability Dashboard (Verified Outcomes Only)**:
   - Completely decoupled from preliminary flow estimates; counts *only audit-verified devices*.
   - Displays separate counts for Repaired, Refurbished, Donated, Parts Rescued, and Recycled.
   - Dynamic SVG Donut Chart illustrating outcome distribution.
   - Honest **Verified vs. Pending** comparison counter cards.
   - Quantified Financial Impact (actual user savings) and Ecological Abatement ($CO_2$ & e-waste kg).
   - Shareable `#track=EW-XXXX` direct hash URLs for instant QR lookup.

### ➕ Custom Device Models & Categories
Users can add any smartphone or laptop model not listed in the default catalog using the `+ Add Custom Model` button on Screen 1. The custom model persists in `localStorage`, integrates seamlessly with repair economics benchmarking, and is immediately available across diagnosis and journey tracking.

---

## ⏱️ 60-Second E-Waste Journey Tracker Demo Script

| Step | Action | What to Say / What to Show |
| :--- | :--- | :--- |
| **1. Owner Registration** | Tap **📍 Tracker** in header (or 'Register this device' from Result Screen). Click **+ Register Device**. Enter Dell Inspiron 15, 'Not working', 'Depleted battery', confirm data wipe, and click **Generate Device Passport**. | *"The owner assigns unique circular asset ID `EW-1005` with a generated QR code and printable asset tag. Under My Devices, the progress bar shows Stage 1: Registered."* |
| **2. Collection Handover** | Switch top role to **Collection Partner**. Click on pending pickup `EW-1005` (or tap '📷 Scan QR' to simulate optical scanning). Click **Confirm Collection & Handover**. | *"The collection partner logs custody with driver name, timestamp, and non-metal packing. Status updates to 'Collected' in the audit trail."* |
| **3. Hardware Inspection** | Switch role to **Repair-Inspection Partner**. Select `EW-1005`. Set Boot: 'Does not boot'. Mark RAM & SSD as 'Working', Battery as 'Damaged'. | *"Notice two automated rules trigger: (1) System suggests Component Recovery because valuable RAM and SSD are functional; (2) Battery Hazard alert flags the swollen battery and forces battery recycling. Tap 'List working parts on Component Rescue' to bridge the modules directly into the circular spare parts pool!"* |
| **4. Outcome & Evidence** | In Outcome form, select 'Parts recovered for reuse', choose 'EcoFix Tech Lab', upload a test certificate, and click **Record Outcome**, then click **Verify Outcome & Impact ✅**. | *"The partner records the outcome and attaches verifiable evidence. Upon clicking 'Verify', the device achieves 'Completed - Verified' status."* |
| **5. Sustainability Dashboard** | Switch to the **Sustainability Dashboard** tab. Check verified counts and SVG donut chart. Test URL hash by visiting `#track=EW-1005`. | *"Notice that only verified outcomes are counted here. The dynamic summary updates honestly, savings and carbon offsets reflect, and the #track=EW-1005 link allows anyone scanning the physical QR code to inspect the complete 5-stage timeline!"* |

---

## ⏱️ 30-Second Component Rescue Demo Script

| Step | Action | What Happens / What to Say |
| :--- | :--- | :--- |
| **1. Donor Listing** | From Result Screen (or Header), open **Component Rescue** → "I have parts". Select *Dell Inspiron 3511*, *RAM*, spec `"8GB DDR4 3200MHz"`, tick *Tested*, price *₹900*, area *Chengalpattu*. Click **Add to Rescue Pool**. | *"A broken laptop that would otherwise go to scrap is now an active spare parts resource. The RAM immediately appears in the Rescue Pool."* |
| **2. Repairer Match** | Switch to **"I need parts"** tab. Click sample chip: *QuickFix Mobiles (8GB DDR4 RAM, budget ₹1,500)*. Click **Find Matches**. | *"Our matching algorithm ranks the top 3 matches with a 95% Match score, showing 'Spec matches', 'Within budget', and 'Same area'. Tap 'Request this part' → confirm → Request ID `RCM-2026-XXXX` is generated, and the Impact Dashboard instantly records the parts rescued and repairer rupees saved!"* |
| **3. Safety Gate Check** | Switch to "I have parts", select **Battery**, and click "Yes (Swollen/Damaged)". | *"Observe our safety gate: Swollen batteries are flagged as hazardous, blocked from reuse, and routed to certified recyclers. If intact, all 4 safety checkboxes must be verified."* |

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
