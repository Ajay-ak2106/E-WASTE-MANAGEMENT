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
    selectedPartForRequest: null,

    // Journey Tracker & Custom Models State
    customDevices: loadCustomDevices(),
    trackedDevices: loadTrackedDevices(),
    activeTrackerTab: 'my-devices', // 'my-devices' | 'track-by-id' | 'partner-console' | 'sustainability-dashboard'
    activeRole: 'owner', // 'owner' | 'collector' | 'repairer'
    activeTrackedDevice: null,
    activeHandoverMode: 'dropoff',
    activeInspectionDevice: null,
    activeInspectionBoot: 'boots',
    inspectionChecks: {
      screen: 'working',
      battery: 'working',
      ram: 'working',
      storage: 'working',
      motherboard: 'working',
      charger_port: 'working',
      keyboard: 'working',
      camera: 'working'
    },
    inspectionSuggestedPathway: null,
    inspectionForcedBatteryRecycle: false,
    outcomeEvidenceDataUrl: null,
    outcomeEvidenceFileName: null
  };

  // DOM Element References
  const dom = {
    // Header & Navigation
    backBtn: document.getElementById('back-btn'),
    langToggleBtn: document.getElementById('lang-toggle-btn'),
    navTrackerBtn: document.getElementById('nav-tracker-btn'),
    navRescueBtn: document.getElementById('nav-rescue-btn'),
    progressContainer: document.querySelector('.progress-container'),
    progressFill: document.getElementById('progress-fill'),
    progressStepName: document.getElementById('progress-step-name'),
    stepNodes: document.querySelectorAll('.step-node'),
    currentStepNum: document.getElementById('current-step-num'),
    screens: document.querySelectorAll('.screen'),
    screenRescue: document.getElementById('screen-rescue'),
    screenTracker: document.getElementById('screen-tracker'),

    // Screen 1: Inputs
    btnTypePhone: document.getElementById('type-phone'),
    btnTypeLaptop: document.getElementById('type-laptop'),
    btnAddCustomModel: document.getElementById('btn-add-custom-model'),
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
    resultTrackerCard: document.getElementById('result-tracker-card'),
    btnResultToTracker: document.getElementById('btn-result-to-tracker'),
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
    btnCertToTracker: document.getElementById('btn-cert-to-tracker'),
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
    toast: document.getElementById('toast-notice'),

    // Journey Tracker Screen Controls
    trackerRoleSelector: document.getElementById('tracker-role-selector'),
    tabTrackerMyDevices: document.getElementById('tab-tracker-my-devices'),
    tabTrackerTrackById: document.getElementById('tab-tracker-track-by-id'),
    tabTrackerConsole: document.getElementById('tab-tracker-console'),
    tabTrackerSustainability: document.getElementById('tab-tracker-sustainability'),
    viewMyDevices: document.getElementById('view-my-devices'),
    viewTrackById: document.getElementById('view-track-by-id'),
    viewPartnerConsole: document.getElementById('view-partner-console'),
    viewSustainabilityDashboard: document.getElementById('view-sustainability-dashboard'),

    // Tab 1: My Devices
    btnOpenRegisterModal: document.getElementById('btn-open-register-modal'),
    myDevicesCount: document.getElementById('my-devices-count'),
    myDevicesList: document.getElementById('my-devices-list'),

    // Tab 2: Track by ID
    trackerIdInput: document.getElementById('tracker-id-input'),
    btnSearchTrackId: document.getElementById('btn-search-track-id'),
    quickTrackerChips: document.getElementById('quick-tracker-chips'),
    journeyDeviceSummary: document.getElementById('journey-device-summary'),
    summaryDeviceId: document.getElementById('summary-device-id'),
    summaryDeviceModel: document.getElementById('summary-device-model'),
    summaryDeviceStage: document.getElementById('summary-device-stage'),
    summaryDeviceHandler: document.getElementById('summary-device-handler'),
    summaryPassportQr: document.getElementById('summary-passport-qr'),
    summaryShareLink: document.getElementById('summary-share-link'),
    journeyTimelineContainer: document.getElementById('journey-timeline-container'),
    timelineEvidenceBox: document.getElementById('timeline-evidence-box'),
    evidencePreviewContainer: document.getElementById('evidence-preview-container'),
    journeyAuditLogList: document.getElementById('journey-audit-log-list'),
    auditEntryCount: document.getElementById('audit-entry-count'),

    // Tab 3: Partner Console (Owner, Collector, Inspector/Repairer)
    consoleOwnerSection: document.getElementById('console-owner-section'),
    ownerHandoverDeviceSelect: document.getElementById('owner-handover-device-select'),
    btnHandoverDropoff: document.getElementById('btn-handover-dropoff'),
    btnHandoverPickup: document.getElementById('btn-handover-pickup'),
    ownerDropoffGroup: document.getElementById('owner-dropoff-group'),
    ownerPickupGroup: document.getElementById('owner-pickup-group'),
    ownerDropoffCentreSelect: document.getElementById('owner-dropoff-centre-select'),
    ownerPickupDate: document.getElementById('owner-pickup-date'),
    btnSaveHandoverPref: document.getElementById('btn-save-handover-pref'),

    consoleCollectorSection: document.getElementById('console-collector-section'),
    collectScanInput: document.getElementById('collect-scan-input'),
    btnSimScan: document.getElementById('btn-sim-scan'),
    collectorNameInput: document.getElementById('collector-name-input'),
    collectorOrgSelect: document.getElementById('collector-org-select'),
    collectorLocationInput: document.getElementById('collector-location-input'),
    btnConfirmCollection: document.getElementById('btn-confirm-collection'),
    pendingPickupsList: document.getElementById('pending-pickups-list'),

    consoleInspectorSection: document.getElementById('console-inspector-section'),
    inspectorDeviceSelect: document.getElementById('inspector-device-select'),
    btnBootYes: document.getElementById('btn-boot-yes'),
    btnBootNo: document.getElementById('btn-boot-no'),
    inspectionChecklistGrid: document.getElementById('inspection-checklist-grid'),
    suggestedPathwayPill: document.getElementById('suggested-pathway-pill'),
    suggestedPathwayDesc: document.getElementById('suggested-pathway-desc'),
    inspectionBatteryDanger: document.getElementById('inspection-battery-danger'),
    inspectionRescueLinkWrap: document.getElementById('inspection-rescue-link-wrap'),
    btnListWorkingPartsRescue: document.getElementById('btn-list-working-parts-rescue'),
    inspectorNotesInput: document.getElementById('inspector-notes-input'),
    inspectionOverridePathway: document.getElementById('inspection-override-pathway'),
    btnSubmitInspection: document.getElementById('btn-submit-inspection'),

    outcomePathwaySelect: document.getElementById('outcome-pathway-select'),
    outcomeOrgSelect: document.getElementById('outcome-org-select'),
    outcomeCostInput: document.getElementById('outcome-cost-input'),
    outcomeNewpriceInput: document.getElementById('outcome-newprice-input'),
    evidenceFileInput: document.getElementById('evidence-file-input'),
    evidenceFilePreviewWrap: document.getElementById('evidence-file-preview-wrap'),
    evidencePreviewImg: document.getElementById('evidence-preview-img'),
    evidenceFilenameDisplay: document.getElementById('evidence-filename-display'),
    btnRemoveEvidence: document.getElementById('btn-remove-evidence'),
    btnRecordOutcome: document.getElementById('btn-record-outcome'),
    btnVerifyOutcome: document.getElementById('btn-verify-outcome'),

    // Tab 4: Sustainability Dashboard
    sustainabilitySummarySentence: document.getElementById('sustainability-summary-sentence'),
    metricVerifiedCount: document.getElementById('metric-verified-count'),
    metricPendingCount: document.getElementById('metric-pending-count'),
    sustainabilityDonutSvg: document.getElementById('sustainability-donut-svg'),
    donutLegend: document.getElementById('donut-legend'),
    sustMetricRepaired: document.getElementById('sust-metric-repaired'),
    sustMetricReused: document.getElementById('sust-metric-reused'),
    sustMetricDonated: document.getElementById('sust-metric-donated'),
    sustMetricParts: document.getElementById('sust-metric-parts'),
    sustMetricRecycled: document.getElementById('sust-metric-recycled'),
    sustMetricSavings: document.getElementById('sust-metric-savings'),
    sustMetricCo2: document.getElementById('sust-metric-co2'),
    sustMetricEwaste: document.getElementById('sust-metric-ewaste'),
    btnMethodTooltip: document.getElementById('btn-method-tooltip'),
    methodModalBox: document.getElementById('method-modal-box'),

    // Custom Model Modal
    customModelModal: document.getElementById('custom-model-modal'),
    btnCloseCustomModel: document.getElementById('btn-close-custom-model'),
    customModelForm: document.getElementById('custom-model-form'),
    customDeviceType: document.getElementById('custom-device-type'),
    customDeviceBrand: document.getElementById('custom-device-brand'),
    customDeviceName: document.getElementById('custom-device-name'),
    customDevicePrice: document.getElementById('custom-device-price'),
    btnSaveCustomModel: document.getElementById('btn-save-custom-model'),

    // Device Register Modal
    deviceRegisterModal: document.getElementById('device-register-modal'),
    btnCloseRegisterModal: document.getElementById('btn-close-register-modal'),
    deviceRegistrationForm: document.getElementById('device-registration-form'),
    regDeviceType: document.getElementById('reg-device-type'),
    regDeviceBrand: document.getElementById('reg-device-brand'),
    regDeviceModel: document.getElementById('reg-device-model'),
    regDeviceCondition: document.getElementById('reg-device-condition'),
    regDeviceAge: document.getElementById('reg-device-age'),
    regDeviceProblem: document.getElementById('reg-device-problem'),
    regOwnerName: document.getElementById('reg-owner-name'),
    regDeviceArea: document.getElementById('reg-device-area'),
    regDataSafetyCheck: document.getElementById('reg-data-safety-check'),
    btnOpenSafetyWizardFromReg: document.getElementById('btn-open-safety-wizard-from-reg'),
    btnSubmitRegistration: document.getElementById('btn-submit-registration'),

    // Passport Label Modal
    passportLabelModal: document.getElementById('passport-label-modal'),
    btnCloseLabelModal: document.getElementById('btn-close-label-modal'),
    printablePassportTag: document.getElementById('printable-passport-tag'),
    passportLabelQr: document.getElementById('passport-label-qr'),
    tagDisplayId: document.getElementById('tag-display-id'),
    tagDisplayDevice: document.getElementById('tag-display-device'),
    tagDisplayStatus: document.getElementById('tag-display-status'),
    tagDisplayDate: document.getElementById('tag-display-date'),
    btnPrintPassportTag: document.getElementById('btn-print-passport-tag'),
    btnViewJourneyFromTag: document.getElementById('btn-view-journey-from-tag'),

    // Barcode Scanner Modal
    barcodeScannerModal: document.getElementById('barcode-scanner-modal'),
    btnCloseScannerModal: document.getElementById('btn-close-scanner-modal'),
    scannerSelectDevice: document.getElementById('scanner-select-device'),
    scannerManualInput: document.getElementById('scanner-manual-input'),
    btnConfirmSimulatedScan: document.getElementById('btn-confirm-simulated-scan')
  };

  /**
   * Initialize Application
   */
  function init() {
    loadCustomDevicesIntoCatalog();
    setupEventListeners();
    populateModelDropdown();
    renderProblemCards();
    updateProgressUI();
    renderImpactDashboard();
    initComponentRescue();
    initJourneyTracker();
    updateLanguageTexts();
    handleHashRouting();
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('hashchange', handleHashRouting);
    }
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
      if (dom.screenTracker) dom.screenTracker.classList.remove('active');
      if (dom.screenRescue) dom.screenRescue.classList.add('active');
      if (dom.progressContainer) dom.progressContainer.style.display = 'none';
      dom.backBtn.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const viewport = document.querySelector('.screens-viewport');
      if (viewport) viewport.scrollTop = 0;
      switchRescueTab(state.currentRescueTab);
      return;
    }

    if (screenNumber === 'tracker') {
      if (typeof state.currentScreen === 'number') {
        state.previousScreen = state.currentScreen;
      }
      state.currentScreen = 'tracker';
      dom.screens.forEach(s => s.classList.remove('active'));
      if (dom.screenRescue) dom.screenRescue.classList.remove('active');
      if (dom.screenTracker) dom.screenTracker.classList.add('active');
      if (dom.progressContainer) dom.progressContainer.style.display = 'none';
      dom.backBtn.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const viewport = document.querySelector('.screens-viewport');
      if (viewport) viewport.scrollTop = 0;
      switchTrackerTab(state.activeTrackerTab || 'my-devices');
      return;
    }

    if (screenNumber < 1 || screenNumber > 5) return;
    state.currentScreen = screenNumber;

    if (dom.screenTracker) dom.screenTracker.classList.remove('active');
    if (dom.screenRescue) dom.screenRescue.classList.remove('active');
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
    if (state.currentScreen === 'tracker') {
      renderActiveTrackerTab();
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

    if (state.currentScreen === 'tracker') {
      renderActiveTrackerTab();
    }
  }

  // ===================================================================
  // UTILITIES & EVENT LISTENERS
  // ===================================================================
  function setupEventListeners() {
    // Header
    dom.backBtn.addEventListener('click', () => {
      if (state.currentScreen === 'rescue' || state.currentScreen === 'tracker') {
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

    // =================================================================
    // Journey Tracker Event Listeners
    // =================================================================
    // Header Tracker Button (Entry Point 1)
    if (dom.navTrackerBtn) {
      dom.navTrackerBtn.addEventListener('click', () => {
        openTrackerScreen(state.activeTrackerTab || 'my-devices');
      });
    }

    // Custom Model Modal Triggers
    if (dom.btnAddCustomModel) {
      dom.btnAddCustomModel.addEventListener('click', openCustomModelModal);
    }
    if (dom.btnCloseCustomModel) {
      dom.btnCloseCustomModel.addEventListener('click', closeCustomModelModal);
    }
    if (dom.customModelForm) {
      dom.customModelForm.addEventListener('submit', handleSaveCustomModel);
    }
    if (dom.customModelModal) {
      dom.customModelModal.addEventListener('click', (e) => {
        if (e.target === dom.customModelModal) closeCustomModelModal();
      });
    }

    // Result & Certificate Cross-Links (Entry Points 2 & 3)
    if (dom.btnResultToTracker) {
      dom.btnResultToTracker.addEventListener('click', handleResultToTracker);
    }
    if (dom.btnCertToTracker) {
      dom.btnCertToTracker.addEventListener('click', handleCertToTracker);
    }

    // Role Switcher
    if (dom.trackerRoleSelector) {
      dom.trackerRoleSelector.addEventListener('change', (e) => {
        switchRole(e.target.value);
      });
    }

    // Tracker Tabs
    if (dom.tabTrackerMyDevices) {
      dom.tabTrackerMyDevices.addEventListener('click', () => switchTrackerTab('my-devices'));
    }
    if (dom.tabTrackerTrackById) {
      dom.tabTrackerTrackById.addEventListener('click', () => switchTrackerTab('track-by-id'));
    }
    if (dom.tabTrackerConsole) {
      dom.tabTrackerConsole.addEventListener('click', () => switchTrackerTab('partner-console'));
    }
    if (dom.tabTrackerSustainability) {
      dom.tabTrackerSustainability.addEventListener('click', () => switchTrackerTab('sustainability-dashboard'));
    }

    // Tab 1: Register Trigger
    if (dom.btnOpenRegisterModal) {
      dom.btnOpenRegisterModal.addEventListener('click', () => openDeviceRegisterModal());
    }

    // Tab 2: Track by ID Search
    if (dom.btnSearchTrackId) {
      dom.btnSearchTrackId.addEventListener('click', () => {
        if (dom.trackerIdInput) trackDeviceById(dom.trackerIdInput.value);
      });
    }
    if (dom.trackerIdInput) {
      dom.trackerIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') trackDeviceById(dom.trackerIdInput.value);
      });
    }

    // Tab 3: Owner Handover
    if (dom.btnHandoverDropoff && dom.btnHandoverPickup) {
      dom.btnHandoverDropoff.addEventListener('click', () => {
        state.activeHandoverMode = 'dropoff';
        dom.btnHandoverDropoff.classList.add('active');
        dom.btnHandoverPickup.classList.remove('active');
        if (dom.ownerDropoffGroup) dom.ownerDropoffGroup.style.display = 'block';
        if (dom.ownerPickupGroup) dom.ownerPickupGroup.style.display = 'none';
      });
      dom.btnHandoverPickup.addEventListener('click', () => {
        state.activeHandoverMode = 'pickup';
        dom.btnHandoverPickup.classList.add('active');
        dom.btnHandoverDropoff.classList.remove('active');
        if (dom.ownerDropoffGroup) dom.ownerDropoffGroup.style.display = 'none';
        if (dom.ownerPickupGroup) dom.ownerPickupGroup.style.display = 'block';
      });
    }
    if (dom.btnSaveHandoverPref) {
      dom.btnSaveHandoverPref.addEventListener('click', handleSaveHandoverSchedule);
    }

    // Tab 3: Collector
    if (dom.btnSimScan) {
      dom.btnSimScan.addEventListener('click', openBarcodeScannerModal);
    }
    if (dom.btnConfirmCollection) {
      dom.btnConfirmCollection.addEventListener('click', handleConfirmCollection);
    }

    // Tab 3: Inspector / Repairer
    if (dom.inspectorDeviceSelect) {
      dom.inspectorDeviceSelect.addEventListener('change', handleInspectorDeviceSelectChange);
    }
    if (dom.btnBootYes && dom.btnBootNo) {
      dom.btnBootYes.addEventListener('click', () => {
        state.activeInspectionBoot = 'boots';
        dom.btnBootYes.classList.add('active');
        dom.btnBootNo.classList.remove('active');
        evaluateInspectionRuleSuggestion();
      });
      dom.btnBootNo.addEventListener('click', () => {
        state.activeInspectionBoot = 'no-boot';
        dom.btnBootNo.classList.add('active');
        dom.btnBootYes.classList.remove('active');
        evaluateInspectionRuleSuggestion();
      });
    }
    if (dom.btnListWorkingPartsRescue) {
      dom.btnListWorkingPartsRescue.addEventListener('click', handleListWorkingPartsOnRescue);
    }
    if (dom.btnSubmitInspection) {
      dom.btnSubmitInspection.addEventListener('click', handleSubmitInspection);
    }

    // Tab 3: Outcome Recording & Evidence
    if (dom.evidenceFileInput) {
      dom.evidenceFileInput.addEventListener('change', handleEvidenceUpload);
    }
    if (dom.btnRemoveEvidence) {
      dom.btnRemoveEvidence.addEventListener('click', removeEvidence);
    }
    if (dom.btnRecordOutcome) {
      dom.btnRecordOutcome.addEventListener('click', handleRecordOutcome);
    }
    if (dom.btnVerifyOutcome) {
      dom.btnVerifyOutcome.addEventListener('click', handleVerifyOutcome);
    }

    // Tab 4: Sustainability Method Tooltip
    if (dom.btnMethodTooltip) {
      dom.btnMethodTooltip.addEventListener('click', () => {
        if (dom.methodModalBox) {
          dom.methodModalBox.style.display = dom.methodModalBox.style.display === 'none' ? 'block' : 'none';
        }
      });
    }

    // Modals: Device Registration Modal
    if (dom.btnCloseRegisterModal) {
      dom.btnCloseRegisterModal.addEventListener('click', closeDeviceRegisterModal);
    }
    if (dom.deviceRegistrationForm) {
      dom.deviceRegistrationForm.addEventListener('submit', handleDeviceRegistrationSubmit);
    }
    if (dom.btnOpenSafetyWizardFromReg) {
      dom.btnOpenSafetyWizardFromReg.addEventListener('click', () => {
        closeDeviceRegisterModal();
        goToScreen(4);
      });
    }
    if (dom.deviceRegisterModal) {
      dom.deviceRegisterModal.addEventListener('click', (e) => {
        if (e.target === dom.deviceRegisterModal) closeDeviceRegisterModal();
      });
    }

    // Modals: Passport Label Modal
    if (dom.btnCloseLabelModal) {
      dom.btnCloseLabelModal.addEventListener('click', closePassportLabelModal);
    }
    if (dom.btnPrintPassportTag) {
      dom.btnPrintPassportTag.addEventListener('click', () => {
        window.print();
      });
    }
    if (dom.btnViewJourneyFromTag) {
      dom.btnViewJourneyFromTag.addEventListener('click', () => {
        closePassportLabelModal();
        if (state.activeTrackedDevice) {
          openTrackerScreen('track-by-id', state.activeTrackedDevice.id);
        }
      });
    }
    if (dom.passportLabelModal) {
      dom.passportLabelModal.addEventListener('click', (e) => {
        if (e.target === dom.passportLabelModal) closePassportLabelModal();
      });
    }

    // Modals: Barcode Scanner Modal
    if (dom.btnCloseScannerModal) {
      dom.btnCloseScannerModal.addEventListener('click', closeBarcodeScannerModal);
    }
    if (dom.btnConfirmSimulatedScan) {
      dom.btnConfirmSimulatedScan.addEventListener('click', handleConfirmSimulatedScan);
    }
    if (dom.barcodeScannerModal) {
      dom.barcodeScannerModal.addEventListener('click', (e) => {
        if (e.target === dom.barcodeScannerModal) closeBarcodeScannerModal();
      });
    }
  }

  // ===================================================================
  // CUSTOM DEVICE MODEL MANAGEMENT
  // ===================================================================
  function loadCustomDevices() {
    try {
      const saved = localStorage.getItem('relife_custom_devices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for custom devices', e);
    }
    return [];
  }

  function saveCustomDevices(devices) {
    try {
      localStorage.setItem('relife_custom_devices', JSON.stringify(devices));
    } catch (e) {
      console.warn('Unable to save custom devices', e);
    }
  }

  function loadCustomDevicesIntoCatalog() {
    const list = state.customDevices || [];
    list.forEach(cust => {
      const exists = RELIFE_DATA.devices.some(d => d.id === cust.id);
      if (!exists) {
        RELIFE_DATA.devices.push(cust);
      }
    });
  }

  function openCustomModelModal() {
    if (dom.customDeviceType) dom.customDeviceType.value = state.deviceType;
    if (dom.customModelForm) dom.customModelForm.reset();
    if (dom.customDeviceType) dom.customDeviceType.value = state.deviceType;
    if (dom.customModelModal) dom.customModelModal.style.display = 'flex';
  }

  function closeCustomModelModal() {
    if (dom.customModelModal) dom.customModelModal.style.display = 'none';
  }

  function handleSaveCustomModel(e) {
    e.preventDefault();
    const type = dom.customDeviceType.value;
    const brand = dom.customDeviceBrand.value.trim();
    const name = dom.customDeviceName.value.trim();
    const priceVal = dom.customDevicePrice.value.trim();

    if (!brand || !name || !priceVal) {
      showToast('Please fill all custom device fields.');
      return;
    }

    const price = parseInt(priceVal, 10);
    if (isNaN(price) || price < 1000) {
      showToast('Please enter a valid price (minimum ₹1,000).');
      return;
    }

    const customId = `custom_${Date.now()}`;
    const fullName = `${brand} ${name}`;

    const newDevice = {
      id: customId,
      name: fullName,
      brand: brand,
      type: type,
      os: type === 'phone' ? 'Android / iOS' : 'Windows 11',
      newPrice: price,
      isCustom: true,
      repairs: {
        cracked_screen: { cost: Math.round(price * 0.28), fairMin: Math.round(price * 0.22), fairMax: Math.round(price * 0.35) },
        battery_drains: { cost: Math.round(price * 0.12), fairMin: Math.round(price * 0.09), fairMax: Math.round(price * 0.16) },
        wont_charge: { cost: Math.round(price * 0.08), fairMin: Math.round(price * 0.06), fairMax: Math.round(price * 0.12) },
        slow_perf: { cost: Math.round(price * 0.06), fairMin: Math.round(price * 0.04), fairMax: Math.round(price * 0.10) },
        water_damage: { cost: Math.round(price * 0.35), fairMin: Math.round(price * 0.28), fairMax: Math.round(price * 0.45) }
      }
    };

    state.customDevices.push(newDevice);
    saveCustomDevices(state.customDevices);
    RELIFE_DATA.devices.push(newDevice);

    // Switch to that type if different
    state.deviceType = type;
    if (type === 'phone') {
      dom.btnTypePhone.classList.add('active');
      dom.btnTypeLaptop.classList.remove('active');
    } else {
      dom.btnTypeLaptop.classList.add('active');
      dom.btnTypePhone.classList.remove('active');
    }

    populateModelDropdown();
    state.modelId = customId;
    dom.deviceModelSelect.value = customId;
    closeCustomModelModal();

    showToast(state.currentLang === 'ta' ? `புதிய சாதனம் சேர்க்கப்பட்டது: ${fullName}` : `Custom model added & selected: ${fullName}`);
  }

  // ===================================================================
  // JOURNEY TRACKER MODULE (5 STAGES & CIRCULAR PASSPORT)
  // ===================================================================
  function loadTrackedDevices() {
    try {
      const saved = localStorage.getItem('relife_tracked_devices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for tracked devices', e);
    }
    return JSON.parse(JSON.stringify(RELIFE_DATA.seedTrackedDevices));
  }

  function saveTrackedDevices(devices) {
    try {
      localStorage.setItem('relife_tracked_devices', JSON.stringify(devices));
    } catch (e) {
      console.warn('Unable to save tracked devices', e);
    }
  }

  function getNextTrackedId() {
    let maxNum = 1000;
    state.trackedDevices.forEach(d => {
      const match = d.id && d.id.match(/^EW-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `EW-${maxNum + 1}`;
  }

  function formatDateTimeNow() {
    const d = new Date();
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function addAuditEntry(device, role, action) {
    if (!device.auditLog) device.auditLog = [];
    device.auditLog.unshift({
      timestamp: formatDateTimeNow(),
      isoDate: new Date().toISOString(),
      role: role,
      action: action
    });
  }

  function addTimelineStep(device, stage, label, actor, notes) {
    if (!device.timeline) device.timeline = [];
    device.timeline.push({
      stage: stage,
      label: label,
      timestamp: formatDateTimeNow(),
      actor: actor,
      notes: notes
    });
  }

  function initJourneyTracker() {
    if (dom.trackerRoleSelector) {
      dom.trackerRoleSelector.value = state.activeRole;
    }
    switchTrackerTab(state.activeTrackerTab || 'my-devices');
    switchRole(state.activeRole || 'owner');
    populateOwnerDropoffCentres();
    populateCollectorOrgDropdown();
    populateConsoleDeviceSelects();
    renderQuickTrackerChips();
  }

  function openTrackerScreen(tab, deviceId) {
    goToScreen('tracker');
    if (tab) switchTrackerTab(tab);
    if (deviceId) {
      trackDeviceById(deviceId);
    }
  }

  function switchTrackerTab(tab) {
    state.activeTrackerTab = tab;

    const tabBtns = [
      { id: 'my-devices', btn: dom.tabTrackerMyDevices, view: dom.viewMyDevices },
      { id: 'track-by-id', btn: dom.tabTrackerTrackById, view: dom.viewTrackById },
      { id: 'partner-console', btn: dom.tabTrackerConsole, view: dom.viewPartnerConsole },
      { id: 'sustainability-dashboard', btn: dom.tabTrackerSustainability, view: dom.viewSustainabilityDashboard }
    ];

    tabBtns.forEach(item => {
      if (item.btn) {
        if (item.id === tab) item.btn.classList.add('active');
        else item.btn.classList.remove('active');
      }
      if (item.view) {
        item.view.style.display = item.id === tab ? 'block' : 'none';
      }
    });

    renderActiveTrackerTab();
  }

  function renderActiveTrackerTab() {
    const tab = state.activeTrackerTab;
    if (tab === 'my-devices') {
      renderMyDevicesList();
    } else if (tab === 'track-by-id') {
      if (state.activeTrackedDevice) {
        renderDeviceTimeline(state.activeTrackedDevice);
      } else if (state.trackedDevices.length > 0) {
        trackDeviceById(state.trackedDevices[0].id);
      }
    } else if (tab === 'partner-console') {
      switchRole(state.activeRole);
    } else if (tab === 'sustainability-dashboard') {
      renderSustainabilityDashboard();
    }
  }

  function switchRole(role) {
    state.activeRole = role;
    if (dom.trackerRoleSelector) dom.trackerRoleSelector.value = role;

    if (dom.consoleOwnerSection) dom.consoleOwnerSection.style.display = role === 'owner' ? 'block' : 'none';
    if (dom.consoleCollectorSection) dom.consoleCollectorSection.style.display = role === 'collector' ? 'block' : 'none';
    if (dom.consoleInspectorSection) dom.consoleInspectorSection.style.display = role === 'repairer' ? 'block' : 'none';

    if (role === 'owner') {
      populateOwnerHandoverDevices();
    } else if (role === 'collector') {
      renderPendingPickupsList();
    } else if (role === 'repairer') {
      populateConsoleDeviceSelects();
      handleInspectorDeviceSelectChange();
    }
  }

  // --- Tab 1: My Devices ---
  function renderMyDevicesList() {
    const list = state.trackedDevices;
    if (dom.myDevicesCount) dom.myDevicesCount.textContent = `${list.length} devices`;
    if (!dom.myDevicesList) return;

    const t = RELIFE_DATA.translations[state.currentLang];
    dom.myDevicesList.innerHTML = '';

    if (list.length === 0) {
      dom.myDevicesList.innerHTML = `<div style="text-align: center; color: #64748B; padding: 24px;">No devices registered yet. Click "+ Register Device" to begin.</div>`;
      return;
    }

    list.forEach(dev => {
      const card = document.createElement('div');
      card.className = 'tracked-device-card';

      const stageInfo = RELIFE_DATA.journeyStages.find(s => s.id === dev.currentStage) || { name: dev.currentStage, step: 1 };
      const stageName = t[`stage_${dev.currentStage}`] || stageInfo.name;

      // 5-segment progress bar
      let segmentsHtml = '';
      for (let i = 1; i <= 5; i++) {
        let cls = 'progress-segment';
        if (i < dev.stageStep) cls += ' completed';
        else if (i === dev.stageStep) cls += ' current';
        segmentsHtml += `<div class="${cls}"></div>`;
      }

      const stagePillClass = `stage-pill stage-${dev.stageStep}`;

      card.innerHTML = `
        <div class="device-card-header">
          <div class="device-title-wrap">
            <h4>${dev.model}</h4>
            <div class="device-model-sub">${dev.brand} • ${dev.area} • Age: ${dev.ageYears}y</div>
          </div>
          <span class="passport-id-badge">${dev.id}</span>
        </div>
        <div class="journey-progress-bar">
          ${segmentsHtml}
        </div>
        <div class="device-status-row">
          <span class="${stagePillClass}">${stageName}</span>
          <span style="color: #64748B;">Reg: ${dev.dateRegistered || '29 Oct 2026'}</span>
        </div>
        <div style="font-size: 11.5px; color: #475569; margin-bottom: 8px;">
          <strong>Issue:</strong> ${dev.problem || 'Standard circular check'}
        </div>
        <div class="device-actions-row">
          <button type="button" class="btn-card-action btn-track-card" data-id="${dev.id}">
            📍 ${t.viewJourneyTimelineBtn || 'View Timeline'}
          </button>
          <button type="button" class="btn-card-action btn-label-card" data-id="${dev.id}">
            🏷️ ${t.printLabelBtn || 'Asset Tag'}
          </button>
        </div>
      `;

      card.querySelector('.btn-track-card').addEventListener('click', () => {
        openTrackerScreen('track-by-id', dev.id);
      });

      card.querySelector('.btn-label-card').addEventListener('click', () => {
        openPassportLabelModal(dev);
      });

      dom.myDevicesList.appendChild(card);
    });
  }

  // --- Tab 2: Track by ID & Vertical Timeline ---
  function renderQuickTrackerChips() {
    if (!dom.quickTrackerChips) return;
    dom.quickTrackerChips.innerHTML = '';
    state.trackedDevices.slice(0, 6).forEach(d => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip-id';
      chip.textContent = d.id;
      chip.addEventListener('click', () => {
        if (dom.trackerIdInput) dom.trackerIdInput.value = d.id;
        trackDeviceById(d.id);
      });
      dom.quickTrackerChips.appendChild(chip);
    });
  }

  function trackDeviceById(id) {
    const cleanId = (id || '').trim().toUpperCase();
    const dev = state.trackedDevices.find(d => d.id.toUpperCase() === cleanId);
    if (!dev) {
      showToast(state.currentLang === 'ta' ? `சாதன ஐடி ${cleanId} காணப்படவில்லை` : `Device ID ${cleanId} not found.`);
      return;
    }

    state.activeTrackedDevice = dev;
    if (dom.trackerIdInput) dom.trackerIdInput.value = dev.id;

    // Update URL hash for direct bookmarkable sharing
    window.location.hash = `track=${dev.id}`;

    renderDeviceTimeline(dev);
  }

  function renderDeviceTimeline(dev) {
    if (!dom.journeyDeviceSummary || !dom.journeyTimelineContainer) return;
    const t = RELIFE_DATA.translations[state.currentLang];

    dom.journeyDeviceSummary.style.display = 'flex';
    if (dom.summaryDeviceId) dom.summaryDeviceId.textContent = dev.id;
    if (dom.summaryDeviceModel) dom.summaryDeviceModel.textContent = `${dev.model} (${dev.brand})`;

    const stageInfo = RELIFE_DATA.journeyStages.find(s => s.id === dev.currentStage) || { name: dev.currentStage, step: 1 };
    const stageName = t[`stage_${dev.currentStage}`] || stageInfo.name;
    if (dom.summaryDeviceStage) {
      dom.summaryDeviceStage.textContent = stageName;
      dom.summaryDeviceStage.className = `stage-pill stage-${dev.stageStep}`;
    }

    if (dom.summaryDeviceHandler) {
      const lastEntry = dev.timeline && dev.timeline[dev.timeline.length - 1];
      dom.summaryDeviceHandler.textContent = lastEntry ? `Handled by: ${lastEntry.actor}` : `Area: ${dev.area}`;
    }

    // Render QR Code inside passport summary
    renderQRCodeInto(dom.summaryPassportQr, `https://relife-passport.vercel.app/#track=${dev.id}`, 64, 64);

    // Share link
    if (dom.summaryShareLink) {
      dom.summaryShareLink.onclick = () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#track=${dev.id}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('Shareable tracker link copied to clipboard!');
          });
        } else {
          showToast(`Tracking URL: ${shareUrl}`);
        }
      };
    }

    // 5 Stages Timeline
    dom.journeyTimelineContainer.innerHTML = '';
    const stages = RELIFE_DATA.journeyStages;

    stages.forEach((stg) => {
      const stepNum = stg.step;
      const node = document.createElement('div');

      let nodeState = 'pending';
      if (stepNum < dev.stageStep) nodeState = 'completed';
      else if (stepNum === dev.stageStep) nodeState = 'current';

      node.className = `timeline-step-node ${nodeState}`;

      // Find matching timeline entry
      const entry = (dev.timeline || []).find(e => e.stage === stg.id);
      const stageTitle = t[`stage_${stg.id}`] || stg.name;

      let iconHtml = `${stepNum}`;
      if (nodeState === 'completed') iconHtml = '✓';
      else if (nodeState === 'current') iconHtml = stg.icon;

      let timeText = entry ? entry.timestamp : 'Pending Stage';
      let actorText = entry ? entry.actor : 'Pending Assignment';
      let notesText = entry ? entry.notes : (t[`stageDesc_${stg.id}`] || 'Awaiting stage completion in circular custody.');

      node.innerHTML = `
        <div class="node-icon-holder">${iconHtml}</div>
        <div class="node-card-body">
          <div class="node-top-row">
            <h5>${stg.icon} ${stageTitle}</h5>
            <span class="node-timestamp">${timeText}</span>
          </div>
          <div class="node-meta-row">
            <span class="custodian-badge">👤 ${actorText}</span>
            <span class="custodian-badge">📍 ${dev.area}</span>
          </div>
          <p class="node-desc-text">${notesText}</p>
        </div>
      `;

      dom.journeyTimelineContainer.appendChild(node);
    });

    // Evidence Attachment Section
    if (dom.timelineEvidenceBox && dom.evidencePreviewContainer) {
      const outcome = dev.outcomeDetails;
      if (outcome && (outcome.evidenceName || outcome.evidenceDataUrl)) {
        dom.timelineEvidenceBox.style.display = 'block';
        const imgHtml = outcome.evidenceDataUrl
          ? `<img src="${outcome.evidenceDataUrl}" alt="Evidence Thumbnail" class="evidence-thumb-img">`
          : `<div style="font-size: 28px;">📄</div>`;

        dom.evidencePreviewContainer.innerHTML = `
          ${imgHtml}
          <div class="evidence-info">
            <div class="evidence-filename">📎 ${outcome.evidenceName || 'Verified_Chain_Of_Custody.pdf'}</div>
            <div class="evidence-note">Tamper-evident verification file recorded on ${outcome.recordedAt || '27 Oct 2026'}.</div>
          </div>
        `;
      } else {
        dom.timelineEvidenceBox.style.display = 'none';
      }
    }

    // Tamper-Evident Audit Log
    if (dom.journeyAuditLogList && dom.auditEntryCount) {
      const logs = dev.auditLog || [
        { timestamp: dev.dateRegistered || '29 Oct 2026', role: 'owner', action: `Device registered: ${dev.id}` }
      ];
      dom.auditEntryCount.textContent = `${logs.length} entries`;
      dom.journeyAuditLogList.innerHTML = logs.map(l => `
        <div class="audit-entry">
          <span>[${l.timestamp}] <strong>${l.role.toUpperCase()}</strong>: ${l.action}</span>
        </div>
      `).join('');
    }
  }

  // --- QR Code Generator Helper ---
  function renderQRCodeInto(containerEl, payloadText, width = 74, height = 74) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(containerEl, {
          text: payloadText,
          width: width,
          height: height,
          colorDark: '#0F172A',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });
        return;
      } catch (err) {
        console.warn('QRCode CDN library error, using SVG fallback', err);
      }
    }

    // SVG QR Fallback
    containerEl.innerHTML = `
      <svg width="${width}" height="${height}" viewBox="0 0 100 100" fill="#0F172A" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="10" y="10" width="28" height="28" fill="#1B8A5A"/>
        <rect x="16" y="16" width="16" height="16" fill="white"/>
        <rect x="20" y="20" width="8" height="8" fill="#1B8A5A"/>
        <rect x="62" y="10" width="28" height="28" fill="#1B8A5A"/>
        <rect x="68" y="16" width="16" height="16" fill="white"/>
        <rect x="72" y="20" width="8" height="8" fill="#1B8A5A"/>
        <rect x="10" y="62" width="28" height="28" fill="#1B8A5A"/>
        <rect x="16" y="68" width="16" height="16" fill="white"/>
        <rect x="20" y="72" width="8" height="8" fill="#1B8A5A"/>
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

  // --- Stage 1: Device Registration Form Handler ---
  function openDeviceRegisterModal(prefill) {
    if (dom.deviceRegistrationForm) dom.deviceRegistrationForm.reset();

    if (prefill) {
      if (dom.regDeviceType && prefill.type) dom.regDeviceType.value = prefill.type;
      if (dom.regDeviceBrand && prefill.brand) dom.regDeviceBrand.value = prefill.brand;
      if (dom.regDeviceModel && prefill.model) dom.regDeviceModel.value = prefill.model;
      if (dom.regDeviceCondition && prefill.condition) dom.regDeviceCondition.value = prefill.condition;
      if (dom.regDeviceProblem && prefill.problem) dom.regDeviceProblem.value = prefill.problem;
      if (dom.regDeviceAge && prefill.ageYears) dom.regDeviceAge.value = prefill.ageYears;
      if (dom.regDataSafetyCheck && prefill.dataSafetyConfirmed) dom.regDataSafetyCheck.checked = true;
    }

    if (dom.deviceRegisterModal) dom.deviceRegisterModal.style.display = 'flex';
  }

  function closeDeviceRegisterModal() {
    if (dom.deviceRegisterModal) dom.deviceRegisterModal.style.display = 'none';
  }

  function handleDeviceRegistrationSubmit(e) {
    e.preventDefault();

    if (!dom.regDataSafetyCheck || !dom.regDataSafetyCheck.checked) {
      showToast('Please confirm personal data wipe before registering.');
      return;
    }

    const type = dom.regDeviceType.value;
    const brand = dom.regDeviceBrand.value.trim();
    const model = dom.regDeviceModel.value.trim();
    const condition = dom.regDeviceCondition.value;
    const age = parseInt(dom.regDeviceAge.value, 10) || 3;
    const problem = dom.regDeviceProblem.value.trim();
    const owner = (dom.regOwnerName && dom.regOwnerName.value.trim()) || 'Device Owner';
    const area = dom.regDeviceArea.value.trim() || 'Chennai';

    const newId = getNextTrackedId();
    const nowTime = formatDateTimeNow();

    const newDevice = {
      id: newId,
      deviceType: type,
      brand: brand,
      model: model,
      condition: condition,
      problem: problem,
      ageYears: age,
      ownerName: owner,
      area: area,
      dataSafetyConfirmed: true,
      currentStage: 'registered',
      stageStep: 1,
      isVerified: false,
      dateRegistered: nowTime,
      timeline: [
        {
          stage: 'registered',
          label: 'Registered',
          timestamp: nowTime,
          actor: `Owner (${owner})`,
          notes: `Device registered with circular asset ID ${newId}. Data-safety certified.`
        }
      ],
      auditLog: [
        {
          timestamp: nowTime,
          isoDate: new Date().toISOString(),
          role: 'owner',
          action: `Device ${newId} registered with verified data wipe.`
        }
      ]
    };

    state.trackedDevices.unshift(newDevice);
    saveTrackedDevices(state.trackedDevices);

    closeDeviceRegisterModal();
    openPassportLabelModal(newDevice);

    renderMyDevicesList();
    renderQuickTrackerChips();
    populateConsoleDeviceSelects();

    showToast(state.currentLang === 'ta' ? `சாதனம் பதிவு செய்யப்பட்டது! ஐடி: ${newId}` : `Device registered! Passport ID: ${newId}`);
  }

  // --- Printable Passport Asset Label Modal ---
  function openPassportLabelModal(device) {
    if (!dom.passportLabelModal) return;
    state.activeTrackedDevice = device;

    if (dom.tagDisplayId) dom.tagDisplayId.textContent = device.id;
    if (dom.tagDisplayDevice) dom.tagDisplayDevice.textContent = `${device.model} (${device.brand})`;
    if (dom.tagDisplayStatus) dom.tagDisplayStatus.textContent = `Stage ${device.stageStep}: ${device.currentStage}`;
    if (dom.tagDisplayDate) dom.tagDisplayDate.textContent = device.dateRegistered || '29 Oct 2026';

    renderQRCodeInto(dom.passportLabelQr, `https://relife-passport.vercel.app/#track=${device.id}`, 90, 90);

    dom.passportLabelModal.style.display = 'flex';
  }

  function closePassportLabelModal() {
    if (dom.passportLabelModal) dom.passportLabelModal.style.display = 'none';
  }

  // --- Stage 2: Collection & Handover Handlers ---
  function populateOwnerDropoffCentres() {
    if (!dom.ownerDropoffCentreSelect) return;
    dom.ownerDropoffCentreSelect.innerHTML = '';
    const centres = RELIFE_DATA.providers;
    centres.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.area} • ${p.distance} km)`;
      dom.ownerDropoffCentreSelect.appendChild(opt);
    });
  }

  function populateOwnerHandoverDevices() {
    if (!dom.ownerHandoverDeviceSelect) return;
    dom.ownerHandoverDeviceSelect.innerHTML = '';
    const pending = state.trackedDevices.filter(d => d.currentStage === 'registered');
    if (pending.length === 0) {
      dom.ownerHandoverDeviceSelect.innerHTML = `<option value="">No pending registered devices</option>`;
      return;
    }
    pending.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.id} — ${d.model} (${d.brand})`;
      dom.ownerHandoverDeviceSelect.appendChild(opt);
    });
  }

  function handleSaveHandoverSchedule() {
    const devId = dom.ownerHandoverDeviceSelect ? dom.ownerHandoverDeviceSelect.value : '';
    if (!devId) {
      showToast('Please select a registered device.');
      return;
    }
    const dev = state.trackedDevices.find(d => d.id === devId);
    if (!dev) return;

    const mode = state.activeHandoverMode;
    let scheduleInfo = '';
    if (mode === 'dropoff') {
      const centreId = dom.ownerDropoffCentreSelect.value;
      const centre = RELIFE_DATA.providers.find(p => p.id === centreId);
      const centreName = centre ? centre.name : 'Authorized Drop-off Center';
      scheduleInfo = `Drop-off at ${centreName}`;
      dev.handoverType = 'dropoff';
      dev.dropoffCentre = centreName;
    } else {
      const dateVal = (dom.ownerPickupDate && dom.ownerPickupDate.value) || new Date().toISOString().split('T')[0];
      scheduleInfo = `Doorstep pickup requested for ${dateVal}`;
      dev.handoverType = 'pickup';
      dev.pickupDate = dateVal;
    }

    addAuditEntry(dev, 'owner', `Handover preference updated: ${scheduleInfo}`);
    saveTrackedDevices(state.trackedDevices);
    showToast(`Handover schedule saved for ${dev.id}!`);
  }

  function renderPendingPickupsList() {
    if (!dom.pendingPickupsList) return;
    dom.pendingPickupsList.innerHTML = '';
    const pending = state.trackedDevices.filter(d => d.currentStage === 'registered');

    if (pending.length === 0) {
      dom.pendingPickupsList.innerHTML = `<p style="font-size: 11.5px; color: #64748B; padding: 10px;">No pending pickups currently awaiting collection.</p>`;
      return;
    }

    pending.forEach(d => {
      const item = document.createElement('div');
      item.className = 'collector-pickup-row';
      item.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; margin-bottom:6px;';
      item.innerHTML = `
        <div>
          <strong>${d.id}</strong> — ${d.model}
          <div style="font-size: 10.5px; color: #64748B;">📍 ${d.area} • Owner: ${d.ownerName}</div>
        </div>
        <button type="button" class="btn-primary" style="font-size: 11px; padding: 4px 10px;" data-id="${d.id}">
          Select
        </button>
      `;

      item.querySelector('button').addEventListener('click', () => {
        if (dom.collectScanInput) dom.collectScanInput.value = d.id;
        showToast(`Device ${d.id} selected for collection confirmation.`);
      });

      dom.pendingPickupsList.appendChild(item);
    });
  }

  function populateCollectorOrgDropdown() {
    if (!dom.collectorOrgSelect) return;
    dom.collectorOrgSelect.innerHTML = '';
    const orgs = [
      'EcoFix Logistics Chennai',
      'GreenTech Logistics & Courier',
      'Tambaram Mobile Courier Hub',
      'ReNew Transport Network',
      'Direct Depot Drop-off'
    ];
    orgs.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      dom.collectorOrgSelect.appendChild(opt);
    });
  }

  function handleConfirmCollection() {
    const devId = (dom.collectScanInput ? dom.collectScanInput.value : '').trim().toUpperCase();
    if (!devId) {
      showToast('Please enter or scan a Device ID.');
      return;
    }

    const dev = state.trackedDevices.find(d => d.id.toUpperCase() === devId);
    if (!dev) {
      showToast(`Device ${devId} not found in registered database.`);
      return;
    }

    if (dev.currentStage !== 'registered') {
      showToast(`Device ${devId} is already at stage: ${dev.currentStage}`);
      return;
    }

    const collectorName = (dom.collectorNameInput && dom.collectorNameInput.value.trim()) || 'Certified Collector';
    const org = dom.collectorOrgSelect ? dom.collectorOrgSelect.value : 'Circular Logistics';
    const loc = (dom.collectorLocationInput && dom.collectorLocationInput.value.trim()) || dev.area;
    const nowTime = formatDateTimeNow();

    dev.currentStage = 'collected';
    dev.stageStep = 2;
    dev.collectionDetails = {
      collectorName: collectorName,
      organization: org,
      collectedAt: nowTime,
      location: loc
    };

    addTimelineStep(dev, 'collected', 'Collected', `${collectorName} (${org})`, `Physical custody transferred at ${loc}. Non-metal anti-static packaging used.`);
    addAuditEntry(dev, 'collector', `Custody collected by ${collectorName} (${org}) at ${loc}`);

    saveTrackedDevices(state.trackedDevices);

    renderPendingPickupsList();
    populateConsoleDeviceSelects();
    if (state.activeTrackedDevice && state.activeTrackedDevice.id === dev.id) {
      renderDeviceTimeline(dev);
    }

    showToast(state.currentLang === 'ta' ? `சாதனம் ${dev.id} பெறப்பட்டது!` : `Device ${dev.id} successfully collected!`);
  }

  // --- Stage 3: Inspection & Rule-based Sorting ---
  function populateConsoleDeviceSelects() {
    if (dom.inspectorDeviceSelect) {
      dom.inspectorDeviceSelect.innerHTML = '';
      const inspectable = state.trackedDevices.filter(d => ['collected', 'inspected', 'outcome_recorded'].includes(d.currentStage));
      inspectable.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.id} — ${d.model} [${d.currentStage.toUpperCase()}]`;
        dom.inspectorDeviceSelect.appendChild(opt);
      });
      if (inspectable.length > 0 && !dom.inspectorDeviceSelect.value) {
        dom.inspectorDeviceSelect.value = inspectable[0].id;
      }
    }

    if (dom.inspectionOverridePathway) {
      dom.inspectionOverridePathway.innerHTML = '';
      RELIFE_DATA.pathwayOptions.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.icon} ${p.name}`;
        dom.inspectionOverridePathway.appendChild(opt);
      });
    }

    if (dom.outcomePathwaySelect) {
      dom.outcomePathwaySelect.innerHTML = '';
      RELIFE_DATA.pathwayOptions.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.icon} ${p.name}`;
        dom.outcomePathwaySelect.appendChild(opt);
      });
    }

    if (dom.outcomeOrgSelect) {
      dom.outcomeOrgSelect.innerHTML = '';
      RELIFE_DATA.providers.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = `${p.name} (${p.area})`;
        dom.outcomeOrgSelect.appendChild(opt);
      });
      const customOpt = document.createElement('option');
      customOpt.value = 'Authorized CPCB Partner Recycler';
      customOpt.textContent = 'Authorized CPCB Partner Recycler';
      dom.outcomeOrgSelect.appendChild(customOpt);
    }
  }

  function renderInspectionChecklist() {
    if (!dom.inspectionChecklistGrid) return;
    dom.inspectionChecklistGrid.innerHTML = '';
    const comps = RELIFE_DATA.inspectionComponents;

    comps.forEach(comp => {
      const row = document.createElement('div');
      row.className = 'component-inspect-row';

      const currentVal = state.inspectionChecks[comp.id] || 'working';

      row.innerHTML = `
        <span class="comp-name-lbl">${comp.icon} ${comp.name}</span>
        <div class="comp-status-group">
          <button type="button" class="check-chip ${currentVal === 'working' ? 'selected' : ''}" data-comp="${comp.id}" data-val="working">Working</button>
          <button type="button" class="check-chip ${currentVal === 'damaged' ? 'selected' : ''}" data-comp="${comp.id}" data-val="damaged">Damaged</button>
          <button type="button" class="check-chip ${currentVal === 'untested' ? 'selected' : ''}" data-comp="${comp.id}" data-val="untested">Untested</button>
        </div>
      `;

      row.querySelectorAll('.check-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const cid = chip.dataset.comp;
          const cval = chip.dataset.val;
          state.inspectionChecks[cid] = cval;

          row.querySelectorAll('.check-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');

          evaluateInspectionRuleSuggestion();
        });
      });

      dom.inspectionChecklistGrid.appendChild(row);
    });

    evaluateInspectionRuleSuggestion();
  }

  function handleInspectorDeviceSelectChange() {
    const devId = dom.inspectorDeviceSelect ? dom.inspectorDeviceSelect.value : '';
    if (!devId) return;
    const dev = state.trackedDevices.find(d => d.id === devId);
    if (!dev) return;

    if (dev.inspectionDetails) {
      state.activeInspectionBoot = dev.inspectionDetails.boots ? 'boots' : 'no-boot';
      state.inspectionChecks = Object.assign({}, dev.inspectionDetails.components || {});
    } else {
      state.activeInspectionBoot = 'boots';
      state.inspectionChecks = {
        screen: 'working',
        battery: 'working',
        ram: 'working',
        storage: 'working',
        motherboard: 'working',
        charger_port: 'working',
        keyboard: 'working',
        camera: 'working'
      };
    }

    if (dom.btnBootYes && dom.btnBootNo) {
      if (state.activeInspectionBoot === 'boots') {
        dom.btnBootYes.classList.add('active');
        dom.btnBootNo.classList.remove('active');
      } else {
        dom.btnBootNo.classList.add('active');
        dom.btnBootYes.classList.remove('active');
      }
    }

    renderInspectionChecklist();
  }

  function evaluateInspectionRuleSuggestion() {
    const devId = dom.inspectorDeviceSelect ? dom.inspectorDeviceSelect.value : '';
    const dev = state.trackedDevices.find(d => d.id === devId) || { ageYears: 3 };

    const boots = state.activeInspectionBoot === 'boots';
    const checks = state.inspectionChecks;

    const isWorking = (c) => checks[c] === 'working';
    const isDamaged = (c) => checks[c] === 'damaged';

    let workingCount = 0;
    let damagedCount = 0;
    Object.values(checks).forEach(v => {
      if (v === 'working') workingCount++;
      if (v === 'damaged') damagedCount++;
    });

    const valuablePartsWorking = ['ram', 'storage', 'screen', 'charger_port'].filter(isWorking);
    const batteryDamaged = isDamaged('battery');

    let pathway = 'recycled';
    let reasonEn = '';
    let reasonTa = '';

    if (boots && workingCount >= 5 && damagedCount <= 2) {
      pathway = 'repaired';
      reasonEn = 'Device boots and majority of key modules are operational. Component repair is highly economical.';
      reasonTa = 'சாதனம் தொடங்குகிறது மற்றும் பெரும்பாலான பாகங்கள் இயங்குகின்றன. பழுதுபார்ப்பு பரிந்துரைக்கப்படுகிறது.';
    } else if (boots && (dev.ageYears >= 4 || workingCount >= 4)) {
      pathway = 'refurbished';
      reasonEn = 'Device powers on with stable core system. Recommended for certified refurbishment and resale.';
      reasonTa = 'சாதனம் தொடங்குகிறது. சான்றளிக்கப்பட்ட புதுப்பித்தல் மற்றும் மறுவிற்பனைக்கு ஏற்றது.';
    } else if (!boots && valuablePartsWorking.length > 0) {
      pathway = 'parts_recovered';
      reasonEn = `Motherboard/power dead, but high-value components (${valuablePartsWorking.join(', ')}) can be rescued for circular reuse.`;
      reasonTa = `சாதனம் ஆன் ஆகவில்லை, ஆனால் மதிப்புமிக்க பாகங்கள் மீட்கப்பட்டு மறுபயன்பாட்டிற்கு உதவும்.`;
    } else {
      pathway = 'recycled';
      reasonEn = 'Substantial hardware damage across critical modules. Send to certified e-waste recycler for zero-landfill metal extraction.';
      reasonTa = 'பெரும்பாலான பாகங்கள் சேதமடைந்துள்ளன. சான்றளிக்கப்பட்ட மின்-கழிவு மறுசுழற்சிக்கு அனுப்பவும்.';
    }

    state.inspectionSuggestedPathway = pathway;
    state.inspectionForcedBatteryRecycle = batteryDamaged;

    if (dom.suggestedPathwayPill) {
      const pObj = RELIFE_DATA.pathwayOptions.find(p => p.id === pathway) || { name: pathway };
      dom.suggestedPathwayPill.textContent = `${pObj.name}`;
    }

    if (dom.suggestedPathwayDesc) {
      dom.suggestedPathwayDesc.textContent = state.currentLang === 'ta' ? reasonTa : reasonEn;
    }

    if (dom.inspectionOverridePathway) {
      dom.inspectionOverridePathway.value = pathway;
    }

    // Battery Safety Rule Display
    if (dom.inspectionBatteryDanger) {
      dom.inspectionBatteryDanger.style.display = batteryDamaged ? 'block' : 'none';
    }

    // Component Recovery Shortcut Button
    if (dom.inspectionRescueLinkWrap) {
      dom.inspectionRescueLinkWrap.style.display = pathway === 'parts_recovered' ? 'block' : 'none';
    }
  }

  function handleListWorkingPartsOnRescue() {
    const devId = dom.inspectorDeviceSelect ? dom.inspectorDeviceSelect.value : '';
    const dev = state.trackedDevices.find(d => d.id === devId);
    if (!dev) return;

    // Open rescue screen
    openRescueScreen('have', dev.id);

    // Pre-fill first working part
    const checks = state.inspectionChecks;
    const workingPart = Object.keys(checks).find(k => checks[k] === 'working' && ['ram', 'storage', 'screen', 'keyboard', 'camera'].includes(k));

    if (workingPart && dom.partComponentType) {
      dom.partComponentType.value = workingPart === 'storage' ? 'ssd' : workingPart;
      if (dom.partSpec) {
        dom.partSpec.value = `OEM ${workingPart.toUpperCase()} from ${dev.model} (Tested & Inspected)`;
      }
    }

    showToast(`Working components from ${dev.id} pre-filled for Rescue listing!`);
  }

  function handleSubmitInspection() {
    const devId = dom.inspectorDeviceSelect ? dom.inspectorDeviceSelect.value : '';
    if (!devId) {
      showToast('Please select a device to inspect.');
      return;
    }

    const dev = state.trackedDevices.find(d => d.id === devId);
    if (!dev) return;

    const boots = state.activeInspectionBoot === 'boots';
    const pathway = dom.inspectionOverridePathway ? dom.inspectionOverridePathway.value : state.inspectionSuggestedPathway;
    const notes = (dom.inspectorNotesInput && dom.inspectorNotesInput.value.trim()) || 'Technical inspection completed.';
    const nowTime = formatDateTimeNow();

    dev.currentStage = 'inspected';
    dev.stageStep = 3;
    dev.inspectionDetails = {
      boots: boots,
      inspectedAt: nowTime,
      inspectorName: 'Inspection Partner Lead',
      components: Object.assign({}, state.inspectionChecks),
      suggestedPathway: state.inspectionSuggestedPathway,
      finalPathway: pathway,
      inspectorNotes: notes
    };

    let safetySuffix = '';
    if (state.inspectionForcedBatteryRecycle) {
      safetySuffix = ' [CRITICAL: Battery marked damaged and routed for certified recycling]';
    }

    addTimelineStep(dev, 'inspected', 'Inspected', 'Inspection Partner', `Hardware check: ${boots ? 'Boots OK' : 'Does not boot'}. Pathway: ${pathway}.${safetySuffix}`);
    addAuditEntry(dev, 'inspector', `Inspection completed by Partner. Pathway: ${pathway}`);

    saveTrackedDevices(state.trackedDevices);

    populateConsoleDeviceSelects();
    if (state.activeTrackedDevice && state.activeTrackedDevice.id === dev.id) {
      renderDeviceTimeline(dev);
    }

    showToast(state.currentLang === 'ta' ? `ஆய்வு பதிவு செய்யப்பட்டது: ${dev.id}` : `Hardware inspection recorded for ${dev.id}!`);
  }

  // --- Stage 4: Outcome Recording & Verification ---
  function handleEvidenceUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      state.outcomeEvidenceDataUrl = evt.target.result;
      state.outcomeEvidenceFileName = file.name;

      if (dom.evidencePreviewImg) dom.evidencePreviewImg.src = evt.target.result;
      if (dom.evidenceFilenameDisplay) dom.evidenceFilenameDisplay.textContent = file.name;
      if (dom.evidenceFilePreviewWrap) dom.evidenceFilePreviewWrap.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function removeEvidence() {
    state.outcomeEvidenceDataUrl = null;
    state.outcomeEvidenceFileName = null;
    if (dom.evidenceFilePreviewWrap) dom.evidenceFilePreviewWrap.style.display = 'none';
    if (dom.evidenceFileInput) dom.evidenceFileInput.value = '';
  }

  function handleRecordOutcome() {
    const devId = dom.inspectorDeviceSelect ? dom.inspectorDeviceSelect.value : '';
    if (!devId) {
      showToast('Please select a device.');
      return;
    }
    const dev = state.trackedDevices.find(d => d.id === devId);
    if (!dev) return;

    const pathway = dom.outcomePathwaySelect.value;
    const org = dom.outcomeOrgSelect.value;
    const costPaid = parseInt(dom.outcomeCostInput.value, 10) || 0;
    const newPrice = parseInt(dom.outcomeNewpriceInput.value, 10) || 25000;
    const userSaved = Math.max(0, newPrice - costPaid);
    const nowTime = formatDateTimeNow();

    dev.currentStage = 'outcome_recorded';
    dev.stageStep = 4;
    dev.isVerified = false;

    dev.outcomeDetails = {
      pathway: pathway,
      organization: org,
      recordedAt: nowTime,
      repairCost: costPaid,
      newPrice: newPrice,
      userSaved: userSaved,
      evidenceName: state.outcomeEvidenceFileName || 'Circular_Outcome_Receipt.pdf',
      evidenceDataUrl: state.outcomeEvidenceDataUrl || null
    };

    addTimelineStep(dev, 'outcome_recorded', 'Outcome Recorded', org, `Pathway: ${pathway}. Handling entity: ${org}. Cost: ₹${formatINR(costPaid)}. Pending audit verification.`);
    addAuditEntry(dev, 'repairer', `Final outcome recorded by ${org}: ${pathway}`);

    saveTrackedDevices(state.trackedDevices);

    if (state.activeTrackedDevice && state.activeTrackedDevice.id === dev.id) {
      renderDeviceTimeline(dev);
    }

    showToast(state.currentLang === 'ta' ? `முடிவு பதிவு செய்யப்பட்டது (சரிபார்ப்பு நிலுவையில் உள்ளது)` : `Outcome recorded! Status: Outcome Recorded (Awaiting Verification)`);
  }

  function handleVerifyOutcome() {
    const devId = dom.inspectorDeviceSelect ? dom.inspectorDeviceSelect.value : '';
    if (!devId) {
      showToast('Please select a device.');
      return;
    }
    const dev = state.trackedDevices.find(d => d.id === devId);
    if (!dev) return;

    if (!dev.outcomeDetails) {
      handleRecordOutcome();
    }

    const nowTime = formatDateTimeNow();
    dev.currentStage = 'completed_verified';
    dev.stageStep = 5;
    dev.isVerified = true;
    dev.verifiedAt = nowTime;
    dev.verifiedBy = 'Audit Partner Certification';

    addTimelineStep(dev, 'completed_verified', 'Completed - Verified', 'Auditor & Partner', `Evidence audited and tamper-evident chain of custody verified. Officially counted toward sustainability metrics.`);
    addAuditEntry(dev, 'repairer', `Audit verification confirmed by Partner for ${dev.id}`);

    saveTrackedDevices(state.trackedDevices);

    if (state.activeTrackedDevice && state.activeTrackedDevice.id === dev.id) {
      renderDeviceTimeline(dev);
    }

    renderSustainabilityDashboard();

    showToast(state.currentLang === 'ta' ? `வெற்றிகரமாக சரிபார்க்கப்பட்டது! அதிகாரப்பூர்வ தாக்கம் பதிவு செய்யப்பட்டது ✅` : `Outcome Verified! Tamper-evident impact added to Sustainability Dashboard ✅`);
  }

  // --- Stage 5: Sustainability Dashboard & SVG Donut Chart ---
  function renderSustainabilityDashboard() {
    const all = state.trackedDevices;
    const verified = all.filter(d => d.currentStage === 'completed_verified' || d.isVerified);
    const pending = all.filter(d => d.currentStage !== 'completed_verified' && !d.isVerified);

    if (dom.metricVerifiedCount) dom.metricVerifiedCount.textContent = `${verified.length}`;
    if (dom.metricPendingCount) dom.metricPendingCount.textContent = `${pending.length}`;

    let countRepaired = 0;
    let countReused = 0;
    let countDonated = 0;
    let countParts = 0;
    let countRecycled = 0;
    let totalSavings = 0;
    let totalCo2 = 0;
    let totalEwaste = 0;

    verified.forEach(d => {
      const pathway = (d.outcomeDetails && d.outcomeDetails.pathway) || 'recycled';
      if (pathway === 'repaired') countRepaired++;
      else if (pathway === 'refurbished') countReused++;
      else if (pathway === 'donated') countDonated++;
      else if (pathway === 'parts_recovered') countParts++;
      else if (pathway === 'recycled') countRecycled++;

      // User savings only for verified repair or reuse/donation transactions
      if (['repaired', 'refurbished', 'donated'].includes(pathway) && d.outcomeDetails) {
        totalSavings += (d.outcomeDetails.userSaved || 0);
      }

      // Environmental factors
      const factor = (d.deviceType === 'laptop') ? RELIFE_DATA.impactFactors.laptop : RELIFE_DATA.impactFactors.phone;
      if (pathway === 'parts_recovered') {
        totalCo2 += RELIFE_DATA.impactFactors.part.co2 * 2;
        totalEwaste += RELIFE_DATA.impactFactors.part.ewaste * 2;
      } else {
        totalCo2 += factor.co2;
        totalEwaste += factor.ewaste;
      }
    });

    if (dom.sustMetricRepaired) dom.sustMetricRepaired.textContent = `${countRepaired}`;
    if (dom.sustMetricReused) dom.sustMetricReused.textContent = `${countReused}`;
    if (dom.sustMetricDonated) dom.sustMetricDonated.textContent = `${countDonated}`;
    if (dom.sustMetricParts) dom.sustMetricParts.textContent = `${countParts}`;
    if (dom.sustMetricRecycled) dom.sustMetricRecycled.textContent = `${countRecycled}`;

    if (dom.sustMetricSavings) dom.sustMetricSavings.textContent = `₹${formatINR(totalSavings)}`;
    if (dom.sustMetricCo2) dom.sustMetricCo2.textContent = `${Math.round(totalCo2)} kg`;
    if (dom.sustMetricEwaste) dom.sustMetricEwaste.textContent = `${totalEwaste.toFixed(1)} kg`;

    // Summary Sentence
    const totalReusedOrRepaired = countRepaired + countReused;
    const summaryEn = `${totalReusedOrRepaired} devices reused/repaired, ${countDonated} donated to education, and ${countRecycled} sent to authorised zero-landfill recyclers.`;
    const summaryTa = `${totalReusedOrRepaired} சாதனங்கள் பழுதுபார்க்கப்பட்டு மறுபயன்படுத்தப்பட்டன, ${countDonated} கல்விக்கு நன்கொடை அளிக்கப்பட்டன, மற்றும் ${countRecycled} அங்கீகரிக்கப்பட்ட மறுசுழற்சிக்கு அனுப்பப்பட்டன.`;

    if (dom.sustainabilitySummarySentence) {
      dom.sustainabilitySummarySentence.textContent = state.currentLang === 'ta' ? summaryTa : summaryEn;
    }

    // Render SVG Donut Chart
    renderDonutChart({
      repaired: countRepaired,
      reused: countReused,
      donated: countDonated,
      parts: countParts,
      recycled: countRecycled
    });
  }

  function renderDonutChart(data) {
    if (!dom.sustainabilityDonutSvg || !dom.donutLegend) return;
    const total = Object.values(data).reduce((acc, v) => acc + v, 0);

    const slices = [
      { key: 'repaired', label: 'Repaired', count: data.repaired, color: '#10B981' },
      { key: 'reused', label: 'Refurbished', count: data.reused, color: '#3B82F6' },
      { key: 'donated', label: 'Donated', count: data.donated, color: '#8B5CF6' },
      { key: 'parts', label: 'Parts Rescued', count: data.parts, color: '#F59E0B' },
      { key: 'recycled', label: 'Recycled', count: data.recycled, color: '#059669' }
    ];

    if (total === 0) {
      dom.sustainabilityDonutSvg.innerHTML = `
        <circle cx="80" cy="80" r="50" fill="transparent" stroke="#E2E8F0" stroke-width="20" />
        <text x="80" y="85" text-anchor="middle" font-size="12" fill="#64748B" font-weight="700">No Data</text>
      `;
      dom.donutLegend.innerHTML = '';
      return;
    }

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    let circlesSvg = '';
    slices.forEach(sl => {
      if (sl.count === 0) return;
      const fraction = sl.count / total;
      const strokeDasharray = `${fraction * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += fraction * circumference;

      circlesSvg += `
        <circle cx="80" cy="80" r="${radius}" fill="transparent"
                stroke="${sl.color}" stroke-width="20"
                stroke-dasharray="${strokeDasharray}"
                stroke-dashoffset="${strokeDashoffset}"
                transform="rotate(-90 80 80)" />
      `;
    });

    dom.sustainabilityDonutSvg.innerHTML = `
      ${circlesSvg}
      <text x="80" y="78" text-anchor="middle" font-size="16" fill="#0F172A" font-weight="800">${total}</text>
      <text x="80" y="93" text-anchor="middle" font-size="9" fill="#64748B" font-weight="700">VERIFIED</text>
    `;

    dom.donutLegend.innerHTML = slices.filter(s => s.count > 0).map(s => `
      <div class="donut-legend-item">
        <span class="legend-dot" style="background: ${s.color};"></span>
        <span>${s.label}: <strong>${s.count}</strong></span>
      </div>
    `).join('');
  }

  // --- Barcode Scanner Simulation & Hash Routing ---
  function openBarcodeScannerModal() {
    if (!dom.barcodeScannerModal) return;
    if (dom.scannerSelectDevice) {
      dom.scannerSelectDevice.innerHTML = '<option value="">-- Choose registered device --</option>';
      state.trackedDevices.filter(d => d.currentStage === 'registered').forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.id} — ${d.model} (${d.ownerName})`;
        dom.scannerSelectDevice.appendChild(opt);
      });
    }
    if (dom.scannerManualInput) dom.scannerManualInput.value = '';
    dom.barcodeScannerModal.style.display = 'flex';
  }

  function closeBarcodeScannerModal() {
    if (dom.barcodeScannerModal) dom.barcodeScannerModal.style.display = 'none';
  }

  function handleConfirmSimulatedScan() {
    const selected = (dom.scannerSelectDevice && dom.scannerSelectDevice.value) || '';
    const manual = (dom.scannerManualInput && dom.scannerManualInput.value.trim().toUpperCase()) || '';
    const targetId = selected || manual;

    if (!targetId) {
      showToast('Please select or type a Device ID.');
      return;
    }

    if (dom.collectScanInput) {
      dom.collectScanInput.value = targetId;
    }
    closeBarcodeScannerModal();
    showToast(`QR Code scanned: ${targetId}`);
  }

  function handleHashRouting() {
    if (typeof window === 'undefined' || !window.location || !window.location.hash) return;
    const hash = window.location.hash;
    const match = hash.match(/#track=([A-Za-z0-9\-]+)/);
    if (match && match[1]) {
      const devId = match[1];
      openTrackerScreen('track-by-id', devId);
    }
  }

  // --- Cross-Linking Handlers ---
  function handleResultToTracker() {
    if (!state.decision) {
      openDeviceRegisterModal();
      return;
    }
    const dev = state.decision.device;
    const probKey = state.problem;
    const t = RELIFE_DATA.translations[state.currentLang];
    const probObj = (t.problems || {})[probKey] || { title: probKey };

    openDeviceRegisterModal({
      type: dev.type,
      brand: dev.brand || 'Device',
      model: dev.name,
      condition: state.isWorking ? 'Working' : 'Not working',
      problem: probObj.title || 'Screen/Hardware issue',
      ageYears: state.ageYears,
      dataSafetyConfirmed: false
    });
  }

  function handleCertToTracker() {
    if (!state.decision) {
      openDeviceRegisterModal();
      return;
    }
    const dev = state.decision.device;
    openDeviceRegisterModal({
      type: dev.type,
      brand: dev.brand || 'Device',
      model: dev.name,
      condition: state.isWorking ? 'Working' : 'Partly working',
      problem: state.problem || 'Passed data-safety wizard',
      ageYears: state.ageYears,
      dataSafetyConfirmed: true
    });
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
