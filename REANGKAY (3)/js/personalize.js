/* =========================================================
   REANGKAY — Personalize Wizard + Homepage Journey Renderer
   =========================================================
   This single file handles TWO pages:
     1) personalize.html  -> runs the wizard, saves answers
     2) index.html         -> reads the saved answers and
                              renders the "journey" card

   Data is stored in localStorage under the key "reangkayProfile":
   {
     gender: "girl" | "boy" | "neutral",
     age:    "13-14" | "15-16" | "17-19",
     step4:  { ...answers... },
     completedAt: ISOString
   }
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "reangkayProfile";
  const DONE_KEY = "onboardingDone";

  const state = {
    gender: null,
    age: null,
    step4: {}
  };

  /* ---------------------------------------------------------
     Helpers
  --------------------------------------------------------- */
  function saveProfile() {
    const profile = {
      gender: state.gender,
      age: state.age,
      step4: state.step4,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(DONE_KEY, "true");
    return profile;
  }

  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* ---------------------------------------------------------
     PART 1 — WIZARD (personalize.html)
  --------------------------------------------------------- */
  function initWizard() {
    const stage = document.getElementById("wizardStage");
    if (!stage) return; // not on personalize.html

    const steps = Array.from(document.querySelectorAll(".wizard-step"));
    const progressFill = document.getElementById("progressFill");
    const progressDots = Array.from(document.querySelectorAll(".progress-dot"));
    let currentStep = 1;
    const totalSteps = steps.length;

    function showStep(stepNum) {
      steps.forEach((sec) => {
        sec.classList.toggle("active", Number(sec.dataset.step) === stepNum);
      });
      progressDots.forEach((dot) => {
        dot.classList.toggle("active", Number(dot.dataset.step) <= stepNum);
      });
      if (progressFill) {
        const pct = ((stepNum - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = pct + "%";
      }
      currentStep = stepNum;

      if (stepNum === 4) renderStep4();
      if (stepNum === 5) renderStep5();
    }

    // "Get Started" on step 1
    const btnGetStarted = document.getElementById("btnGetStarted");
    if (btnGetStarted) {
      btnGetStarted.addEventListener("click", () => showStep(2));
    }

    // Back / Next buttons inside each step
    stage.addEventListener("click", (e) => {
      const backBtn = e.target.closest('[data-action="back"]');
      const nextBtn = e.target.closest('[data-action="next"]');

      if (backBtn) {
        showStep(Math.max(1, currentStep - 1));
      }

      if (nextBtn && !nextBtn.disabled) {
        showStep(Math.min(totalSteps, currentStep + 1));
      }
    });

    // Selectable cards (gender / age / step4)
    stage.addEventListener("click", (e) => {
      const card = e.target.closest(".select-card");
      if (!card) return;

      const group = card.dataset.group;
      const value = card.dataset.value;
      const container = card.closest(`[role="group"]`) || card.parentElement.parentElement;

      // Single-select within the same group
      const siblings = container.querySelectorAll(
        `.select-card[data-group="${group}"]`
      );
      siblings.forEach((s) => s.classList.remove("selected"));
      card.classList.add("selected");

      if (group === "gender") {
        state.gender = value;
        enableNextFor(2);
      } else if (group === "age") {
        state.age = value;
        enableNextFor(3);
      } else {
        // dynamic step4 groups, e.g. data-group="interest", "concern", etc.
        state.step4[group] = value;
      }
    });

    function enableNextFor(stepNum) {
      const stepEl = document.getElementById("step" + stepNum);
      if (!stepEl) return;
      const nextBtn = stepEl.querySelector('[data-action="next"]');
      if (nextBtn) nextBtn.disabled = false;
    }

function renderStep4() {
  const container = document.getElementById("step4Content");
  if (!container || container.dataset.rendered === "true") return;

  const questionsByGender = {
    girl: [
      {
        group: "interest",
        title: "តើអ្នកចង់រៀនអំពីអ្វីជាលើកដំបូង?",
        options: [
          { value: "puberty", icon: "fa-seedling", label: "ការផ្លាស់ប្តូររាងកាយ" },
          { value: "period", icon: "fa-droplet", label: "រដូវ & វដ្ត" },
          { value: "mental", icon: "fa-brain", label: "អារម្មណ៍ & សុខភាពផ្លូវចិត្ត" },
          { value: "safety", icon: "fa-shield-heart", label: "សុវត្ថិភាព" }
        ]
      },
      {
        group: "comfort",
        title: "តើអ្នកមានកម្រិតផាសុខភាពប៉ុណ្ណា ក្នុងការនិយាយអំពីប្រធានបទសុខភាព?",
        options: [
          { value: "low", icon: "fa-face-frown", label: "មិនសូវមាន" },
          { value: "medium", icon: "fa-face-meh", label: "មធ្យម" },
          { value: "high", icon: "fa-face-smile", label: "មានច្រើន" }
        ]
      }
    ],
    boy: [
      {
        group: "interest",
        title: "តើអ្នកចង់រៀនអំពីអ្វីជាលើកដំបូង?",
        options: [
          { value: "puberty", icon: "fa-seedling", label: "ការផ្លាស់ប្តូររាងកាយ" },
          { value: "fitness", icon: "fa-person-running", label: "កីឡា & ការលូតលាស់" },
          { value: "mental", icon: "fa-brain", label: "អារម្មណ៍ & សុខភាពផ្លូវចិត្ត" },
          { value: "safety", icon: "fa-shield-heart", label: "សុវត្ថិភាព" }
        ]
      },
      {
        group: "comfort",
        title: "តើអ្នកមានកម្រិតផាសុខភាពប៉ុណ្ណា ក្នុងការនិយាយអំពីប្រធានបទសុខភាព?",
        options: [
          { value: "low", icon: "fa-face-frown", label: "មិនសូវមាន" },
          { value: "medium", icon: "fa-face-meh", label: "មធ្យម" },
          { value: "high", icon: "fa-face-smile", label: "មានច្រើន" }
        ]
      }
    ],
    neutral: [
      {
        group: "interest",
        title: "តើអ្នកចង់រៀនអំពីអ្វីជាលើកដំបូង?",
        options: [
          { value: "puberty", icon: "fa-seedling", label: "ការផ្លាស់ប្តូររាងកាយ" },
          { value: "mental", icon: "fa-brain", label: "អារម្មណ៍ & សុខភាពផ្លូវចិត្ត" },
          { value: "nutrition", icon: "fa-apple-whole", label: "អាហារូបត្ថម្ភ" },
          { value: "safety", icon: "fa-shield-heart", label: "សុវត្ថិភាព" }
        ]
      },
      {
        group: "comfort",
        title: "តើអ្នកមានកម្រិតផាសុខភាពប៉ុណ្ណា ក្នុងការនិយាយអំពីប្រធានបទសុខភាព?",
        options: [
          { value: "low", icon: "fa-face-frown", label: "មិនសូវមាន" },
          { value: "medium", icon: "fa-face-meh", label: "មធ្យម" },
          { value: "high", icon: "fa-face-smile", label: "មានច្រើន" }
        ]
      }
    ]
  };

  const set = questionsByGender[state.gender] || questionsByGender.neutral;

  container.innerHTML = set
    .map(
      (q, qi) => `
        <div class="mb-4">
          <p class="fw-semibold mb-2">${q.title}</p>
          <div class="row g-3" role="group" aria-label="${q.title}">
            ${q.options
              .map(
                (opt) => `
              <div class="col-6 col-md-3">
                <button type="button" class="select-card select-card--age" data-value="${opt.value}" data-group="${q.group}">
                  <span class="select-card-icon"><i class="fa-solid ${opt.icon}"></i></span>
                  <span class="select-card-label">${opt.label}</span>
                  <span class="select-check"><i class="fa-solid fa-circle-check"></i></span>
                </button>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  container.dataset.rendered = "true";
}

   /* ---------- ជំហានទី 5: ស្ថាបនាដំណើរផ្ទាល់ខ្លួន ---------- */
    const topicLibrary = {
      puberty: { title: "យល់ដឹងអំពីការផ្លាស់ប្តូររាងកាយ", icon: "fa-seedling", page: "information.html" },
      period: { title: "រដូវ និងវដ្តរបស់អ្នក", icon: "fa-droplet", page: "information.html" },
      fitness: { title: "កីឡា និងការលូតលាស់មានសុខភាពល្អ", icon: "fa-person-running", page: "information.html" },
      mental: { title: "អារម្មណ៍ និងសុខភាពផ្លូវចិត្ត", icon: "fa-brain", page: "information.html" },
      nutrition: { title: "មូលដ្ឋានអាហារូបត្ថម្ភ", icon: "fa-apple-whole", page: "information.html" },
      safety: { title: "ការរក្សាសុវត្ថិភាព", icon: "fa-shield-heart", page: "information.html" }
    };

    function buildJourney() {
      const picks = [];
      if (state.step4.interest && topicLibrary[state.step4.interest]) {
        picks.push(topicLibrary[state.step4.interest]);
      }
      // បំពេញដំណើរជាមួយជម្រើសល្អៗបន្ថែម
      Object.keys(topicLibrary).forEach((key) => {
        if (picks.length >= 3) return;
        if (!picks.includes(topicLibrary[key])) picks.push(topicLibrary[key]);
      });
      return picks.slice(0, 3);
    }

    function renderStep5() {
      const greetingEl = document.getElementById("journeyGreeting");
      const subtitleEl = document.getElementById("journeySubtitle");
      const timelineEl = document.getElementById("journeyTimeline");

      const genderLabel = { girl: "អ្នក", boy: "អ្នក", neutral: "អ្នក" }[state.gender] || "អ្នក";
      if (greetingEl) greetingEl.textContent = `អ្នកបានត្រៀមរួចរាល់ហើយ, ${genderLabel}!`;
      if (subtitleEl) {
        subtitleEl.textContent = state.age
          ? `នេះជាផ្លូវការសិក្សាដែលបានជ្រើសសម្រាប់អាយុ ${state.age}.`
          : "នេះជាដំណើរសិក្សារបស់អ្នក។";
      }

      if (timelineEl) {
        const journey = buildJourney();
        timelineEl.innerHTML = journey
          .map(
            (item, i) => `
          <div class="timeline-item d-flex align-items-start gap-3 mb-3">
            <div class="quick-access-icon" style="background:var(--green);color:var(--green-dark);">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <div>
              <p class="fw-semibold mb-0">${i + 1}. ${item.title}</p>
            </div>
          </div>
        `
          )
          .join("");
      }
    }

    const btnStartJourney = document.getElementById("btnStartJourney");
    if (btnStartJourney) {
      btnStartJourney.addEventListener("click", () => {
        saveProfile();
        window.location.href = "index.html";
      });
    }

    // ចាប់ផ្តើម
    showStep(1);
  }


 /* ---------------------------------------------------------
     ផ្នែកទី 2 — ការបង្ហាញទំព័រដើម (index.html)
  --------------------------------------------------------- */
  function initHomeJourney() {
    const timelineEl = document.getElementById("journeyTimeline");
    if (!timelineEl) return; // មិនមាន card ដំណើរនៅលើទំព័រនេះទេ
    // ប្រើសាខានេះតែបើនៅលើ index.html (មាន bottomnav / hero-name), មិនមែននៅលើទំព័រ wizard
    if (document.getElementById("wizardStage")) return;

    const profile = loadProfile();
    const greetingEl = document.getElementById("journeyGreeting");
    const subtitleEl = document.getElementById("journeySubtitle");
    const startBtn = document.getElementById("btnStartJourney");

    if (!profile) {
      // មិនទាន់មានប្រវត្តិរូប — លាក់ card ឬជំរុញឱ្យពួកគេប្តូរតាមបំណង
      const section = timelineEl.closest("section");
      if (section) {
        section.innerHTML = `
          <div class="card-r step-card text-center">
            <p class="fw-semibold mb-2">ប្តូរបទពិសោធន៍របស់អ្នកឱ្យផ្ទាល់ខ្លួន</p>
            <p class="text-muted-r small mb-3">ឆ្លើយសំណួរខ្លីៗមួយចំនួន ដើម្បីទទួលបានផែនការសិក្សាដែលត្រូវនឹងអ្នក។</p>
            <a href="personalize.html" class="btn-r btn-primary-r">ចាប់ផ្តើម <i class="fa-solid fa-arrow-right ms-2"></i></a>
          </div>
        `;
      }
      return;
    }


   const topicLibrary = {
      puberty: { title: "យល់ដឹងអំពីការផ្លាស់ប្តូររាងកាយ", icon: "fa-seedling" },
      period: { title: "រដូវ និងវដ្តរបស់អ្នក", icon: "fa-droplet" },
      fitness: { title: "កីឡា និងការលូតលាស់មានសុខភាពល្អ", icon: "fa-person-running" },
      mental: { title: "អារម្មណ៍ និងសុខភាពផ្លូវចិត្ត", icon: "fa-brain" },
      nutrition: { title: "មូលដ្ឋានអាហារូបត្ថម្ភ", icon: "fa-apple-whole" },
      safety: { title: "ការរក្សាសុវត្ថិភាព", icon: "fa-shield-heart" }
    };

    if (greetingEl) greetingEl.textContent = "ដំណើរផ្ទាល់ខ្លួនរបស់អ្នក";
    if (subtitleEl) {
      subtitleEl.textContent = profile.age
        ? `បានជ្រើសសម្រាប់អាយុ ${profile.age} ដោយផ្អែកលើចម្លើយរបស់អ្នក។`
        : "ផ្អែកលើអ្វីដែលអ្នកបានចែករំលែក នេះជាផែនការសិក្សារបស់អ្នក។";
    }

    const picks = [];
    if (profile.step4 && profile.step4.interest && topicLibrary[profile.step4.interest]) {
      picks.push(topicLibrary[profile.step4.interest]);
    }
    Object.keys(topicLibrary).forEach((key) => {
      if (picks.length >= 3) return;
      if (!picks.includes(topicLibrary[key])) picks.push(topicLibrary[key]);
    });

    timelineEl.innerHTML = picks
      .slice(0, 3)
      .map(
        (item, i) => `
      <div class="timeline-item d-flex align-items-start gap-3 mb-3">
        <div class="quick-access-icon" style="background:var(--green);color:var(--green-dark);">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div>
          <p class="fw-semibold mb-0">${i + 1}. ${item.title}</p>
        </div>
      </div>
    `
      )
      .join("");

    if (startBtn) {
      startBtn.textContent = "";
      startBtn.innerHTML = 'បន្តការសិក្សា <i class="fa-solid fa-arrow-right ms-2"></i>';
      startBtn.addEventListener("click", () => {
        window.location.href = "information.html";
      });
    }
  }

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initWizard();
    initHomeJourney();
  });
})();
document.getElementById("btnStartJourney").addEventListener("click", function () {

    localStorage.setItem("personalized", "true");

    window.location.href = "personalize.html";

});