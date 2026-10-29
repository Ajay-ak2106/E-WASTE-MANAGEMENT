/**
 * ReLife Passport - Core Application Logic & Screen Flow
 * 
 * Flow:
 * Screen 1: Problem Input (Device, Model, Age, Problem, Power toggle)
 * Screen 2: Result (Animated Second-Life Score, Recommendation)
 * Screen 3: Cost Card (Repair vs New, You Save count-up, Eco impact, Fairness meter)
 * Screen 4: Data-Safety Wizard (Tailored OS checklist, Sealed Handover Certificate + QR)
 * Screen 5: Connect + Impact (Filtered providers, Booking modal, Persistent Impact stats)
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentScreen: 1,
    currentLang: 'en', // 'en' | 'ta'
    deviceType: 'phone', // 'phone' | 'laptop'
    modelId: '',
    ageYears: 3,
    problem: '',
    isWorking: true,
    decision: null,
    checkedSteps: new Set(),
    activeFilter: 'all',
    activeProvider: null,
    certId: null,
    certDate: null,
    impact: loadImpactStats()
  };

  // DOM Element References
  const dom = {
    // Header & Navigation
    backBtn: document.getElementById('back-btn'),
    langToggleBtn: document.getElementById('lang-toggle-btn'),
    progressFill: document.getElementById('progress-fill'),
    progressStepName: document.getElementById('progress-step-name'),
    stepNodes: document.querySelectorAll('.step-node'),
    currentStepNum: document.getElementById('current-step-num'),
    screens: document.querySelectorAll('.screen'),

    // Screen 1: Inputs
    btnTypePhone: document.getElementById('type-phone'),
    btnTypeLaptop: document.getElementById('type-laptop'),
    deviceModelSelect: document.getElementById('device-model'),
    ageSlider: document.getElementById('device-age'),
    ageDisplay: document.getElementById('age-display-badge'),
    problemsContainer: document.getElementById('problems-container'),
    toggleWorkingYes: document.getElementById('toggle-working-yes'),
    toggleWorkingNo: document.getElementById('toggle-working-no'),
    btnDemoExample: document.getElementById('btn-demo-example'),
    btnCalculate: document.getElementById('btn-calculate'),
    inputError: document.getElementById('input-error'),

    // Screen 2: Result
    scoreCircle: document.getElementById('gauge-circle-fill'),
    scoreNumber: document.getElementById('score-number-val'),
    scoreStatusPill: document.getElementById('score-status-pill'),
    scoreExplanation: document.getElementById('score-explanation-text'),
    recCard: document.getElementById('recommendation-card'),
    recBadge: document.getElementById('rec-badge-text'),
    recReason: document.getElementById('rec-reason-text'),
    snapshotModel: document.getElementById('snapshot-model-name'),
    snapshotIssue: document.getElementById('snapshot-issue-name'),
    snapshotAge: document.getElementById('snapshot-age-val'),
    btnGoToEconomics: document.getElementById('btn-go-to-economics'),

    // Screen 3: Economics
    repairCostDisplay: document.getElementById('repair-cost-val'),
    newPriceDisplay: document.getElementById('new-price-val'),
    savingsAmountDisplay: document.getElementById('savings-amount-val'),
    co2Display: document.getElementById('co2-amount-val'),
    ewasteDisplay: document.getElementById('ewaste-amount-val'),
    fairnessMin: document.getElementById('fairness-min-val'),
    fairnessMax: document.getElementById('fairness-max-val'),
    fairnessMaxGuidance: document.getElementById('fairness-max-guidance'),
    fairnessMarker: document.getElementById('fairness-marker'),
    btnGoToSafety: document.getElementById('btn-go-to-safety'),

    // Screen 4: Data Safety
    osBadgeText: document.getElementById('safety-os-badge'),
    checklistProgressText: document.getElementById('checklist-progress-text'),
    checklistFill: document.getElementById('checklist-fill'),
    checklistContainer: document.getElementById('safety-checklist-container'),
    certificateContainer: document.getElementById('certificate-container'),
    certIdDisplay: document.getElementById('cert-id-val'),
    certDateDisplay: document.getElementById('cert-date-val'),
    certDeviceDisplay: document.getElementById('cert-device-val'),
    qrcodeContainer: document.getElementById('qrcode-container'),
    btnGoToConnect: document.getElementById('btn-go-to-connect'),

    // Screen 5: Connect & Impact
    filterPills: document.querySelectorAll('.filter-pill'),
    providersContainer: document.getElementById('providers-container'),
    impactDiverted: document.getElementById('impact-diverted-val'),
    impactSaved: document.getElementById('impact-saved-val'),
    impactEwaste: document.getElementById('impact-ewaste-val'),
    impactCo2: document.getElementById('impact-co2-val'),
    btnResetImpact: document.getElementById('btn-reset-impact'),
    btnStartOver: document.getElementById('btn-start-over'),

    // Modal
    bookingModal: document.getElementById('booking-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalProviderName: document.getElementById('modal-provider-name'),
    modalBookingForm: document.getElementById('modal-booking-form'),
    modalSuccessView: document.getElementById('modal-success-view'),
    modalBookingDate: document.getElementById('modal-booking-date'),
    modalBookingSlots: document.querySelectorAll('.slot-radio-card'),
    btnConfirmBooking: document.getElementById('btn-confirm-booking'),
    modalBookingRef: document.getElementById('modal-booking-ref'),
    modalDoneBtn: document.getElementById('modal-done-btn'),

    // Toast
    toast: document.getElementById('toast-notice')
  };

  /**
   * Initialize Application
   */
  function init() {
    setupEventListeners();
    populateModelDropdown();
    renderProblemCards();
    updateProgressUI();
    renderImpactDashboard();
    updateLanguageTexts();
  }

  // ===================================================================
  // DECISION LOGIC (Required Hackathon Algorithm)
  // ===================================================================
  /**
   * Evaluates device health, repair cost ratio, and age to determine
   * the optimal circular action: Repair, Sell / Refurbish, Donate, or Recycle.
   */
  function decide(device, problemKey, ageYears, isWorking) {
    const repairInfo = device.repairs[problemKey] || { cost: 1500, fairMin: 1000, fairMax: 2000 };
    const repairCost = repairInfo.cost;
    const newPrice = device.newPrice;
    const ratio = repairCost / newPrice;

    let action = '';
    let reasonEn = '';
    let reasonTa = '';

    if (!isWorking && ratio > 0.7) {
      action = 'Recycle';
      reasonEn = 'Repair cost exceeds 70% of device value and hardware is unpowered. Responsible zero-landfill e-waste recycling recovers rare metals.';
      reasonTa = 'பழுதுபார்ப்பு செலவு சாதன விலையில் 70%-க்கு மேல் உள்ளது மற்றும் சாதனம் ஆன் ஆகவில்லை. பொறுப்பான மின்-கழிவு மறுசுழற்சி மூலம் அரிய உலோகங்கள் மீட்கப்படும்.';
    } else if (ratio < 0.4 && ageYears < 5) {
      action = 'Repair';
      reasonEn = 'High-value economical repair under 40% of replacement cost. Extends primary device life by 2-3 years.';
      reasonTa = 'புதிய விலையில் 40% கீழ் சிக்கனமான பழுதுபார்ப்பு. சாதனத்தின் பயனுள்ள ஆயுளை மேலும் 2-3 ஆண்டுகள் நீட்டிக்கும்.';
    } else if (isWorking && ageYears < 8) {
      action = 'Sell / Refurbish';
      reasonEn = 'Device powers on with viable secondary market demand. Refurbishment or trade-in maximizes cash recovery.';
      reasonTa = 'சாதனம் செயல்படுகிறது மற்றும் இரண்டாம் நிலை சந்தையில் தேவை உள்ளது. மறுவிற்பனை அல்லது புதுப்பித்தல் மூலம் நல்ல பண மதிப்பு கிடைக்கும்.';
    } else {
      action = 'Donate';
      reasonEn = 'Ideal for donation to schools or learning centers where functional digital access empowers underprivileged students.';
      reasonTa = 'பள்ளிகள் அல்லது மாணவர் கல்விக்கு நன்கொடை அளிக்க ஏற்றது. எளிய டிஜிட்டல் கற்றலுக்கு பெரும் உதவியாக இருக்கும்.';
    }

    const saved = Math.max(0, newPrice - repairCost);
    // Score algorithm: clamp(round(100 - ratio*60 - ageYears*4), 5, 100)
    const rawScore = 100 - (ratio * 60) - (ageYears * 4);
    const score = Math.min(100, Math.max(5, Math.round(rawScore)));

    const isPhone = device.type === 'phone';
    const co2 = isPhone ? 60 : 200; // kg CO2 avoided
    const ewaste = isPhone ? 0.2 : 2.5; // kg toxic e-waste avoided

    return {
      device,
      problemKey,
      action, // 'Repair' | 'Sell / Refurbish' | 'Donate' | 'Recycle'
      repairCost,
      newPrice,
      saved,
      score,
      co2,
      ewaste,
      reasonEn,
      reasonTa,
      fairMin: repairInfo.fairMin,
      fairMax: repairInfo.fairMax
    };
  }

  // ===================================================================
  // SCREEN TRANSITIONS & PROGRESS BAR
  // ===================================================================
  function goToScreen(screenNumber) {
    if (screenNumber < 1 || screenNumber > 5) return;
    state.currentScreen = screenNumber;

    // Show / Hide Screen containers
    dom.screens.forEach((screenEl) => {
      const scrNum = parseInt(screenEl.dataset.screen, 10);
      if (scrNum === screenNumber) {
        screenEl.classList.add('active');
      } else {
        screenEl.classList.remove('active');
      }
    });

    // Back button visibility
    if (screenNumber > 1) {
      dom.backBtn.classList.add('visible');
    } else {
      dom.backBtn.classList.remove('visible');
    }

    // Update Progress Nodes & Fill line
    updateProgressUI();

    // Scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const viewport = document.querySelector('.screens-viewport');
    if (viewport) viewport.scrollTop = 0;

    // Screen-specific triggers
    if (screenNumber === 2 && state.decision) {
      renderScreen2();
    } else if (screenNumber === 3 && state.decision) {
      renderScreen3();
    } else if (screenNumber === 4 && state.decision) {
      renderScreen4();
    } else if (screenNumber === 5) {
      renderScreen5();
    }
  }

  function updateProgressUI() {
    const stepCount = 5;
    if (dom.currentStepNum) dom.currentStepNum.textContent = state.currentScreen;
    const progressPercent = ((state.currentScreen - 1) / (stepCount - 1)) * 100;
    dom.progressFill.style.width = `${progressPercent}%`;

    dom.stepNodes.forEach((node, idx) => {
      const stepIdx = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepIdx < state.currentScreen) {
        node.classList.add('completed');
        node.innerHTML = '✓';
      } else if (stepIdx === state.currentScreen) {
        node.classList.add('active');
        node.textContent = stepIdx;
      } else {
        node.textContent = stepIdx;
      }
    });

    const t = RELIFE_DATA.translations[state.currentLang];
    const stepNames = t.progressSteps || ['Diagnose', 'Score', 'Economics', 'Data Safety', 'Connect'];
    dom.progressStepName.textContent = stepNames[state.currentScreen - 1] || '';
  }

  // ===================================================================
  // SCREEN 1: INPUT HANDLING & PRESETS
  // ===================================================================
  function populateModelDropdown() {
    const filteredDevices = RELIFE_DATA.devices.filter(d => d.type === state.deviceType);
    const t = RELIFE_DATA.translations[state.currentLang];

    dom.deviceModelSelect.innerHTML = `<option value="">${t.modelPlaceholder}</option>`;
    filteredDevices.forEach(device => {
      const option = document.createElement('option');
      option.value = device.id;
      option.textContent = `${device.name} (₹${formatINR(device.newPrice)})`;
      dom.deviceModelSelect.appendChild(option);
    });

    if (state.modelId) {
      dom.deviceModelSelect.value = state.modelId;
    }
  }

  function renderProblemCards() {
    const t = RELIFE_DATA.translations[state.currentLang];
    const problemKeys = [
      { key: 'cracked_screen', icon: '📱' },
      { key: 'battery_drains', icon: '🔋' },
      { key: 'wont_charge', icon: '⚡' },
      { key: 'slow_perf', icon: '🐢' },
      { key: 'water_damage', icon: '💧' }
    ];

    dom.problemsContainer.innerHTML = '';
    problemKeys.forEach(prob => {
      const title = t[prob.key] || prob.key;
      const desc = t[`${prob.key}_desc`] || '';
      const isSelected = state.problem === prob.key;

      const card = document.createElement('div');
      card.className = `problem-card ${isSelected ? 'selected' : ''}`;
      card.dataset.problemKey = prob.key;
      card.innerHTML = `
        <div class="problem-icon-box">${prob.icon}</div>
        <div class="problem-info">
          <h4>${title}</h4>
          <p>${desc}</p>
        </div>
        <div class="problem-radio-indicator"></div>
      `;

      card.addEventListener('click', () => {
        state.problem = prob.key;
        hideInputError();
        document.querySelectorAll('.problem-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });

      dom.problemsContainer.appendChild(card);
    });
  }

  function updateAgeDisplay() {
    const t = RELIFE_DATA.translations[state.currentLang];
    if (state.ageYears === 0) {
      dom.ageDisplay.textContent = t.ageNewText;
    } else {
      dom.ageDisplay.textContent = `${state.ageYears} ${t.ageYearsText}`;
    }
  }

  function showInputError(message) {
    dom.inputError.textContent = message;
    dom.inputError.style.display = 'flex';
  }

  function hideInputError() {
    dom.inputError.style.display = 'none';
  }

  // Pre-fill Demo Example: Redmi Note 11 + battery drains + 3 years + turns on
  function applyDemoPreset() {
    state.deviceType = 'phone';
    dom.btnTypePhone.classList.add('active');
    dom.btnTypeLaptop.classList.remove('active');
    populateModelDropdown();

    state.modelId = 'redmi_note_11';
    dom.deviceModelSelect.value = 'redmi_note_11';

    state.ageYears = 3;
    dom.ageSlider.value = '3';
    updateAgeDisplay();

    state.problem = 'battery_drains';
    renderProblemCards();

    state.isWorking = true;
    dom.toggleWorkingYes.classList.add('active');
    dom.toggleWorkingNo.classList.remove('active');

    hideInputError();
    showToast(state.currentLang === 'ta' ? 'ரெட்மி நோட் 11 டெமோ ஏற்றப்பட்டது!' : 'Demo Loaded: Redmi Note 11 + Battery Issue');
  }

  // Calculate Button on Screen 1
  function handleCalculate() {
    const t = RELIFE_DATA.translations[state.currentLang];
    if (!state.modelId) {
      showInputError(t.errSelectModel);
      dom.deviceModelSelect.focus();
      return;
    }
    if (!state.problem) {
      showInputError(t.errSelectProblem);
      return;
    }

    hideInputError();
    const device = RELIFE_DATA.devices.find(d => d.id === state.modelId);
    if (!device) return;

    state.decision = decide(device, state.problem, state.ageYears, state.isWorking);
    goToScreen(2);
  }

  // ===================================================================
  // SCREEN 2: RESULT & ANIMATED SCORE
  // ===================================================================
  function renderScreen2() {
    const d = state.decision;
    if (!d) return;
    const t = RELIFE_DATA.translations[state.currentLang];

    // Snapshot Info
    dom.snapshotModel.textContent = d.device.name;
    dom.snapshotIssue.textContent = t[d.problemKey] || d.problemKey;
    dom.snapshotAge.textContent = `${state.ageYears} ${t.ageYearsText}`;

    // Score Circle Animation
    const score = d.score;
    const circumference = 377; // 2 * PI * 60
    const offset = circumference - (score / 100) * circumference;

    let strokeColor = '#10B981'; // Green
    let statusText = t.scoreExplanationHigh;
    let statusBg = '#ECFDF5';
    let statusColor = '#065F46';

    if (score < 40) {
      strokeColor = '#EF4444'; // Red
      statusText = t.scoreExplanationLow;
      statusBg = '#FEE2E2';
      statusColor = '#991B1B';
    } else if (score < 70) {
      strokeColor = '#F59E0B'; // Amber
      statusText = t.scoreExplanationMid;
      statusBg = '#FEF3C7';
      statusColor = '#92400E';
    }

    dom.scoreCircle.style.stroke = strokeColor;
    dom.scoreCircle.style.strokeDasharray = circumference;
    // Trigger animation via timeout
    setTimeout(() => {
      dom.scoreCircle.style.strokeDashoffset = offset;
    }, 50);

    animateValue(dom.scoreNumber, 0, score, 1100);

    dom.scoreStatusPill.textContent = `${score}/100 Viability`;
    dom.scoreStatusPill.style.background = statusBg;
    dom.scoreStatusPill.style.color = statusColor;
    dom.scoreExplanation.textContent = statusText;

    // Recommendation Badge
    let recClass = 'repair';
    let recActionName = t.actionRepair;
    let recIcon = '🛠️';

    if (d.action === 'Sell / Refurbish') {
      recClass = 'sell';
      recActionName = t.actionSell;
      recIcon = '💰';
    } else if (d.action === 'Donate') {
      recClass = 'donate';
      recActionName = t.actionDonate;
      recIcon = '🎓';
    } else if (d.action === 'Recycle') {
      recClass = 'recycle';
      recActionName = t.actionRecycle;
      recIcon = '♻️';
    }

    dom.recCard.className = `recommendation-card ${recClass}`;
    dom.recBadge.innerHTML = `${recIcon} ${recActionName}`;
    dom.recReason.textContent = state.currentLang === 'ta' ? d.reasonTa : d.reasonEn;
  }

  // ===================================================================
  // SCREEN 3: ECONOMICS, FAIRNESS METER & SAVINGS
  // ===================================================================
  function renderScreen3() {
    const d = state.decision;
    if (!d) return;

    dom.repairCostDisplay.textContent = `₹${formatINR(d.repairCost)}`;
    dom.newPriceDisplay.textContent = `₹${formatINR(d.newPrice)}`;

    // Largest text: You save ₹X with count-up animation
    animateValue(dom.savingsAmountDisplay, 0, d.saved, 1200, (val) => `₹${formatINR(val)}`);

    // Eco stats
    dom.co2Display.textContent = `${d.co2} kg`;
    dom.ewasteDisplay.textContent = `${d.ewaste} kg`;

    // Price Fairness Meter
    dom.fairnessMin.textContent = `₹${formatINR(d.fairMin)}`;
    dom.fairnessMax.textContent = `₹${formatINR(d.fairMax)}`;
    dom.fairnessMaxGuidance.textContent = `₹${formatINR(d.fairMax)}`;

    // Position marker between min and max (with padding clamp)
    const range = Math.max(1, d.fairMax - d.fairMin);
    const positionPercent = Math.min(95, Math.max(5, ((d.repairCost - d.fairMin) / range) * 100));
    dom.fairnessMarker.style.left = `${positionPercent}%`;
  }

  // ===================================================================
  // SCREEN 4: DATA-SAFETY WIZARD & SEALED CERTIFICATE
  // ===================================================================
  function renderScreen4() {
    const d = state.decision;
    if (!d) return;

    const deviceOS = d.device.os || 'android';
    const osTitle = deviceOS === 'iphone' ? 'Apple iOS' : (deviceOS === 'windows' ? 'Windows Laptop' : 'Android OS');
    dom.osBadgeText.textContent = `🔒 Tailored for ${osTitle}`;

    const checklist = RELIFE_DATA.safetyChecklists[deviceOS] || RELIFE_DATA.safetyChecklists.android;
    dom.checklistContainer.innerHTML = '';

    checklist.forEach((item, index) => {
      const isChecked = state.checkedSteps.has(item.id);
      const isExpanded = index === 0 && !isChecked; // expand first item by default for demonstration

      const itemCard = document.createElement('div');
      itemCard.className = `cl-item ${isChecked ? 'checked' : ''} ${isExpanded ? 'expanded' : ''}`;
      itemCard.id = `cl-item-${item.id}`;

      itemCard.innerHTML = `
        <div class="cl-item-header" data-id="${item.id}">
          <div class="cl-checkbox">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1.5 5L5 8.5L12.5 1" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="cl-text-block">
            <h4 class="cl-item-title">${item.title}</h4>
            <p class="cl-item-short">${item.shortDesc}</p>
          </div>
          <button class="cl-expand-toggle" aria-label="Toggle details">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        <div class="cl-item-body">
          <div class="cl-howto-box">
            <strong>Action Steps:</strong>
            ${item.howTo}
          </div>
          <div class="cl-risk-box">
            <strong>⚠️ Why this matters:</strong> ${item.riskTip}
          </div>
        </div>
      `;

      // Header click toggles check
      const header = itemCard.querySelector('.cl-item-header');
      header.addEventListener('click', (e) => {
        // If clicking chevron, toggle accordion expansion instead
        if (e.target.closest('.cl-expand-toggle')) {
          itemCard.classList.toggle('expanded');
          return;
        }

        // Toggle checkbox state
        if (state.checkedSteps.has(item.id)) {
          state.checkedSteps.delete(item.id);
          itemCard.classList.remove('checked');
        } else {
          state.checkedSteps.add(item.id);
          itemCard.classList.add('checked');
        }
        updateChecklistProgress(checklist);
      });

      dom.checklistContainer.appendChild(itemCard);
    });

    updateChecklistProgress(checklist);
  }

  function updateChecklistProgress(checklist) {
    const total = checklist.length;
    const done = state.checkedSteps.size;
    const percent = Math.round((done / total) * 100);

    dom.checklistProgressText.textContent = `${done}/${total} Completed (${percent}%)`;
    dom.checklistFill.style.width = `${percent}%`;

    if (done === total) {
      showDataSafeCertificate();
    } else {
      dom.certificateContainer.style.display = 'none';
    }
  }

  function showDataSafeCertificate() {
    if (!state.certId) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      state.certId = `RLP-2026-${randomCode}`;
      state.certDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    dom.certIdDisplay.textContent = state.certId;
    dom.certDateDisplay.textContent = state.certDate;
    dom.certDeviceDisplay.textContent = state.decision ? state.decision.device.name : 'Verified Device';

    dom.certificateContainer.style.display = 'block';

    // Generate QR Code
    generateQRCode(state.certId);
  }

  function generateQRCode(certCode) {
    dom.qrcodeContainer.innerHTML = '';
    const payload = `https://relife-passport.vercel.app/verify?cert=${certCode}&device=${encodeURIComponent(state.decision.device.name)}`;

    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(dom.qrcodeContainer, {
          text: payload,
          width: 74,
          height: 74,
          colorDark: '#0F172A',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });
        return;
      } catch (err) {
        console.warn('QRCode library render issue, using SVG fallback', err);
      }
    }

    // High quality inline SVG QR Code fallback
    dom.qrcodeContainer.innerHTML = `
      <svg width="74" height="74" viewBox="0 0 100 100" fill="#0F172A" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <!-- Top Left Finder Pattern -->
        <rect x="10" y="10" width="28" height="28" fill="#1B8A5A"/>
        <rect x="16" y="16" width="16" height="16" fill="white"/>
        <rect x="20" y="20" width="8" height="8" fill="#1B8A5A"/>
        <!-- Top Right Finder Pattern -->
        <rect x="62" y="10" width="28" height="28" fill="#1B8A5A"/>
        <rect x="68" y="16" width="16" height="16" fill="white"/>
        <rect x="72" y="20" width="8" height="8" fill="#1B8A5A"/>
        <!-- Bottom Left Finder Pattern -->
        <rect x="10" y="62" width="28" height="28" fill="#1B8A5A"/>
        <rect x="16" y="68" width="16" height="16" fill="white"/>
        <rect x="20" y="72" width="8" height="8" fill="#1B8A5A"/>
        <!-- Dynamic Data Blocks -->
        <rect x="44" y="12" width="8" height="8" fill="#0F172A"/>
        <rect x="44" y="28" width="8" height="8" fill="#0F172A"/>
        <rect x="12" y="44" width="8" height="8" fill="#0F172A"/>
        <rect x="28" y="44" width="8" height="8" fill="#0F172A"/>
        <rect x="44" y="44" width="12" height="12" fill="#1B8A5A"/>
        <rect x="62" y="44" width="8" height="8" fill="#0F172A"/>
        <rect x="76" y="44" width="8" height="8" fill="#0F172A"/>
        <rect x="44" y="62" width="8" height="8" fill="#0F172A"/>
        <rect x="62" y="62" width="8" height="8" fill="#0F172A"/>
        <rect x="76" y="76" width="8" height="8" fill="#0F172A"/>
        <rect x="62" y="76" width="8" height="8" fill="#0F172A"/>
        <rect x="44" y="76" width="8" height="8" fill="#0F172A"/>
      </svg>
    `;
  }

  // ===================================================================
  // SCREEN 5: PROVIDERS, BOOKING MODAL & IMPACT DASHBOARD
  // ===================================================================
  function renderScreen5() {
    // If we have a recommendation, sync default filter
    if (state.decision) {
      const act = state.decision.action;
      if (act === 'Repair') state.activeFilter = 'repair';
      else if (act === 'Sell / Refurbish') state.activeFilter = 'refurbish';
      else if (act === 'Donate') state.activeFilter = 'donate';
      else if (act === 'Recycle') state.activeFilter = 'recycle';
    }

    // Highlight active filter pill
    dom.filterPills.forEach(pill => {
      if (pill.dataset.filter === state.activeFilter) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    renderProvidersList();
    renderImpactDashboard();
  }

  function renderProvidersList() {
    const filter = state.activeFilter;
    const providers = RELIFE_DATA.providers.filter(p => {
      if (filter === 'all') return true;
      return p.type === filter;
    });

    const t = RELIFE_DATA.translations[state.currentLang];
    dom.providersContainer.innerHTML = '';

    if (providers.length === 0) {
      dom.providersContainer.innerHTML = `<p style="text-align: center; color: #64748B; font-size: 13px; padding: 20px;">No partners found for this category.</p>`;
      return;
    }

    providers.forEach(p => {
      const card = document.createElement('div');
      card.className = 'provider-card';

      let badgesHtml = '';
      if (p.badges && p.badges.length > 0) {
        badgesHtml = `
          <div class="provider-badges-wrap">
            ${p.badges.map(b => `<span class="trust-badge-pill">🛡️ ${b}</span>`).join('')}
          </div>
        `;
      }

      let urgentNeedHtml = '';
      if (p.urgentNeed) {
        urgentNeedHtml = `
          <div class="urgent-need-card">
            📢 <strong>${t.urgentNeedTag}</strong> ${p.urgentNeed}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="provider-top">
          <div class="provider-name-box">
            <h4>${p.name}</h4>
            <div class="provider-loc">📍 ${p.area}</div>
          </div>
          <span class="provider-dist-badge">${p.distance} km</span>
        </div>
        <div class="provider-rating-row">
          <span class="rating-stars">★ ${p.rating}</span>
          <span class="rating-count">(${p.reviewsCount} reviews)</span>
        </div>
        ${urgentNeedHtml}
        ${badgesHtml}
        <button class="provider-book-btn" data-id="${p.id}">
          📅 ${t.bookScheduleBtn}
        </button>
      `;

      card.querySelector('.provider-book-btn').addEventListener('click', () => {
        openBookingModal(p);
      });

      dom.providersContainer.appendChild(card);
    });
  }

  function openBookingModal(provider) {
    state.activeProvider = provider;
    dom.modalProviderName.textContent = `${provider.name} (${provider.area})`;
    dom.modalBookingForm.style.display = 'block';
    dom.modalSuccessView.style.display = 'none';

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dom.modalBookingDate.value = tomorrow.toISOString().split('T')[0];
    dom.modalBookingDate.min = new Date().toISOString().split('T')[0];

    dom.bookingModal.classList.add('active');
  }

  function closeBookingModal() {
    dom.bookingModal.classList.remove('active');
    state.activeProvider = null;
  }

  function handleBookingConfirm() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BK-CHEN-${randomNum}`;
    dom.modalBookingRef.textContent = bookingId;

    // Transition to success inside modal
    dom.modalBookingForm.style.display = 'none';
    dom.modalSuccessView.style.display = 'block';

    // Increment Community Impact
    const savedAmount = state.decision ? state.decision.saved : 12599;
    const ewasteKg = state.decision ? state.decision.ewaste : 0.2;
    const co2Kg = state.decision ? state.decision.co2 : 60;

    incrementImpactStats({
      devices: 1,
      saved: savedAmount,
      ewaste: ewasteKg,
      co2: co2Kg
    });

    renderImpactDashboard();
    showToast(state.currentLang === 'ta' ? 'முன்பதிவு உறுதியானது! சமூக தாக்கம் புதுப்பிக்கப்பட்டது.' : 'Booking Confirmed! Circular impact recorded.');
  }

  // ===================================================================
  // IMPACT DASHBOARD (LocalStorage Persistence)
  // ===================================================================
  function loadImpactStats() {
    const defaultStats = {
      devicesDiverted: 142,
      totalSaved: 845000,
      ewasteAvoided: 84.5,
      co2Avoided: 12400
    };

    try {
      const saved = localStorage.getItem('relife_impact_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
    return defaultStats;
  }

  function saveImpactStats(stats) {
    try {
      localStorage.setItem('relife_impact_stats', JSON.stringify(stats));
    } catch (e) {
      console.warn('Unable to save to localStorage', e);
    }
  }

  function incrementImpactStats({ devices, saved, ewaste, co2 }) {
    state.impact.devicesDiverted += devices;
    state.impact.totalSaved += saved;
    state.impact.ewasteAvoided = parseFloat((state.impact.ewasteAvoided + ewaste).toFixed(1));
    state.impact.co2Avoided = parseFloat((state.impact.co2Avoided + co2).toFixed(1));
    saveImpactStats(state.impact);
  }

  function resetImpactStats() {
    const defaultStats = {
      devicesDiverted: 142,
      totalSaved: 845000,
      ewasteAvoided: 84.5,
      co2Avoided: 12400
    };
    state.impact = defaultStats;
    saveImpactStats(defaultStats);
    renderImpactDashboard();
    showToast(state.currentLang === 'ta' ? 'புள்ளிவிவரங்கள் மீட்டமைக்கப்பட்டன' : 'Impact stats restored to baseline');
  }

  function renderImpactDashboard() {
    dom.impactDiverted.textContent = `${state.impact.devicesDiverted}`;
    dom.impactSaved.textContent = `₹${formatINR(state.impact.totalSaved)}`;
    dom.impactEwaste.textContent = `${state.impact.ewasteAvoided} kg`;
    dom.impactCo2.textContent = `${state.impact.co2Avoided} kg`;
  }

  // ===================================================================
  // BILINGUAL TRANSLATION HANDLER
  // ===================================================================
  function toggleLanguage() {
    state.currentLang = state.currentLang === 'en' ? 'ta' : 'en';
    updateLanguageTexts();
    populateModelDropdown();
    renderProblemCards();
    updateAgeDisplay();
    updateProgressUI();

    if (state.currentScreen === 2) renderScreen2();
    if (state.currentScreen === 3) renderScreen3();
    if (state.currentScreen === 4) renderScreen4();
    if (state.currentScreen === 5) renderProvidersList();
  }

  function updateLanguageTexts() {
    const t = RELIFE_DATA.translations[state.currentLang];
    dom.langToggleBtn.textContent = t.langSwitch;

    // Data-i18n Attribute Binding
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Device category segmented buttons
    dom.btnTypePhone.querySelector('.segment-label').textContent = t.phone;
    dom.btnTypeLaptop.querySelector('.segment-label').textContent = t.laptop;

    // Power toggle pills
    dom.toggleWorkingYes.textContent = t.yes;
    dom.toggleWorkingNo.textContent = t.no;
  }

  // ===================================================================
  // UTILITIES & EVENT LISTENERS
  // ===================================================================
  function setupEventListeners() {
    // Header
    dom.backBtn.addEventListener('click', () => {
      goToScreen(state.currentScreen - 1);
    });

    dom.langToggleBtn.addEventListener('click', toggleLanguage);

    // Screen 1: Device Type Selector
    dom.btnTypePhone.addEventListener('click', () => {
      state.deviceType = 'phone';
      dom.btnTypePhone.classList.add('active');
      dom.btnTypeLaptop.classList.remove('active');
      state.modelId = '';
      populateModelDropdown();
    });

    dom.btnTypeLaptop.addEventListener('click', () => {
      state.deviceType = 'laptop';
      dom.btnTypeLaptop.classList.add('active');
      dom.btnTypePhone.classList.remove('active');
      state.modelId = '';
      populateModelDropdown();
    });

    dom.deviceModelSelect.addEventListener('change', (e) => {
      state.modelId = e.target.value;
      hideInputError();
    });

    dom.ageSlider.addEventListener('input', (e) => {
      state.ageYears = parseInt(e.target.value, 10);
      updateAgeDisplay();
    });

    dom.toggleWorkingYes.addEventListener('click', () => {
      state.isWorking = true;
      dom.toggleWorkingYes.classList.add('active');
      dom.toggleWorkingNo.classList.remove('active');
    });

    dom.toggleWorkingNo.addEventListener('click', () => {
      state.isWorking = false;
      dom.toggleWorkingNo.classList.add('active');
      dom.toggleWorkingYes.classList.remove('active');
    });

    dom.btnDemoExample.addEventListener('click', applyDemoPreset);
    dom.btnCalculate.addEventListener('click', handleCalculate);

    // Screen 2 -> Screen 3
    dom.btnGoToEconomics.addEventListener('click', () => goToScreen(3));

    // Screen 3 -> Screen 4
    dom.btnGoToSafety.addEventListener('click', () => goToScreen(4));

    // Screen 4 -> Screen 5
    dom.btnGoToConnect.addEventListener('click', () => goToScreen(5));

    // Screen 5 Filter Tabs
    dom.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        state.activeFilter = pill.dataset.filter;
        dom.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderProvidersList();
      });
    });

    // Reset stats & restart assessment
    dom.btnResetImpact.addEventListener('click', resetImpactStats);
    dom.btnStartOver.addEventListener('click', () => {
      state.checkedSteps.clear();
      state.decision = null;
      state.certId = null;
      state.certDate = null;
      goToScreen(1);
    });

    // Modal Mode Segmented Buttons
    const modeDropoff = document.getElementById('mode-dropoff');
    const modePickup = document.getElementById('mode-pickup');
    if (modeDropoff && modePickup) {
      modeDropoff.addEventListener('click', () => {
        modeDropoff.classList.add('active');
        modePickup.classList.remove('active');
      });
      modePickup.addEventListener('click', () => {
        modePickup.classList.add('active');
        modeDropoff.classList.remove('active');
      });
    }

    // Modal Events
    dom.modalCloseBtn.addEventListener('click', closeBookingModal);
    dom.modalDoneBtn.addEventListener('click', closeBookingModal);
    dom.bookingModal.addEventListener('click', (e) => {
      if (e.target === dom.bookingModal) closeBookingModal();
    });

    dom.modalBookingSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        dom.modalBookingSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });

    dom.btnConfirmBooking.addEventListener('click', handleBookingConfirm);
  }

  function formatINR(number) {
    if (isNaN(number)) return '0';
    return Number(number).toLocaleString('en-IN');
  }

  function animateValue(element, start, end, duration, formatter) {
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easedProgress);

      element.textContent = formatter ? formatter(current) : current;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('show');
    setTimeout(() => {
      dom.toast.classList.remove('show');
    }, 2800);
  }

  // Self-start on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
