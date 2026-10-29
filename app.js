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
    previousScreen: 1,
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
    impact: loadImpactStats(),

    // Component Rescue State
    rescuePool: loadRescuePool(),
    currentRescueTab: 'have', // 'have' | 'need' | 'pool'
    selectedPartCondition: 'Tested - Working',
    currentPartPhoto: null,
    partPricingMode: 'free',
    batterySwellingReported: false,
    selectedPoolCategory: 'all',
    selectedPartForRequest: null
  };

  // DOM Element References
  const dom = {
    // Header & Navigation
    backBtn: document.getElementById('back-btn'),
    langToggleBtn: document.getElementById('lang-toggle-btn'),
    navRescueBtn: document.getElementById('nav-rescue-btn'),
    progressContainer: document.querySelector('.progress-container'),
    progressFill: document.getElementById('progress-fill'),
    progressStepName: document.getElementById('progress-step-name'),
    stepNodes: document.querySelectorAll('.step-node'),
    currentStepNum: document.getElementById('current-step-num'),
    screens: document.querySelectorAll('.screen'),
    screenRescue: document.getElementById('screen-rescue'),

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
    resultRescueCard: document.getElementById('result-rescue-card'),
    btnResultToRescue: document.getElementById('btn-result-to-rescue'),
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
    connectRescueTeaser: document.getElementById('connect-rescue-teaser'),
    teaserPartsCount: document.getElementById('teaser-parts-count'),
    btnTeaserToRescue: document.getElementById('btn-teaser-to-rescue'),
    filterPills: document.querySelectorAll('.filter-pill'),
    providersContainer: document.getElementById('providers-container'),
    impactDiverted: document.getElementById('impact-diverted-val'),
    impactSaved: document.getElementById('impact-saved-val'),
    impactParts: document.getElementById('impact-parts-val'),
    impactRepairerSaved: document.getElementById('impact-repairer-saved-val'),
    impactEwaste: document.getElementById('impact-ewaste-val'),
    impactCo2: document.getElementById('impact-co2-val'),
    btnResetImpact: document.getElementById('btn-reset-impact'),
    btnStartOver: document.getElementById('btn-start-over'),

    // Component Rescue Screen Elements
    btnBackToFlow: document.getElementById('btn-back-to-flow'),
    tabBtnHave: document.getElementById('tab-btn-have'),
    tabBtnNeed: document.getElementById('tab-btn-need'),
    tabBtnPool: document.getElementById('tab-btn-pool'),
    viewHaveParts: document.getElementById('view-have-parts'),
    viewNeedParts: document.getElementById('view-need-parts'),
    viewBrowsePool: document.getElementById('view-browse-pool'),
    rescueFormError: document.getElementById('rescue-form-error'),

    // Tab 1 Elements
    partSourceDevice: document.getElementById('part-source-device'),
    partComponentType: document.getElementById('part-component-type'),
    partSpec: document.getElementById('part-spec'),
    condWorking: document.getElementById('cond-working'),
    condMinorWear: document.getElementById('cond-minor-wear'),
    partCheckTested: document.getElementById('part-check-tested'),
    partCheckPhoto: document.getElementById('part-check-photo'),
    partPhotoFile: document.getElementById('part-photo-file'),
    partPhotoPreview: document.getElementById('part-photo-preview'),
    partPreviewImg: document.getElementById('part-preview-img'),
    btnRemovePhoto: document.getElementById('btn-remove-photo'),
    btnPriceFree: document.getElementById('btn-price-free'),
    btnPriceFixed: document.getElementById('btn-price-fixed'),
    fixedPriceWrap: document.getElementById('fixed-price-wrap'),
    partPriceInput: document.getElementById('part-price-input'),
    partLocationInput: document.getElementById('part-location-input'),
    batterySafetyPanel: document.getElementById('battery-safety-panel'),
    btnSwellingNo: document.getElementById('btn-swelling-no'),
    btnSwellingYes: document.getElementById('btn-swelling-yes'),
    batterySwollenBlock: document.getElementById('battery-swollen-block'),
    btnRouteRecycle: document.getElementById('btn-route-recycle'),
    batteryMandatoryChecks: document.getElementById('battery-mandatory-checks'),
    batteryCheck1: document.getElementById('battery-check-1'),
    batteryCheck2: document.getElementById('battery-check-2'),
    batteryCheck3: document.getElementById('battery-check-3'),
    batteryCheck4: document.getElementById('battery-check-4'),
    storageSafetyPanel: document.getElementById('storage-safety-panel'),
    storageWipeCheck: document.getElementById('storage-wipe-check'),
    btnAddPool: document.getElementById('btn-add-to-pool'),

    // Tab 2 Elements
    reqShopName: document.getElementById('req-shop-name'),
    quickShopPills: document.getElementById('quick-shop-pills'),
    reqComponentType: document.getElementById('req-component-type'),
    reqSpec: document.getElementById('req-spec'),
    reqBudget: document.getElementById('req-budget'),
    reqArea: document.getElementById('req-area'),
    urgencyPills: document.querySelectorAll('.urgency-pill'),
    sampleReqChips: document.getElementById('sample-req-chips'),
    btnFindMatches: document.getElementById('btn-find-matches'),
    matchResultsSection: document.getElementById('match-results-section'),
    matchCardsContainer: document.getElementById('match-cards-container'),

    // Tab 3 Elements
    poolSearchInput: document.getElementById('pool-search-input'),
    poolCategoryChips: document.getElementById('pool-category-chips'),
    poolListingsContainer: document.getElementById('pool-listings-container'),

    // Part Request Modal
    partRequestModal: document.getElementById('part-request-modal'),
    partModalCloseBtn: document.getElementById('part-modal-close-btn'),
    partModalItemName: document.getElementById('part-modal-item-name'),
    partRequestDate: document.getElementById('part-request-date'),
    partModalFormView: document.getElementById('part-modal-form-view'),
    partModalSuccessView: document.getElementById('part-modal-success-view'),
    btnConfirmPartRequest: document.getElementById('btn-confirm-part-request'),
    partRequestRef: document.getElementById('part-request-ref'),
    btnPartDone: document.getElementById('btn-part-done'),

    // Provider Booking Modal
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
    initComponentRescue();
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
    if (screenNumber === 'rescue') {
      if (typeof state.currentScreen === 'number') {
        state.previousScreen = state.currentScreen;
      }
      state.currentScreen = 'rescue';
      dom.screens.forEach(s => s.classList.remove('active'));
      if (dom.screenRescue) dom.screenRescue.classList.add('active');
      if (dom.progressContainer) dom.progressContainer.style.display = 'none';
      dom.backBtn.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const viewport = document.querySelector('.screens-viewport');
      if (viewport) viewport.scrollTop = 0;
      switchRescueTab(state.currentRescueTab);
      return;
    }

    if (screenNumber < 1 || screenNumber > 5) return;
    state.currentScreen = screenNumber;

    if (dom.progressContainer) dom.progressContainer.style.display = 'block';

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
    if (typeof state.currentScreen !== 'number') return;
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

    // Entry Point 2: Show Component Rescue card on DONATE or RECYCLE
    if (dom.resultRescueCard) {
      if (d.action === 'Donate' || d.action === 'Recycle') {
        dom.resultRescueCard.style.display = 'block';
      } else {
        dom.resultRescueCard.style.display = 'none';
      }
    }
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

    if (dom.teaserPartsCount) {
      dom.teaserPartsCount.textContent = state.rescuePool.length;
    }

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
      co2Avoided: 12400,
      partsRescued: 38,
      repairerSaved: 54200
    };

    try {
      const saved = localStorage.getItem('relife_impact_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.partsRescued === undefined) parsed.partsRescued = 38;
        if (parsed.repairerSaved === undefined) parsed.repairerSaved = 54200;
        return parsed;
      }
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
      co2Avoided: 12400,
      partsRescued: 38,
      repairerSaved: 54200
    };
    state.impact = defaultStats;
    saveImpactStats(defaultStats);
    state.rescuePool = JSON.parse(JSON.stringify(RELIFE_DATA.seedRescuePool));
    saveRescuePool(state.rescuePool);
    renderImpactDashboard();
    renderPoolListings();
    if (dom.teaserPartsCount) dom.teaserPartsCount.textContent = state.rescuePool.length;
    showToast(state.currentLang === 'ta' ? 'புள்ளிவிவரங்கள் மீட்டமைக்கப்பட்டன' : 'Impact stats & pool restored to baseline');
  }

  function renderImpactDashboard() {
    dom.impactDiverted.textContent = `${state.impact.devicesDiverted}`;
    dom.impactSaved.textContent = `₹${formatINR(state.impact.totalSaved)}`;
    if (dom.impactParts) dom.impactParts.textContent = `${state.impact.partsRescued}`;
    if (dom.impactRepairerSaved) dom.impactRepairerSaved.textContent = `₹${formatINR(state.impact.repairerSaved)}`;
    dom.impactEwaste.textContent = `${state.impact.ewasteAvoided} kg`;
    dom.impactCo2.textContent = `${state.impact.co2Avoided} kg`;
  }

  // ===================================================================
  // COMPONENT RESCUE MATCHER MODULE
  // ===================================================================
  function loadRescuePool() {
    try {
      const saved = localStorage.getItem('relife_rescue_pool');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for rescue pool', e);
    }
    return JSON.parse(JSON.stringify(RELIFE_DATA.seedRescuePool));
  }

  function saveRescuePool(pool) {
    try {
      localStorage.setItem('relife_rescue_pool', JSON.stringify(pool));
    } catch (e) {
      console.warn('Unable to save rescue pool to localStorage', e);
    }
  }

  function initComponentRescue() {
    populateComponentRescueDropdowns();
    renderSampleRepairerChips();
    renderPoolCategoryChips();
    renderPoolListings();
  }

  function openRescueScreen(tab, prefilledDeviceId) {
    if (prefilledDeviceId && dom.partSourceDevice) {
      dom.partSourceDevice.value = prefilledDeviceId;
    }
    goToScreen('rescue');
    if (tab) {
      switchRescueTab(tab);
    }
  }

  function switchRescueTab(tab) {
    state.currentRescueTab = tab;

    [dom.tabBtnHave, dom.tabBtnNeed, dom.tabBtnPool].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    if (tab === 'have' && dom.tabBtnHave) dom.tabBtnHave.classList.add('active');
    if (tab === 'need' && dom.tabBtnNeed) dom.tabBtnNeed.classList.add('active');
    if (tab === 'pool' && dom.tabBtnPool) dom.tabBtnPool.classList.add('active');

    if (dom.viewHaveParts) dom.viewHaveParts.style.display = tab === 'have' ? 'block' : 'none';
    if (dom.viewNeedParts) dom.viewNeedParts.style.display = tab === 'need' ? 'block' : 'none';
    if (dom.viewBrowsePool) dom.viewBrowsePool.style.display = tab === 'pool' ? 'block' : 'none';

    if (tab === 'pool') {
      renderPoolListings();
    }
  }

  function populateComponentRescueDropdowns() {
    const t = RELIFE_DATA.translations[state.currentLang];

    // Source device dropdown
    if (dom.partSourceDevice) {
      const currentVal = dom.partSourceDevice.value;
      dom.partSourceDevice.innerHTML = `<option value="">${t.selectDevicePlaceholder}</option>`;
      RELIFE_DATA.devices.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.name} (${d.type === 'phone' ? t.phone : t.laptop})`;
        dom.partSourceDevice.appendChild(opt);
      });
      if (currentVal) dom.partSourceDevice.value = currentVal;
    }

    // Component Type dropdowns (Tab 1 and Tab 2)
    const populateTypeSelect = (selectEl, placeholderText) => {
      if (!selectEl) return;
      const currentVal = selectEl.value;
      selectEl.innerHTML = `<option value="">${placeholderText}</option>`;
      RELIFE_DATA.componentCategories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        const name = (t.componentTypes && t.componentTypes[cat.id]) || cat.name;
        opt.textContent = `${cat.icon} ${name}`;
        selectEl.appendChild(opt);
      });
      if (currentVal) selectEl.value = currentVal;
    };

    populateTypeSelect(dom.partComponentType, t.selectCompTypePlaceholder);
    populateTypeSelect(dom.reqComponentType, t.selectCompTypePlaceholder);

    // Quick shop provider pills
    if (dom.quickShopPills) {
      dom.quickShopPills.innerHTML = '';
      const repairShops = RELIFE_DATA.providers.filter(p => p.type === 'repair');
      repairShops.forEach(shop => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'pill-choice';
        pill.textContent = shop.name;
        pill.addEventListener('click', () => {
          if (dom.reqShopName) dom.reqShopName.value = shop.name;
          if (dom.reqArea) dom.reqArea.value = shop.area;
          dom.quickShopPills.querySelectorAll('.pill-choice').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        });
        dom.quickShopPills.appendChild(pill);
      });
    }
  }

  function handlePartComponentTypeChange() {
    const compType = dom.partComponentType.value;
    const t = RELIFE_DATA.translations[state.currentLang];

    // Battery Safety Gate
    if (compType === 'battery') {
      if (dom.batterySafetyPanel) dom.batterySafetyPanel.style.display = 'block';
      state.batterySwellingReported = null;
      if (dom.batterySwollenBlock) dom.batterySwollenBlock.style.display = 'none';
      if (dom.batteryMandatoryChecks) dom.batteryMandatoryChecks.style.display = 'none';
      if (dom.btnSwellingNo) dom.btnSwellingNo.classList.remove('active');
      if (dom.btnSwellingYes) dom.btnSwellingYes.classList.remove('active');
      [dom.batteryCheck1, dom.batteryCheck2, dom.batteryCheck3, dom.batteryCheck4].forEach(chk => {
        if (chk) chk.checked = false;
      });
    } else {
      if (dom.batterySafetyPanel) dom.batterySafetyPanel.style.display = 'none';
      if (dom.batterySwollenBlock) dom.batterySwollenBlock.style.display = 'none';
    }

    // Storage Safety Gate (SSD / HDD)
    if (compType === 'ssd' || compType === 'hdd') {
      if (dom.storageSafetyPanel) dom.storageSafetyPanel.style.display = 'block';
      if (dom.storageWipeCheck) dom.storageWipeCheck.checked = false;
    } else {
      if (dom.storageSafetyPanel) dom.storageSafetyPanel.style.display = 'none';
    }

    // Update safety tips box
    const tipsBox = document.getElementById('part-safety-tips-box');
    if (tipsBox) {
      if (compType === 'ram' || compType === 'ssd' || compType === 'motherboard') {
        tipsBox.innerHTML = `🛡️ <strong>Safety protocol:</strong> Ground yourself or wear anti-static wristband before touching sensitive circuit contacts. Keep in anti-static bag.`;
      } else if (compType === 'battery') {
        tipsBox.innerHTML = `⚡ <strong>Battery protocol:</strong> Power off device and disconnect battery connector before removal. Never puncture, bend, or expose to heat. Handover in insulated non-metal packaging.`;
      } else if (compType === 'screen') {
        tipsBox.innerHTML = `📱 <strong>Screen protocol:</strong> Use gentle suction cups and plastic spudgers. Disconnect display ribbon cable without bending flex connectors.`;
      } else {
        tipsBox.innerHTML = `🛡️ <strong>Handling tip:</strong> Always disconnect power before removing internal components. Clean contacts with isopropyl alcohol (99%) if dusty.`;
      }
    }
  }

  function renderSampleRepairerChips() {
    if (!dom.sampleReqChips) return;
    const t = RELIFE_DATA.translations[state.currentLang];
    dom.sampleReqChips.innerHTML = '';

    RELIFE_DATA.sampleRepairerRequests.forEach(req => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'sample-chip';
      const cat = RELIFE_DATA.componentCategories.find(c => c.id === req.componentType);
      const icon = cat ? cat.icon : '🔧';
      chip.innerHTML = `${icon} <strong>${req.shopName}</strong>: ${req.spec} (₹${formatINR(req.maxBudget)})`;
      chip.addEventListener('click', () => {
        if (dom.reqShopName) dom.reqShopName.value = req.shopName;
        if (dom.reqComponentType) dom.reqComponentType.value = req.componentType;
        if (dom.reqSpec) dom.reqSpec.value = req.spec;
        if (dom.reqBudget) dom.reqBudget.value = req.maxBudget;
        if (dom.reqArea) dom.reqArea.value = req.area;

        // Select urgency
        dom.urgencyPills.forEach(p => {
          if (p.dataset.urgency === req.urgency) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });

        // Auto trigger match search for smooth experience!
        handleFindMatches();
      });
      dom.sampleReqChips.appendChild(chip);
    });
  }

  function renderPoolCategoryChips() {
    if (!dom.poolCategoryChips) return;
    const t = RELIFE_DATA.translations[state.currentLang];
    dom.poolCategoryChips.innerHTML = '';

    const allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = `filter-chip ${state.selectedPoolCategory === 'all' ? 'active' : ''}`;
    allChip.textContent = t.allCategories;
    allChip.addEventListener('click', () => {
      state.selectedPoolCategory = 'all';
      renderPoolCategoryChips();
      renderPoolListings();
    });
    dom.poolCategoryChips.appendChild(allChip);

    RELIFE_DATA.componentCategories.forEach(cat => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `filter-chip ${state.selectedPoolCategory === cat.id ? 'active' : ''}`;
      const name = (t.componentTypes && t.componentTypes[cat.id]) || cat.name;
      chip.textContent = `${cat.icon} ${name}`;
      chip.addEventListener('click', () => {
        state.selectedPoolCategory = cat.id;
        renderPoolCategoryChips();
        renderPoolListings();
      });
      dom.poolCategoryChips.appendChild(chip);
    });
  }

  function renderPoolListings() {
    if (!dom.poolListingsContainer) return;
    const t = RELIFE_DATA.translations[state.currentLang];
    const query = (dom.poolSearchInput ? dom.poolSearchInput.value : '').toLowerCase().trim();

    let items = state.rescuePool.filter(item => {
      if (state.selectedPoolCategory !== 'all' && item.componentType !== state.selectedPoolCategory) {
        return false;
      }
      if (query) {
        const text = `${item.spec} ${item.sourceDevice} ${item.area} ${item.componentType}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    dom.poolListingsContainer.innerHTML = '';

    if (items.length === 0) {
      dom.poolListingsContainer.innerHTML = `
        <div class="empty-pool-state" style="text-align: center; padding: 24px 12px; color: #64748B;">
          <p style="font-size: 14px; margin-bottom: 6px;">🔍 ${t.noPartsFound}</p>
          <span style="font-size: 12px;">Try selecting another category or clear the search query.</span>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const cat = RELIFE_DATA.componentCategories.find(c => c.id === item.componentType);
      const icon = cat ? cat.icon : '📦';
      const typeName = (t.componentTypes && t.componentTypes[item.componentType]) || (cat ? cat.name : item.componentType);
      const isFree = item.price === 0;
      const priceText = isFree ? t.freeDonate : `₹${formatINR(item.price)}`;
      const condText = item.condition === 'Tested - Working' ? t.condWorkingLabel : (item.condition === 'Tested - Minor wear' ? t.condMinorWearLabel : item.condition);

      const card = document.createElement('div');
      card.className = 'pool-card';

      let badges = `<span class="badge-tested">✓ ${t.testedBadge}</span>`;
      if (item.safetyChecked || item.componentType === 'battery') {
        badges += ` <span class="badge-safety">⚡ ${t.safetyCheckedBadge}</span>`;
      }
      if (item.verified) {
        badges += ` <span class="badge-verified">🛡️ ${t.verifiedBadge}</span>`;
      }

      let photoHtml = '';
      if (item.photo) {
        photoHtml = `<div class="pool-card-photo"><img src="${item.photo}" alt="${item.spec}"></div>`;
      }

      card.innerHTML = `
        ${photoHtml}
        <div class="pool-card-header">
          <span class="pool-cat-tag">${icon} ${typeName}</span>
          <span class="pool-price-tag ${isFree ? 'free' : ''}">${priceText}</span>
        </div>
        <h4 class="pool-card-spec">${item.spec}</h4>
        <div class="pool-card-meta">
          <span>📱 ${item.sourceDevice}</span>
          <span>📍 ${item.area} (${item.distance || 3.2} km)</span>
          <span class="condition-tag">${condText}</span>
        </div>
        <div class="pool-card-badges">
          ${badges}
        </div>
        <button class="btn-request-part" data-id="${item.id}">
          🤝 ${t.requestPartBtn}
        </button>
      `;

      card.querySelector('.btn-request-part').addEventListener('click', () => {
        openPartRequestModal(item);
      });

      dom.poolListingsContainer.appendChild(card);
    });
  }

  /**
   * Component Rescue Matching Engine
   * Evaluates donor listings against repairer requests and assigns a weighted viability score (out of 100).
   * 
   * Scoring Breakdown:
   * - Spec Similarity: Exact keyword match = 40, Partial keyword match = 20
   * - Price within Budget: 25 points (or if free)
   * - Same Area: 20 points (within 5km = 15)
   * - Condition Tested-Working: 10 points
   * - Seller/Shop Verified: 5 points
   * 
   * @param {Object} request - Repairer request object containing componentType, spec, maxBudget, area
   * @param {Array} pool - Available rescue listings in the component pool
   * @returns {Array} Top 3 matching listings sorted by score descending, with matchScore, matchPercent, and reasons.
   */
  function matchComponents(request, pool) {
    if (!request || !request.componentType || !Array.isArray(pool)) return [];

    const reqType = request.componentType.toLowerCase();
    const reqSpecWords = (request.spec || '').toLowerCase().split(/[\s,/-]+/).filter(w => w.length > 1);
    const reqBudget = parseFloat(request.maxBudget) || 0;
    const reqArea = (request.area || '').toLowerCase().trim();

    // 1. Filter by same component type
    const candidateListings = pool.filter(listing => {
      if (listing.componentType.toLowerCase() !== reqType) return false;
      // Exclude listings with price above budget unless free
      if (listing.price > 0 && reqBudget > 0 && listing.price > reqBudget) return false;
      return true;
    });

    const scoredMatches = candidateListings.map(listing => {
      let score = 0;
      const reasons = [];

      // A. Spec similarity (exact keyword match = 40, partial = 20)
      const listSpec = (listing.spec || '').toLowerCase();
      if (reqSpecWords.length > 0) {
        const matchesAll = reqSpecWords.every(word => listSpec.includes(word));
        const matchesAny = reqSpecWords.some(word => listSpec.includes(word));

        if (matchesAll) {
          score += 40;
          reasons.push(state.currentLang === 'ta' ? 'விவரக்குறிப்பு பொருந்துகிறது' : 'Spec matches');
        } else if (matchesAny) {
          score += 20;
          reasons.push(state.currentLang === 'ta' ? 'பகுதி விவரக்குறிப்பு பொருத்தம்' : 'Partial spec match');
        } else {
          score += 5;
        }
      } else {
        score += 20;
      }

      // B. Price within budget (25 points)
      if (listing.price === 0) {
        score += 25;
        reasons.push(state.currentLang === 'ta' ? 'இலவச நன்கொடை' : 'Free donation');
      } else if (reqBudget === 0 || listing.price <= reqBudget) {
        score += 25;
        reasons.push(state.currentLang === 'ta' ? 'பட்ஜெட்டுக்குள் உள்ளது' : 'Within budget');
      }

      // C. Same area (20 points)
      const listArea = (listing.area || '').toLowerCase().trim();
      if (reqArea && listArea && (reqArea.includes(listArea) || listArea.includes(reqArea))) {
        score += 20;
        reasons.push(state.currentLang === 'ta' ? 'அருகிலுள்ள பகுதி' : 'Same area');
      } else if (listing.distance && listing.distance < 5) {
        score += 15;
        reasons.push(state.currentLang === 'ta' ? '5 கி.மீ சுற்றளவில்' : 'Under 5 km');
      } else {
        score += 8;
      }

      // D. Condition Tested-Working (10 points)
      if (listing.condition === 'Tested - Working' || listing.condition === 'working') {
        score += 10;
        reasons.push(state.currentLang === 'ta' ? 'சோதிக்கப்பட்டது & செயல்படுகிறது' : 'Tested working');
      } else {
        score += 5;
      }

      // E. Seller/Shop verified (5 points)
      if (listing.verified) {
        score += 5;
        reasons.push(state.currentLang === 'ta' ? 'சரிபார்க்கப்பட்ட பயனர்' : 'Verified donor');
      }

      const finalScore = Math.min(100, Math.max(10, score));

      return {
        ...listing,
        matchScore: finalScore,
        matchPercent: `${finalScore}%`,
        reasons
      };
    });

    // Sort descending by score and return top 3
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    return scoredMatches.slice(0, 3);
  }

  function handleFindMatches() {
    const t = RELIFE_DATA.translations[state.currentLang];
    const compType = dom.reqComponentType.value;
    const spec = dom.reqSpec.value.trim();
    const budget = dom.reqBudget.value ? parseFloat(dom.reqBudget.value) : 0;
    const area = dom.reqArea.value.trim();
    const shopName = dom.reqShopName.value.trim() || 'Partner Workshop';

    if (!compType) {
      showToast(state.currentLang === 'ta' ? 'தேவையான உதிரிபாக வகையை தேர்ந்தெடுக்கவும்' : 'Please select component type');
      dom.reqComponentType.focus();
      return;
    }

    const request = {
      shopName,
      componentType: compType,
      spec,
      maxBudget: budget,
      area
    };

    const matches = matchComponents(request, state.rescuePool);

    if (dom.matchResultsSection) dom.matchResultsSection.style.display = 'block';
    if (!dom.matchCardsContainer) return;

    dom.matchCardsContainer.innerHTML = '';

    if (matches.length === 0) {
      dom.matchCardsContainer.innerHTML = `
        <div class="empty-matches-box" style="text-align: center; padding: 24px 12px; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px;">
          <p style="font-size: 14px; color: #475569; margin-bottom: 6px;">⚠️ ${t.noMatchesFound}</p>
          <span style="font-size: 12px; color: #64748B;">Try widening your budget or browse the full Rescue Pool.</span>
        </div>
      `;
      dom.matchResultsSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    matches.forEach((m, idx) => {
      const card = document.createElement('div');
      card.className = 'match-card';
      const cat = RELIFE_DATA.componentCategories.find(c => c.id === m.componentType);
      const icon = cat ? cat.icon : '🔧';
      const typeName = (t.componentTypes && t.componentTypes[m.componentType]) || (cat ? cat.name : m.componentType);
      const isFree = m.price === 0;
      const priceText = isFree ? t.freeDonate : `₹${formatINR(m.price)}`;

      let badges = `<span class="badge-tested">✓ ${t.testedBadge}</span>`;
      if (m.safetyChecked || m.componentType === 'battery') {
        badges += ` <span class="badge-safety">⚡ ${t.safetyCheckedBadge}</span>`;
      }

      card.innerHTML = `
        <div class="match-card-top">
          <div class="match-percent-pill">
            🎯 ${m.matchPercent} ${t.matchRating}
          </div>
          <span class="match-rank-tag">#${idx + 1} Best Fit</span>
        </div>
        <div class="match-reasons-wrap">
          ${m.reasons.map(r => `<span class="reason-tag">✓ ${r}</span>`).join('')}
        </div>
        <div class="match-card-body">
          <div class="match-item-title">${icon} ${m.spec}</div>
          <div class="match-item-meta">
            <span>📱 ${m.sourceDevice}</span>
            <span>📍 ${m.area} (${m.distance || 2.4} km away)</span>
            <span>🛡️ ${m.condition === 'Tested - Working' ? t.condWorkingLabel : t.condMinorWearLabel}</span>
          </div>
          <div class="match-item-price-row">
            <span class="match-price ${isFree ? 'free' : ''}">${priceText}</span>
            <div class="match-badges-row">${badges}</div>
          </div>
        </div>
        <button class="btn-request-match" data-id="${m.id}">
          🤝 ${t.requestPartBtn}
        </button>
      `;

      card.querySelector('.btn-request-match').addEventListener('click', () => {
        openPartRequestModal(m);
      });

      dom.matchCardsContainer.appendChild(card);
    });

    dom.matchResultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  function openPartRequestModal(part) {
    state.selectedPartForRequest = part;
    const t = RELIFE_DATA.translations[state.currentLang];

    if (dom.partModalItemName) {
      const isFree = part.price === 0;
      const priceStr = isFree ? t.freeDonate : `₹${formatINR(part.price)}`;
      dom.partModalItemName.textContent = `${part.spec} (${part.sourceDevice}) — ${priceStr}`;
    }

    // Default pickup date to tomorrow
    if (dom.partRequestDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dom.partRequestDate.value = tomorrow.toISOString().split('T')[0];
      dom.partRequestDate.min = new Date().toISOString().split('T')[0];
    }

    if (dom.partModalFormView) dom.partModalFormView.style.display = 'block';
    if (dom.partModalSuccessView) dom.partModalSuccessView.style.display = 'none';

    if (dom.partRequestModal) dom.partRequestModal.classList.add('active');
  }

  function closePartRequestModal() {
    if (dom.partRequestModal) dom.partRequestModal.classList.remove('active');
    state.selectedPartForRequest = null;
  }

  function handleConfirmPartRequest() {
    const part = state.selectedPartForRequest;
    if (!part) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const requestId = `RCM-2026-${randomNum}`;

    if (dom.partRequestRef) dom.partRequestRef.textContent = requestId;
    if (dom.partModalFormView) dom.partModalFormView.style.display = 'none';
    if (dom.partModalSuccessView) dom.partModalSuccessView.style.display = 'block';

    // Calculate Repairer Savings:
    // Estimated new-part price minus rescued listing price
    const newBenchmark = RELIFE_DATA.estimatedNewPartPrices[part.componentType] || 2400;
    const saving = Math.max(400, newBenchmark - (part.price || 0));
    const extraEwaste = (part.componentType === 'battery' || part.componentType === 'screen') ? 0.3 : 0.1;

    state.impact.partsRescued += 1;
    state.impact.repairerSaved += saving;
    state.impact.ewasteAvoided = parseFloat((state.impact.ewasteAvoided + extraEwaste).toFixed(1));
    saveImpactStats(state.impact);
    renderImpactDashboard();

    showToast(state.currentLang === 'ta' ? `உதிரிபாகம் கோரப்பட்டது! ஐடி: ${requestId}` : `Part requested! Ref: ${requestId}`);
  }

  function showRescueFormError(msg) {
    if (dom.rescueFormError) {
      dom.rescueFormError.textContent = msg;
      dom.rescueFormError.style.display = 'flex';
      dom.rescueFormError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      showToast(msg);
    }
  }

  function hideRescueFormError() {
    if (dom.rescueFormError) {
      dom.rescueFormError.style.display = 'none';
    }
  }

  function handleAddPartListing() {
    const t = RELIFE_DATA.translations[state.currentLang];
    hideRescueFormError();

    // 1. Source device
    const deviceId = dom.partSourceDevice ? dom.partSourceDevice.value : '';
    if (!deviceId) {
      showRescueFormError(t.errSelectModel || 'Please select the source device.');
      dom.partSourceDevice.focus();
      return;
    }

    // 2. Component type
    const compType = dom.partComponentType ? dom.partComponentType.value : '';
    if (!compType) {
      showRescueFormError('Please select a component type.');
      dom.partComponentType.focus();
      return;
    }

    // 3. Specification
    const spec = dom.partSpec ? dom.partSpec.value.trim() : '';
    if (!spec) {
      showRescueFormError('Please enter specification details (e.g. 8GB DDR4 3200MHz).');
      dom.partSpec.focus();
      return;
    }

    // 4. Fixed price validation
    let price = 0;
    if (state.partPricingMode === 'fixed') {
      const pVal = dom.partPriceInput ? dom.partPriceInput.value.trim() : '';
      if (!pVal || isNaN(pVal) || parseFloat(pVal) < 0) {
        showRescueFormError('Please enter a valid price in ₹.');
        dom.partPriceInput.focus();
        return;
      }
      price = parseInt(pVal, 10);
    }

    // 5. Area / Location
    const area = dom.partLocationInput ? dom.partLocationInput.value.trim() : '';
    if (!area) {
      showRescueFormError('Please enter your area or location.');
      dom.partLocationInput.focus();
      return;
    }

    // 6. Tested Checkbox
    if (!dom.partCheckTested || !dom.partCheckTested.checked) {
      showRescueFormError('You must confirm that you have tested this part.');
      return;
    }

    // 7. Safety Gate: Battery
    if (compType === 'battery') {
      if (state.batterySwellingReported === true) {
        showRescueFormError(t.batterySwollenBlockText || 'Damaged or swollen batteries are hazardous and cannot be listed. Please recycle.');
        return;
      }
      if (state.batterySwellingReported !== false) {
        showRescueFormError('Please confirm the physical inspection of the battery.');
        return;
      }
      const b1 = dom.batteryCheck1 && dom.batteryCheck1.checked;
      const b2 = dom.batteryCheck2 && dom.batteryCheck2.checked;
      const b3 = dom.batteryCheck3 && dom.batteryCheck3.checked;
      const b4 = dom.batteryCheck4 && dom.batteryCheck4.checked;
      if (!b1 || !b2 || !b3 || !b4) {
        showRescueFormError('All 4 battery safety gate checks must be verified before listing a battery.');
        return;
      }
    }

    // 8. Safety Gate: Storage (SSD / HDD)
    if (compType === 'ssd' || compType === 'hdd') {
      if (!dom.storageWipeCheck || !dom.storageWipeCheck.checked) {
        showRescueFormError(t.storageWipeLabel || 'Data-Safety: You must certify that this storage drive has been securely wiped.');
        return;
      }
    }

    // Construct Listing Object
    const dev = RELIFE_DATA.devices.find(d => d.id === deviceId);
    const deviceName = dev ? dev.name : deviceId;

    const newListing = {
      id: `pool-${Date.now()}`,
      componentType: compType,
      spec,
      condition: state.selectedPartCondition,
      sourceDevice: deviceName,
      sourceDeviceId: deviceId,
      price,
      area,
      distance: 1.8,
      tested: true,
      safetyChecked: compType === 'battery',
      photo: state.currentPartPhoto || null,
      verified: true,
      dateAdded: new Date().toISOString()
    };

    // Add to pool & persist
    state.rescuePool.unshift(newListing);
    saveRescuePool(state.rescuePool);

    if (dom.teaserPartsCount) {
      dom.teaserPartsCount.textContent = state.rescuePool.length;
    }

    // Reset Form Fields
    if (dom.partSpec) dom.partSpec.value = '';
    if (dom.partPriceInput) dom.partPriceInput.value = '';
    if (dom.partLocationInput) dom.partLocationInput.value = '';
    if (dom.partCheckTested) dom.partCheckTested.checked = false;
    removePhoto();

    if (dom.batterySafetyPanel) dom.batterySafetyPanel.style.display = 'none';
    if (dom.storageSafetyPanel) dom.storageSafetyPanel.style.display = 'none';
    hideRescueFormError();

    showToast(state.currentLang === 'ta' ? 'உதிரிபாகம் சேகரிப்பில் சேர்க்கப்பட்டது!' : 'Part successfully added to Rescue Pool!');

    // Switch to Pool View to show listing
    switchRescueTab('pool');
  }

  function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      state.currentPartPhoto = loadEvent.target.result;
      if (dom.partPreviewImg) dom.partPreviewImg.src = state.currentPartPhoto;
      if (dom.partPhotoPreview) dom.partPhotoPreview.style.display = 'flex';
      if (dom.partCheckPhoto) dom.partCheckPhoto.checked = true;
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    state.currentPartPhoto = null;
    if (dom.partPhotoPreview) dom.partPhotoPreview.style.display = 'none';
    if (dom.partPhotoFile) dom.partPhotoFile.value = '';
    if (dom.partCheckPhoto) dom.partCheckPhoto.checked = false;
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

    if (state.currentScreen === 2 && state.decision) renderScreen2();
    if (state.currentScreen === 3 && state.decision) renderScreen3();
    if (state.currentScreen === 4 && state.decision) renderScreen4();
    if (state.currentScreen === 5) renderProvidersList();
    if (state.currentScreen === 'rescue') {
      populateComponentRescueDropdowns();
      renderPoolCategoryChips();
      renderPoolListings();
      renderSampleRepairerChips();
    }
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
      if (state.currentScreen === 'rescue') {
        goToScreen(state.previousScreen || 1);
        return;
      }
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

    // =================================================================
    // Component Rescue Event Listeners
    // =================================================================
    // Header Rescue Button (Entry Point 1)
    if (dom.navRescueBtn) {
      dom.navRescueBtn.addEventListener('click', () => {
        openRescueScreen(state.currentRescueTab || 'have');
      });
    }

    // Result Screen Card Button (Entry Point 2)
    if (dom.btnResultToRescue) {
      dom.btnResultToRescue.addEventListener('click', () => {
        const devId = state.decision ? state.decision.device.id : '';
        openRescueScreen('have', devId);
      });
    }

    // Connect Screen Teaser (Entry Point 3)
    if (dom.btnTeaserToRescue) {
      dom.btnTeaserToRescue.addEventListener('click', () => {
        openRescueScreen('pool');
      });
    }

    // Return to main flow from rescue screen
    if (dom.btnBackToFlow) {
      dom.btnBackToFlow.addEventListener('click', () => {
        goToScreen(state.previousScreen || 1);
      });
    }

    // Tab switcher buttons
    if (dom.tabBtnHave) dom.tabBtnHave.addEventListener('click', () => switchRescueTab('have'));
    if (dom.tabBtnNeed) dom.tabBtnNeed.addEventListener('click', () => switchRescueTab('need'));
    if (dom.tabBtnPool) dom.tabBtnPool.addEventListener('click', () => switchRescueTab('pool'));

    // Condition segmented buttons
    if (dom.condWorking) {
      dom.condWorking.addEventListener('click', () => {
        state.selectedPartCondition = 'Tested - Working';
        dom.condWorking.classList.add('active');
        if (dom.condMinorWear) dom.condMinorWear.classList.remove('active');
      });
    }
    if (dom.condMinorWear) {
      dom.condMinorWear.addEventListener('click', () => {
        state.selectedPartCondition = 'Tested - Minor wear';
        dom.condMinorWear.classList.add('active');
        if (dom.condWorking) dom.condWorking.classList.remove('active');
      });
    }

    // Price mode segmented buttons
    if (dom.btnPriceFree) {
      dom.btnPriceFree.addEventListener('click', () => {
        state.partPricingMode = 'free';
        dom.btnPriceFree.classList.add('active');
        if (dom.btnPriceFixed) dom.btnPriceFixed.classList.remove('active');
        if (dom.fixedPriceWrap) dom.fixedPriceWrap.style.display = 'none';
      });
    }
    if (dom.btnPriceFixed) {
      dom.btnPriceFixed.addEventListener('click', () => {
        state.partPricingMode = 'fixed';
        dom.btnPriceFixed.classList.add('active');
        if (dom.btnPriceFree) dom.btnPriceFree.classList.remove('active');
        if (dom.fixedPriceWrap) dom.fixedPriceWrap.style.display = 'block';
      });
    }

    // Component type selection change triggers safety gates
    if (dom.partComponentType) {
      dom.partComponentType.addEventListener('change', handlePartComponentTypeChange);
    }

    // Battery swelling checks
    if (dom.btnSwellingNo) {
      dom.btnSwellingNo.addEventListener('click', () => {
        state.batterySwellingReported = false;
        dom.btnSwellingNo.classList.add('active');
        if (dom.btnSwellingYes) dom.btnSwellingYes.classList.remove('active');
        if (dom.batterySwollenBlock) dom.batterySwollenBlock.style.display = 'none';
        if (dom.batteryMandatoryChecks) dom.batteryMandatoryChecks.style.display = 'block';
      });
    }
    if (dom.btnSwellingYes) {
      dom.btnSwellingYes.addEventListener('click', () => {
        state.batterySwellingReported = true;
        dom.btnSwellingYes.classList.add('active');
        if (dom.btnSwellingNo) dom.btnSwellingNo.classList.remove('active');
        if (dom.batterySwollenBlock) dom.batterySwollenBlock.style.display = 'block';
        if (dom.batteryMandatoryChecks) dom.batteryMandatoryChecks.style.display = 'none';
      });
    }
    if (dom.btnRouteRecycle) {
      dom.btnRouteRecycle.addEventListener('click', () => {
        state.activeFilter = 'recycle';
        goToScreen(5);
      });
    }

    // Photo upload
    if (dom.partCheckPhoto) {
      dom.partCheckPhoto.addEventListener('change', (e) => {
        if (e.target.checked && dom.partPhotoFile) {
          dom.partPhotoFile.click();
        }
      });
    }
    if (dom.partPhotoFile) dom.partPhotoFile.addEventListener('change', handlePhotoUpload);
    if (dom.btnRemovePhoto) dom.btnRemovePhoto.addEventListener('click', removePhoto);

    // Add listing button
    if (dom.btnAddPool) dom.btnAddPool.addEventListener('click', handleAddPartListing);

    // Tab 2: Urgency pills
    dom.urgencyPills.forEach(pill => {
      pill.addEventListener('click', () => {
        dom.urgencyPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Tab 2: Find matches
    if (dom.btnFindMatches) dom.btnFindMatches.addEventListener('click', handleFindMatches);

    // Tab 3: Search input
    if (dom.poolSearchInput) dom.poolSearchInput.addEventListener('input', renderPoolListings);

    // Part Request Modal
    if (dom.partModalCloseBtn) dom.partModalCloseBtn.addEventListener('click', closePartRequestModal);
    if (dom.btnPartDone) dom.btnPartDone.addEventListener('click', closePartRequestModal);
    if (dom.btnConfirmPartRequest) dom.btnConfirmPartRequest.addEventListener('click', handleConfirmPartRequest);
    if (dom.partRequestModal) {
      dom.partRequestModal.addEventListener('click', (e) => {
        if (e.target === dom.partRequestModal) closePartRequestModal();
      });
    }

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
