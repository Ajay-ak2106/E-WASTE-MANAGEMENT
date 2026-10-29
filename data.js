/**
 * ReLife Passport - Static Data Module
 * Contains device catalog, repair costs, mock providers,
 * safety checklists, and bilingual translations (English & Tamil).
 */

const RELIFE_DATA = {
  // 15 Devices: 10 Phones + 5 Laptops
  devices: [
    // Phones
    {
      id: "redmi_note_11",
      name: "Redmi Note 11",
      type: "phone",
      brand: "Xiaomi",
      os: "android",
      newPrice: 13999,
      repairs: {
        cracked_screen: { cost: 2600, fairMin: 2100, fairMax: 3200 },
        battery_drains: { cost: 1400, fairMin: 1100, fairMax: 1800 },
        wont_charge: { cost: 850, fairMin: 600, fairMax: 1200 },
        slow_perf: { cost: 600, fairMin: 400, fairMax: 900 },
        water_damage: { cost: 2900, fairMin: 2200, fairMax: 3800 }
      }
    },
    {
      id: "samsung_m31",
      name: "Samsung Galaxy M31",
      type: "phone",
      brand: "Samsung",
      os: "android",
      newPrice: 16499,
      repairs: {
        cracked_screen: { cost: 3200, fairMin: 2600, fairMax: 3800 },
        battery_drains: { cost: 1650, fairMin: 1300, fairMax: 2100 },
        wont_charge: { cost: 950, fairMin: 700, fairMax: 1300 },
        slow_perf: { cost: 700, fairMin: 500, fairMax: 1000 },
        water_damage: { cost: 3400, fairMin: 2600, fairMax: 4400 }
      }
    },
    {
      id: "iphone_11",
      name: "Apple iPhone 11",
      type: "phone",
      brand: "Apple",
      os: "iphone",
      newPrice: 41999,
      repairs: {
        cracked_screen: { cost: 5800, fairMin: 4800, fairMax: 7200 },
        battery_drains: { cost: 3400, fairMin: 2800, fairMax: 4200 },
        wont_charge: { cost: 2200, fairMin: 1600, fairMax: 2900 },
        slow_perf: { cost: 1200, fairMin: 800, fairMax: 1800 },
        water_damage: { cost: 8500, fairMin: 6500, fairMax: 11000 }
      }
    },
    {
      id: "realme_8",
      name: "Realme 8",
      type: "phone",
      brand: "Realme",
      os: "android",
      newPrice: 15999,
      repairs: {
        cracked_screen: { cost: 2800, fairMin: 2300, fairMax: 3400 },
        battery_drains: { cost: 1450, fairMin: 1150, fairMax: 1850 },
        wont_charge: { cost: 800, fairMin: 550, fairMax: 1100 },
        slow_perf: { cost: 600, fairMin: 400, fairMax: 900 },
        water_damage: { cost: 3100, fairMin: 2400, fairMax: 4000 }
      }
    },
    {
      id: "vivo_y20",
      name: "Vivo Y20",
      type: "phone",
      brand: "Vivo",
      os: "android",
      newPrice: 12990,
      repairs: {
        cracked_screen: { cost: 2300, fairMin: 1800, fairMax: 2900 },
        battery_drains: { cost: 1300, fairMin: 1000, fairMax: 1650 },
        wont_charge: { cost: 750, fairMin: 500, fairMax: 1050 },
        slow_perf: { cost: 550, fairMin: 350, fairMax: 800 },
        water_damage: { cost: 2600, fairMin: 2000, fairMax: 3500 }
      }
    },
    {
      id: "oneplus_nord_ce2",
      name: "OnePlus Nord CE 2 5G",
      type: "phone",
      brand: "OnePlus",
      os: "android",
      newPrice: 23999,
      repairs: {
        cracked_screen: { cost: 4200, fairMin: 3500, fairMax: 5100 },
        battery_drains: { cost: 1950, fairMin: 1550, fairMax: 2450 },
        wont_charge: { cost: 1100, fairMin: 850, fairMax: 1500 },
        slow_perf: { cost: 800, fairMin: 550, fairMax: 1200 },
        water_damage: { cost: 4900, fairMin: 3800, fairMax: 6200 }
      }
    },
    {
      id: "poco_x3",
      name: "POCO X3 Pro",
      type: "phone",
      brand: "Xiaomi / POCO",
      os: "android",
      newPrice: 18999,
      repairs: {
        cracked_screen: { cost: 3100, fairMin: 2500, fairMax: 3800 },
        battery_drains: { cost: 1600, fairMin: 1250, fairMax: 2050 },
        wont_charge: { cost: 950, fairMin: 700, fairMax: 1300 },
        slow_perf: { cost: 700, fairMin: 450, fairMax: 1000 },
        water_damage: { cost: 3900, fairMin: 3000, fairMax: 5000 }
      }
    },
    {
      id: "moto_g60",
      name: "Motorola Moto G60",
      type: "phone",
      brand: "Motorola",
      os: "android",
      newPrice: 17999,
      repairs: {
        cracked_screen: { cost: 2950, fairMin: 2400, fairMax: 3600 },
        battery_drains: { cost: 1550, fairMin: 1200, fairMax: 1950 },
        wont_charge: { cost: 900, fairMin: 650, fairMax: 1250 },
        slow_perf: { cost: 650, fairMin: 400, fairMax: 950 },
        water_damage: { cost: 3700, fairMin: 2800, fairMax: 4800 }
      }
    },
    {
      id: "iphone_13",
      name: "Apple iPhone 13",
      type: "phone",
      brand: "Apple",
      os: "iphone",
      newPrice: 52999,
      repairs: {
        cracked_screen: { cost: 7900, fairMin: 6500, fairMax: 9800 },
        battery_drains: { cost: 4200, fairMin: 3500, fairMax: 5200 },
        wont_charge: { cost: 2800, fairMin: 2100, fairMax: 3600 },
        slow_perf: { cost: 1500, fairMin: 1000, fairMax: 2200 },
        water_damage: { cost: 11500, fairMin: 9000, fairMax: 15000 }
      }
    },
    {
      id: "samsung_s20_fe",
      name: "Samsung Galaxy S20 FE 5G",
      type: "phone",
      brand: "Samsung",
      os: "android",
      newPrice: 32999,
      repairs: {
        cracked_screen: { cost: 5600, fairMin: 4600, fairMax: 6900 },
        battery_drains: { cost: 2400, fairMin: 1900, fairMax: 3100 },
        wont_charge: { cost: 1400, fairMin: 1050, fairMax: 1900 },
        slow_perf: { cost: 950, fairMin: 650, fairMax: 1400 },
        water_damage: { cost: 6800, fairMin: 5200, fairMax: 8800 }
      }
    },

    // Laptops
    {
      id: "hp_15s",
      name: "HP 15s (Intel Core i3)",
      type: "laptop",
      brand: "HP",
      os: "windows",
      newPrice: 38990,
      repairs: {
        cracked_screen: { cost: 4800, fairMin: 3900, fairMax: 5900 },
        battery_drains: { cost: 2800, fairMin: 2200, fairMax: 3500 },
        wont_charge: { cost: 1850, fairMin: 1400, fairMax: 2500 },
        slow_perf: { cost: 2200, fairMin: 1600, fairMax: 3000 },
        water_damage: { cost: 7200, fairMin: 5500, fairMax: 9500 }
      }
    },
    {
      id: "dell_inspiron_3511",
      name: "Dell Inspiron 3511",
      type: "laptop",
      brand: "Dell",
      os: "windows",
      newPrice: 42500,
      repairs: {
        cracked_screen: { cost: 5200, fairMin: 4200, fairMax: 6500 },
        battery_drains: { cost: 3100, fairMin: 2500, fairMax: 3900 },
        wont_charge: { cost: 1950, fairMin: 1450, fairMax: 2600 },
        slow_perf: { cost: 2400, fairMin: 1800, fairMax: 3200 },
        water_damage: { cost: 7900, fairMin: 6000, fairMax: 10200 }
      }
    },
    {
      id: "lenovo_ideapad_3",
      name: "Lenovo IdeaPad 3",
      type: "laptop",
      brand: "Lenovo",
      os: "windows",
      newPrice: 36990,
      repairs: {
        cracked_screen: { cost: 4600, fairMin: 3800, fairMax: 5600 },
        battery_drains: { cost: 2700, fairMin: 2150, fairMax: 3400 },
        wont_charge: { cost: 1750, fairMin: 1300, fairMax: 2350 },
        slow_perf: { cost: 2100, fairMin: 1550, fairMax: 2800 },
        water_damage: { cost: 6800, fairMin: 5100, fairMax: 9000 }
      }
    },
    {
      id: "acer_aspire_5",
      name: "Acer Aspire 5",
      type: "laptop",
      brand: "Acer",
      os: "windows",
      newPrice: 44990,
      repairs: {
        cracked_screen: { cost: 5400, fairMin: 4400, fairMax: 6700 },
        battery_drains: { cost: 3200, fairMin: 2600, fairMax: 4000 },
        wont_charge: { cost: 2100, fairMin: 1550, fairMax: 2800 },
        slow_perf: { cost: 2500, fairMin: 1900, fairMax: 3400 },
        water_damage: { cost: 8200, fairMin: 6300, fairMax: 10600 }
      }
    },
    {
      id: "asus_vivobook_14",
      name: "ASUS VivoBook 14",
      type: "laptop",
      brand: "ASUS",
      os: "windows",
      newPrice: 35990,
      repairs: {
        cracked_screen: { cost: 4500, fairMin: 3700, fairMax: 5500 },
        battery_drains: { cost: 2600, fairMin: 2050, fairMax: 3300 },
        wont_charge: { cost: 1650, fairMin: 1200, fairMax: 2200 },
        slow_perf: { cost: 2100, fairMin: 1550, fairMax: 2800 },
        water_damage: { cost: 6600, fairMin: 4900, fairMax: 8700 }
      }
    }
  ],

  // 10 Mock Providers around Chengalpattu / Chennai / Tamil Nadu
  providers: [
    {
      id: "prov_1",
      name: "EcoFix Chengalpattu Tech Lab",
      type: "repair",
      area: "Chengalpattu Town (Near New Bus Stand)",
      district: "Chengalpattu",
      rating: 4.9,
      reviewsCount: 148,
      distance: 1.2,
      badges: ["Verified Partner", "Data-Safe Handover", "90-Day Warranty"],
      phone: "+91 94421 88410",
      timings: "9:30 AM - 8:30 PM",
      address: "No. 14, GST Road, Chengalpattu - 603001"
    },
    {
      id: "prov_2",
      name: "Tambaram Green Mobile Hospital",
      type: "repair",
      area: "Tambaram West",
      district: "Chennai / Chengalpattu",
      rating: 4.8,
      reviewsCount: 210,
      distance: 6.5,
      badges: ["Verified Partner", "Express 60-min Service", "OEM Grade Parts"],
      phone: "+91 98402 77150",
      timings: "10:00 AM - 9:00 PM",
      address: "28, Rajaji Road, Tambaram West, Chennai - 600045"
    },
    {
      id: "prov_3",
      name: "ReNew Hub Chennai",
      type: "refurbish",
      area: "Guindy Industrial Estate",
      district: "Chennai",
      rating: 4.7,
      reviewsCount: 382,
      distance: 14.2,
      badges: ["Instant UPI Payout", "Free Doorstep Pickup", "Certified Refurbisher"],
      phone: "+91 91760 33490",
      timings: "9:00 AM - 7:00 PM",
      address: "B-4, Guindy Industrial Estate, Chennai - 600032"
    },
    {
      id: "prov_4",
      name: "Cashify Super Store Chromepet",
      type: "refurbish",
      area: "Chromepet GST Road",
      district: "Chengalpattu",
      rating: 4.6,
      reviewsCount: 194,
      distance: 8.2,
      badges: ["Verified Partner", "Instant Best-Price Quote", "Data Wiped On-Spot"],
      phone: "+91 93844 55102",
      timings: "10:00 AM - 8:30 PM",
      address: "GST Road, Opp. Chromepet Railway Station, Chennai - 600044"
    },
    {
      id: "prov_5",
      name: "Kalvi Digital School Outreach",
      type: "donate",
      area: "Chengalpattu Rural District",
      district: "Chengalpattu",
      rating: 5.0,
      reviewsCount: 89,
      distance: 3.4,
      urgentNeed: "Needs 8 functional smartphones for Class 10 government school students",
      badges: ["Registered NGO (80G Tax Exemption)", "100% Student Allocation", "Impact Photo Report"],
      phone: "+91 94432 11099",
      timings: "10:00 AM - 5:00 PM (Mon-Sat)",
      address: "Rural Community Learning Center, Alagesan Nagar, Chengalpattu - 603001"
    },
    {
      id: "prov_6",
      name: "Nalam Vidiyal Children's Foundation",
      type: "donate",
      area: "Tambaram Sanatorium",
      district: "Chengalpattu",
      rating: 4.9,
      reviewsCount: 114,
      distance: 7.8,
      urgentNeed: "Needs 4 laptops for computer literacy and coding lab",
      badges: ["Verified Charity", "Direct Beneficiary Handover", "Tax Exemption Receipt"],
      phone: "+91 97910 44211",
      timings: "9:30 AM - 6:00 PM",
      address: "Sanatorium Main Road, Tambaram Sanatorium, Chennai - 600047"
    },
    {
      id: "prov_7",
      name: "Tamil Nadu Circular Green Recyclers",
      type: "recycle",
      area: "Maraimalai Nagar Industrial Area",
      district: "Chengalpattu",
      rating: 4.9,
      reviewsCount: 165,
      distance: 4.1,
      badges: ["CPCB Authorized", "Zero-Landfill Guarantee", "Destruction Certificate Issued"],
      phone: "+91 98411 99033",
      timings: "8:30 AM - 6:00 PM",
      address: "Plot 42, SIDCO Industrial Complex, Maraimalai Nagar - 603209"
    },
    {
      id: "prov_8",
      name: "EarthSense E-Waste Solutions",
      type: "recycle",
      area: "Alathur Pharma Hub / OMR",
      district: "Chengalpattu",
      rating: 4.8,
      reviewsCount: 240,
      distance: 12.0,
      badges: ["ISO 14001 Certified", "Precious Metal Recovery", "Green Points Reward"],
      phone: "+91 99400 88219",
      timings: "9:00 AM - 6:30 PM",
      address: "SIPCOT Industrial Park, Alathur, Chengalpattu - 603110"
    },
    {
      id: "prov_9",
      name: "Apple & Multi-Brand Chip Level Specialist",
      type: "repair",
      area: "Velachery Main Road",
      district: "Chennai",
      rating: 4.7,
      reviewsCount: 310,
      distance: 16.5,
      badges: ["Motherboard Micro-Soldering", "180-Day Warranty", "Clean Room Facility"],
      phone: "+91 98409 66120",
      timings: "10:00 AM - 8:30 PM",
      address: "125, Velachery Bypass Road, Velachery, Chennai - 600042"
    },
    {
      id: "prov_10",
      name: "Auroville Youth Tech Share",
      type: "donate",
      area: "Tindivanam - Chengalpattu Border",
      district: "Tamil Nadu",
      rating: 5.0,
      reviewsCount: 76,
      distance: 18.0,
      urgentNeed: "Urgent need for 6 laptops for village youth vocational training",
      badges: ["Community Empowerment", "Solar Powered Learning Hub", "Verified NGO"],
      phone: "+91 94860 22180",
      timings: "9:00 AM - 5:30 PM",
      address: "Sustainable Tech Village Center, NH45 Link Road - 604001"
    }
  ],

  // OS Specific Data Safety Checklists
  safetyChecklists: {
    android: [
      {
        id: "step_backup",
        title: "Backup Personal Data to Cloud",
        shortDesc: "Save photos, contacts, WhatsApp chats, and documents.",
        howTo: "Go to Settings > Google > Backup > 'Back up now'. In WhatsApp, open Settings > Chats > Chat backup > Back Up.",
        riskTip: "Never rely on SD card alone. Confirm cloud backup shows today's timestamp."
      },
      {
        id: "step_accounts",
        title: "Sign Out of Google & Brand Accounts",
        shortDesc: "Remove Factory Reset Protection (FRP) lock.",
        howTo: "Go to Settings > Passwords & Accounts (or Users & Accounts) > Tap your Google Account > 'Remove Account'. Do same for Xiaomi/Samsung account.",
        riskTip: "If you don't remove Google account first, the next recipient will be locked out by Android FRP."
      },
      {
        id: "step_financial",
        title: "De-link UPI & Banking Applications",
        shortDesc: "Revoke device access from PhonePe, GPay, Paytm, and net banking.",
        howTo: "Open PhonePe/GPay > Profile > Security > Manage Devices > Log out this device. Clear app storage in Settings > Apps.",
        riskTip: "Prevents automated SMS verification abuse if device is physically tested."
      },
      {
        id: "step_sim_sd",
        title: "Eject Physical SIM & MicroSD Cards",
        shortDesc: "Physical cards often retain confidential SMS codes and files.",
        howTo: "Use a SIM ejector tool to push the pinhole on the side tray. Remove both nano-SIM and MicroSD memory card.",
        riskTip: "Over 40% of discarded phones still have active memory cards inserted!"
      },
      {
        id: "step_encryption",
        title: "Verify File-Based Encryption (FBE)",
        shortDesc: "Ensure storage is cryptographically scrambled.",
        howTo: "Settings > Security > Encryption & Credentials. Modern Android (10+) is encrypted by default. Verify status is 'Encrypted'.",
        riskTip: "Resetting an encrypted phone makes old data mathematically unrecoverable."
      },
      {
        id: "step_wipe",
        title: "Perform Full Factory Data Reset",
        shortDesc: "Wipe all partitions and return phone to out-of-box state.",
        howTo: "Settings > System > Reset options > 'Erase all data (factory reset)' > Enter PIN to confirm.",
        riskTip: "Wait for the phone to reboot to the 'Hello / Welcome' initial setup screen before handover."
      }
    ],

    iphone: [
      {
        id: "step_backup",
        title: "Create Fresh iCloud / PC Backup",
        shortDesc: "Full backup of messages, photos, health data, and apps.",
        howTo: "Go to Settings > [Your Name] > iCloud > iCloud Backup > Tap 'Back Up Now'. Or plug into Finder/iTunes on PC.",
        riskTip: "Check that 'Last successful backup' shows current time."
      },
      {
        id: "step_accounts",
        title: "Sign Out of Apple ID & Turn Off Find My",
        shortDesc: "Disable Activation Lock for the next owner.",
        howTo: "Settings > [Your Name] > Scroll to bottom > Tap 'Sign Out'. Enter your Apple ID password and tap 'Turn Off'.",
        riskTip: "If Activation Lock is left active, the device is completely unusable by anyone else."
      },
      {
        id: "step_financial",
        title: "Remove Apple Wallet & UPI Cards",
        shortDesc: "Delete debit/credit cards linked to Apple Pay and Indian UPI apps.",
        howTo: "Settings > Wallet & Apple Pay > Tap each card > 'Remove Card'. Unlink GPay/Paytm sessions.",
        riskTip: "Protects virtual card tokens and contactless payment authorizations."
      },
      {
        id: "step_sim_sd",
        title: "Remove Physical SIM & Deregister eSIM",
        shortDesc: "Ensure telecom numbers cannot receive OTPs.",
        howTo: "Use ejector pin on the right/left tray. For eSIM: Settings > Mobile Data > Tap eSIM plan > 'Delete eSIM'.",
        riskTip: "Remember to transfer your eSIM to your new phone first before deleting!"
      },
      {
        id: "step_encryption",
        title: "Confirm Secure Enclave Protection",
        shortDesc: "Hardware-level AES 256-bit encryption check.",
        howTo: "iOS automatically encrypts with device passcode through the Secure Enclave processor.",
        riskTip: "iOS cryptographic erase permanently destroys the storage decrypt key in 1 millisecond."
      },
      {
        id: "step_wipe",
        title: "Erase All Content and Settings",
        shortDesc: "Cryptographically erase the device to factory state.",
        howTo: "Settings > General > Transfer or Reset iPhone > Tap 'Erase All Content and Settings' > Continue.",
        riskTip: "Hand over only when device displays the animated multi-lingual 'Hello' screen."
      }
    ],

    windows: [
      {
        id: "step_backup",
        title: "Backup User Folders & Cloud Sync",
        shortDesc: "Copy documents, desktop files, browser bookmarks to external drive.",
        howTo: "Connect an external USB drive or use OneDrive (Settings > Accounts > Windows backup).",
        riskTip: "Check Documents, Downloads, and Desktop folders manually for missed offline files."
      },
      {
        id: "step_accounts",
        title: "Disconnect Microsoft & Work/School Accounts",
        shortDesc: "Revoke laptop license and organization management MDM.",
        howTo: "Settings > Accounts > Email & accounts > Select work/school account > 'Disconnect'. Convert to local admin or remove.",
        riskTip: "Corporate laptops may have active Intune/MDM policies that prevent resets."
      },
      {
        id: "step_financial",
        title: "Clear Browser Passwords & Payment Tokens",
        shortDesc: "Sign out of Chrome/Edge and wipe stored auto-fill passwords.",
        howTo: "Open Chrome/Edge > Settings > Clear Browsing Data > Advanced > 'All Time' > Check Passwords, Autofill, and Cookies.",
        riskTip: "Saved browser credentials are the #1 vulnerability on reused PCs."
      },
      {
        id: "step_sim_sd",
        title: "Remove SD Cards, USB Dongles & Peripherals",
        shortDesc: "Check card reader slots, wireless mouse USB dongles, optical drive.",
        howTo: "Inspect SD card slot on laptop side. Eject any SD adapter or wireless mouse receiver.",
        riskTip: "Many users accidentally leave high-capacity SD cards inside laptop card readers."
      },
      {
        id: "step_encryption",
        title: "BitLocker / Drive Encryption State",
        shortDesc: "Ensure drive volume is fully encrypted before wipe.",
        howTo: "Start menu > type 'Manage BitLocker' > Ensure C: drive status is 'BitLocker on'.",
        riskTip: "Formatting an unencrypted SSD can leave recoverable file traces."
      },
      {
        id: "step_wipe",
        title: "Reset this PC with 'Clean the Drive' Option",
        shortDesc: "Windows secure wipe writes zeros across storage sectors.",
        howTo: "Settings > System > Recovery > 'Reset PC' > Choose 'Remove everything' > 'Clean the data drive'.",
        riskTip: "Selecting 'Clean the drive' takes ~45 minutes and guarantees data cannot be recovered by forensic software."
      }
    ]
  },

  // Bilingual UI Translations: English & Tamil
  translations: {
    en: {
      appName: "ReLife Passport",
      tagline: "Repair & Reuse Connect — Confident Second-Life for Devices",
      langSwitch: "தமிழ்",
      progressSteps: ["Diagnose", "Score", "Economics", "Data Safety", "Connect"],

      // Screen 1: Problem Input
      screen1Title: "Device Diagnosis",
      screen1Subtitle: "Select your device and symptoms to calculate the smartest next step",
      deviceTypeLabel: "Device Category",
      phone: "Smartphone",
      laptop: "Laptop",
      modelLabel: "Select Model",
      modelPlaceholder: "-- Select your device model --",
      ageLabel: "Device Age",
      ageYearsText: "years old",
      ageNewText: "Under 1 year",
      problemLabel: "What issue are you facing?",
      cracked_screen: "Cracked Screen",
      cracked_screen_desc: "Broken glass, touchscreen dead spots, or lines on display",
      battery_drains: "Battery Drains Fast",
      battery_drains_desc: "Dies quickly, shuts off under 20%, or bulges",
      wont_charge: "Won't Charge",
      wont_charge_desc: "Loose charging port, cable must be bent, or dead battery",
      slow_perf: "Slow Performance",
      slow_perf_desc: "App freezing, heavy lag, thermal throttling, boot delays",
      water_damage: "Liquid / Water Damage",
      water_damage_desc: "Dropped in liquid, dampness inside, camera fogged",
      powerQuestion: "Does the device still turn on?",
      yes: "Yes, powers on",
      no: "No, completely dead",
      demoButton: "⚡ Try Demo Example (Redmi Note 11)",
      calculateBtn: "Calculate Second-Life Viability →",
      errSelectModel: "Please select a device model to continue.",
      errSelectProblem: "Please pick the primary issue with your device.",

      // Screen 2: Result
      screen2Title: "Second-Life Evaluation",
      screen2Subtitle: "Algorithmic decision based on repair economics, hardware age, and functional status",
      secondLifeScore: "Second-Life Viability Score",
      scoreExplanationHigh: "High circularity potential! Repairing creates maximum economic & ecological value.",
      scoreExplanationMid: "Good secondary market value. Refurbishment or student donation is highly feasible.",
      scoreExplanationLow: "End of viable lifecycle. Responsible zero-landfill e-waste recycling recommended.",
      recLabel: "Recommended Action",
      actionRepair: "REPAIR",
      actionSell: "SELL / REFURBISH",
      actionDonate: "DONATE TO LEARNING",
      actionRecycle: "CERTIFIED RECYCLE",
      viewCostBtn: "View Cost Breakdown & Savings →",

      // Screen 3: Cost Card
      screen3Title: "Economic & Environmental Impact",
      screen3Subtitle: "Transparent repair benchmarking vs replacement cost",
      repairCostHeader: "Estimated Repair Cost",
      newPriceHeader: "New Replacement Price",
      youSaveText: "You Save",
      vsBuyingNew: "compared to purchasing a new device",
      co2Avoided: "CO₂ Avoided",
      co2Units: "kg greenhouse gas",
      ewasteAvoided: "E-Waste Diverted",
      ewasteUnits: "kg toxic electronic waste",
      fairnessMeterTitle: "Repair Price Fairness Meter",
      fairnessRange: "Fair Local Market Range",
      fairnessTip: "Do not pay more than",
      fairnessTipSuffix: "at unverified third-party shops.",
      proceedSafetyBtn: "Proceed to Data-Safety Wizard →",

      // Screen 4: Data Safety
      screen4Title: "Zero-Data-Risk Handover Wizard",
      screen4Subtitle: "Step-by-step verified preparation before handing over your device",
      checklistProgress: "Safety Checklist Progress",
      expandHowTo: "How to perform this step",
      riskWarningTitle: "Why this matters:",
      certificateBadge: "SEALED HANDOVER RECEIPT",
      certificateTitle: "Data-Safe Handover Certificate",
      certIdLabel: "Certificate ID",
      certDateLabel: "Handover Date",
      certDeviceLabel: "Device Specification",
      certStatusLabel: "Sanitization Status",
      certStatusVerified: "100% Cryptographically Cleansed",
      certInstruction: "Show this certified QR pass to your chosen technician or recycler.",
      completeAllWarning: "Please check off all safety steps above to generate your certified handover passport.",
      proceedConnectBtn: "Connect with Verified Partners →",

      // Screen 5: Connect + Impact
      screen5Title: "Verified Local Partners & Impact",
      screen5Subtitle: "Authorized repair labs, refurbishers, NGOs and certified recyclers",
      filterAll: "All Partners",
      filterRecommended: "Recommended For You",
      filterRepair: "Repair Labs",
      filterRefurbish: "Sell / Refurbish",
      filterDonate: "NGO Donation",
      filterRecycle: "Green Recyclers",
      urgentNeedTag: "Urgent Community Request:",
      bookScheduleBtn: "Book / Schedule Handover",
      modalTitle: "Schedule Device Handover",
      modalSubtitle: "Confirm an appointment with",
      pickupOption: "Service Mode",
      modeDropoff: "Direct Walk-in / Drop-off",
      modePickup: "Free Doorstep Pickup",
      dateLabel: "Preferred Date",
      timeSlotLabel: "Time Window",
      slotMorning: "Morning (9:30 AM - 1:00 PM)",
      slotAfternoon: "Afternoon (1:00 PM - 5:00 PM)",
      slotEvening: "Evening (5:00 PM - 8:30 PM)",
      confirmBookingBtn: "Confirm Handover Appointment",
      bookingSuccessTitle: "Appointment Confirmed!",
      bookingSuccessDesc: "Your device handover has been registered.",
      bookingIdLabel: "Booking Reference",
      closeBtn: "Done",

      // Impact Dashboard
      impactTitle: "Community Circular Impact",
      devicesDivertedLabel: "Devices Diverted",
      totalSavedLabel: "Rupees Saved by Users",
      totalEwasteLabel: "E-Waste Avoided (kg)",
      totalCo2Label: "CO₂ Avoided (kg)",
      resetDemoBtn: "Reset Demo Stats",
      startOverBtn: "Start New Assessment 🔄"
    },

    ta: {
      appName: "ரீலைஃப் பாஸ்போர்ட்",
      tagline: "பழுதுபார்த்தல் & மறுபயன்பாட்டு இணைப்பு — சாதனங்களுக்கு பாதுகாப்பான மறுவாழ்வு",
      langSwitch: "English",
      progressSteps: ["கண்டறிதல்", "மதிப்பெண்", "பொருளாதாரம்", "தரவு பாதுகாப்பு", "இணைப்பு"],

      // Screen 1: Problem Input
      screen1Title: "சாதன குறைபாடு கண்டறிதல்",
      screen1Subtitle: "சரியான முடிவை அறிய உங்கள் சாதனம் மற்றும் குறைபாட்டைத் தேர்ந்தெடுக்கவும்",
      deviceTypeLabel: "சாதன வகை",
      phone: "ஸ்மார்ட்போன்",
      laptop: "லேப்டாப்",
      modelLabel: "சாதன மாதிரியைத் தேர்ந்தெடுக்கவும்",
      modelPlaceholder: "-- உங்கள் சாதன மாதிரியைத் தேர்வு செய்யவும் --",
      ageLabel: "சாதனத்தின் வயது",
      ageYearsText: "ஆண்டுகள்",
      ageNewText: "1 ஆண்டுக்கும் குறைவு",
      problemLabel: "சாதனத்தில் என்ன சிக்கல்?",
      cracked_screen: "உடைந்த திரை",
      cracked_screen_desc: "கண்ணாடி விரிசல், தொடுதிரை வேலை செய்யாமை அல்லது கோடுகள்",
      battery_drains: "பேட்டரி விரைவில் குறைகிறது",
      battery_drains_desc: "வேகமாக சார்ஜ் குறைகிறது, 20% கீழே உடனே அணைந்து விடுகிறது",
      wont_charge: "சார்ஜ் ஆகவில்லை",
      wont_charge_desc: "சார்ஜிங் போர்ட் லூஸ், கேபிள் மடக்கினால் மட்டுமே சார்ஜ் ஆகிறது",
      slow_perf: "மெதுவான வேகம் / ஹேங்",
      slow_perf_desc: "ஆப் தாமதம், அதிக வெப்பம், பூட் ஆக அதிக நேரம்",
      water_damage: "நீர் / திரவ சேதம்",
      water_damage_desc: "தண்ணீரில் விழுந்தது, உள்ளே ஈரம், கேமரா மூடுபனி",
      powerQuestion: "சாதனம் இன்னும் ஆன் ஆகிறதா?",
      yes: "ஆம், ஆன் ஆகிறது",
      no: "இல்லை, முற்றிலும் அணைந்துவிட்டது",
      demoButton: "⚡ டெமோ உதாரணம் (ரெட்மி நோட் 11)",
      calculateBtn: "மறுவாழ்வு மதிப்பீட்டைக் கணக்கிடு →",
      errSelectModel: "தொடர உங்கள் சாதன மாதிரியைத் தேர்ந்தெடுக்கவும்.",
      errSelectProblem: "சாதனத்தின் முக்கியப் பிரச்சினையைத் தேர்வு செய்யவும்.",

      // Screen 2: Result
      screen2Title: "இரண்டாம் வாழ்க்கை மதிப்பீடு",
      screen2Subtitle: "பழுதுபார்ப்பு செலவு, சாதன வயது மற்றும் செயல்பாட்டின் அடிப்படையிலான பரிந்துரை",
      secondLifeScore: "மறுவாழ்வு சாத்தியக்கூறு மதிப்பெண்",
      scoreExplanationHigh: "அருமையான மறுபயன்பாட்டு வாய்ப்பு! பழுதுபார்ப்பது அதிக பணத்தையும் சுற்றுச்சூழலையும் மிச்சப்படுத்துகிறது.",
      scoreExplanationMid: "நல்ல மறுவிற்பனை மதிப்பு உள்ளது. புதுப்பித்தல் அல்லது மாணவர் கல்விக்கு நன்கொடை சிறந்தது.",
      scoreExplanationLow: "பயன்பாட்டு காலம் முடிந்துவிட்டது. சுற்றுச்சூழலுக்கு பாதுகாப்பான மின்-கழிவு மறுசுழற்சி சிறந்தது.",
      recLabel: "பரிந்துரைக்கப்பட்ட நடவடிக்கை",
      actionRepair: "பழுதுபார்த்தல்",
      actionSell: "விற்பனை / புதுப்பித்தல்",
      actionDonate: "கல்விக்கு நன்கொடை",
      actionRecycle: "பாதுகாப்பான மறுசுழற்சி",
      viewCostBtn: "செலவு & சேமிப்பு விவரங்களைக் காண்க →",

      // Screen 3: Cost Card
      screen3Title: "பொருளாதார & சுற்றுச்சூழல் தாக்கம்",
      screen3Subtitle: "புதிய சாதன விலையுடன் வெளிப்படையான பழுதுபார்ப்பு செலவு ஒப்பீடு",
      repairCostHeader: "மதிப்பிடப்பட்ட பழுதுபார்ப்பு செலவு",
      newPriceHeader: "புதிய சாதனத்தின் விலை",
      youSaveText: "நீங்கள் சேமிப்பது",
      vsBuyingNew: "புதிய சாதனம் வாங்குவதை விட சேமிப்பு",
      co2Avoided: "தவிர்க்கப்பட்ட CO₂",
      co2Units: "கிலோ பசுமைக்குடில் வாயு",
      ewasteAvoided: "தவிர்க்கப்பட்ட மின்-கழிவு",
      ewasteUnits: "கிலோ நச்சு மின்-கழிவு",
      fairnessMeterTitle: "நியாயமான விலை அளவீடு (Fairness Meter)",
      fairnessRange: "சந்தை நியாய விலை வரம்பு",
      fairnessTip: "இந்த தொகைக்கு மேல் செலுத்தாதீர்கள்:",
      fairnessTipSuffix: "(சரிபார்க்கப்படாத கடைகளில் ஏமாறாதீர்கள்)",
      proceedSafetyBtn: "தரவு பாதுகாப்பு வழிகாட்டிக்குச் செல்க →",

      // Screen 4: Data Safety
      screen4Title: "பாதுகாப்பான தரவு அழிப்பு வழிகாட்டி",
      screen4Subtitle: "சாதனத்தை யாரிடமும் ஒப்படைக்கும் முன் இந்த எளிய படிகளைச் செய்யுங்கள்",
      checklistProgress: "பாதுகாப்பு முன்னேற்றம்",
      expandHowTo: "இதை எப்படி செய்வது?",
      riskWarningTitle: "ஏன் இது முக்கியம்:",
      certificateBadge: "சான்றளிக்கப்பட்ட பாதுகாப்பு ரசீது",
      certificateTitle: "தரவு-பாதுகாப்பு பாஸ்போர்ட் சான்றிதழ்",
      certIdLabel: "சான்றிதழ் எண்",
      certDateLabel: "வழங்கப்பட்ட தேதி",
      certDeviceLabel: "சாதன விவரம்",
      certStatusLabel: "பாதுகாப்பு நிலை",
      certStatusVerified: "100% தனிப்பட்ட தரவுகள் பாதுகாப்பாக அழிக்கப்பட்டன",
      certInstruction: "சாதனத்தை கடையில் தரும்போது இந்த QR சான்றிதழைக் காட்டுங்கள்.",
      completeAllWarning: "சான்றிதழைப் பெற அனைத்து பாதுகாப்பு படிகளையும் டிக் செய்யவும்.",
      proceedConnectBtn: "சரிபார்க்கப்பட்ட கூட்டாளர்களைக் காண்க →",

      // Screen 5: Connect + Impact
      screen5Title: "அருகிலுள்ள சேவைகள் & சமூக தாக்கம்",
      screen5Subtitle: "செங்கல்பட்டு மற்றும் சென்னை சுற்றியுள்ள அங்கீகரிக்கப்பட்ட மையங்கள்",
      filterAll: "அனைத்தும்",
      filterRecommended: "உங்களுக்கு பரிந்துரைக்கப்பட்டவை",
      filterRepair: "பழுதுபார்ப்பு மையங்கள்",
      filterRefurbish: "மறுவிற்பனை / புதுப்பித்தல்",
      filterDonate: "நன்கொடை மையங்கள்",
      filterRecycle: "மறுசுழற்சி மையங்கள்",
      urgentNeedTag: "மாணவர் அவசரத் தேவை:",
      bookScheduleBtn: "நேரத்தை முன்பதிவு செய்",
      modalTitle: "சாதன ஒப்படைப்பு முன்பதிவு",
      modalSubtitle: "மையம்:",
      pickupOption: "சேவை முறை",
      modeDropoff: "நேரடி வருகை (Drop-off)",
      modePickup: "வீட்டுக்கே வந்து பெறுதல் (Pickup)",
      dateLabel: "விரும்பும் தேதி",
      timeSlotLabel: "நேர இடைவெளி",
      slotMorning: "காலை (9:30 AM - 1:00 PM)",
      slotAfternoon: "மதியம் (1:00 PM - 5:00 PM)",
      slotEvening: "மாலை (5:00 PM - 8:30 PM)",
      confirmBookingBtn: "முன்பதிவை உறுதி செய்",
      bookingSuccessTitle: "முன்பதிவு வெற்றிகரமாக முடிந்தது!",
      bookingSuccessDesc: "உங்கள் சாதன ஒப்படைப்பு பதிவு செய்யப்பட்டது.",
      bookingIdLabel: "முன்பதிவு எண்",
      closeBtn: "சரி",

      // Impact Dashboard
      impactTitle: "சமூக சுழற்சி தாக்கம்",
      devicesDivertedLabel: "குப்பையிலிருந்து மீட்கப்பட்ட சாதனங்கள்",
      totalSavedLabel: "மக்கள் சேமித்த மொத்த ரூபாய்",
      totalEwasteLabel: "தவிர்க்கப்பட்ட மின்-கழிவு (கிலோ)",
      totalCo2Label: "தவிர்க்கப்பட்ட CO₂ வாயு (கிலோ)",
      resetDemoBtn: "டெமோ புள்ளிவிவரங்களை மீட்டமை",
      startOverBtn: "புதிய சாதனத்தை சோதிக்க 🔄"
    }
  }
};
