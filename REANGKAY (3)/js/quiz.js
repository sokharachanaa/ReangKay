/* ==========================================================================
   quiz.js
   Health Challenge — Multiple Choice Quiz (Khmer only)
   REANGKAY | ល្បែង
   Each category (nutrition / mind / body) has its own question bank.
   Clicking a challenge card calls openQuiz(category), which drives the
   shared #quizModal / #quizBody through one question at a time.
   ========================================================================== */

const QUIZ_DATA = {

  nutrition: {
    title: "ព្រៃឈើអាហារូបត្ថម្ភ",
    icon: "🥗",
    iconBg: "var(--green)",
    barColor: "var(--green-dark)",
    xpPerCorrect: 10,
    questions: [
      {
        q: "តើអាហារប្រភេទណាមួយសំខាន់សម្រាប់ការលូតលាស់ឆ្អឹង?",
        options: ["ត្រី និងទឹកដោះគោ", "បង្អែម និងស្ករគ្រាប់", "ភេសជ្ជៈមានជាតិកាហ្វេអ៊ីន", "បាយចៀនប្រេង"],
        correct: 0
      },
      {
        q: "គួរផឹកទឹកសុទ្ធប៉ុន្មានកែវក្នុងមួយថ្ងៃ?",
        options: ["១ ដល់ ២ កែវ", "៦ ដល់ ៨ កែវ", "១៥ កែវ", "មិនចាំបាច់ផឹកទឹកទេ"],
        correct: 1
      },
      {
        q: "ហេតុអ្វីអាហារពេលព្រឹកមានសារៈសំខាន់?",
        options: ["ធ្វើឱ្យងងុយគេង", "ផ្តល់ថាមពលដើម្បីចាប់ផ្តើមថ្ងៃថ្មី", "ធ្វើឱ្យទំងន់ថយ", "គ្មានប្រយោជន៍ទេ"],
        correct: 1
      },
      {
        q: "ផ្លែឈើ និងបន្លែជួយអ្វីខ្លះដល់រាងកាយ?",
        options: ["ផ្តល់វីតាមីន និងជាតិសរសៃ", "ធ្វើឱ្យខ្លាញ់កើនឡើង", "គ្មានប្រយោជន៍ដល់សុខភាព", "បណ្តាលឱ្យឈឺពោះ"],
        correct: 0
      },
      {
        q: "ការញ៉ាំអាហារឆាប់រហ័ស (Fast food) ញឹកញាប់ អាចនាំឱ្យមានបញ្ហាអ្វី?",
        options: ["រាងកាយកាន់តែរឹងមាំ", "កើនហានិភ័យធាត់ និងជំងឺផ្សេងៗ", "ធ្វើឱ្យខ្ពស់លឿន", "គ្មានផលប៉ះពាល់ទាល់តែសោះ"],
        correct: 1
      }
    ]
  },

  mind: {
    title: "ភ្នំសុខភាពចិត្ត",
    icon: "🧠",
    iconBg: "var(--orange)",
    barColor: "var(--orange-dark)",
    xpPerCorrect: 10,
    questions: [
      {
        q: "នៅពេលមានអារម្មណ៍តានតឹង គួរធ្វើអ្វីជាមុនគេ?",
        options: ["ដកដង្ហើមជ្រៅៗ ឬនិយាយជាមួយអ្នកទុកចិត្ត", "លាក់អារម្មណ៍ខ្លួនឯងតែម្នាក់ឯង", "ខឹងនឹងអ្នកជុំវិញខ្លួន", "ញ៉ាំបង្អែមច្រើនៗ"],
        correct: 0
      },
      {
        q: "ការគេងមិនគ្រប់ម៉ោង ជះឥទ្ធិពលដល់អ្វី?",
        options: ["ធ្វើឱ្យខ្ពស់លឿនជាង", "អារម្មណ៍ និងការផ្តោតអារម្មណ៍អាក្រក់ទៅវិញ", "គ្មានផលប៉ះពាល់ទេ", "ធ្វើឱ្យរៀនពូកែជាង"],
        correct: 1
      },
      {
        q: "បើមិត្តម្នាក់ប្រាប់ថាកំពុងមានអារម្មណ៍ក្រៀមក្រំ គួរធ្វើដូចម្តេច?",
        options: ["សើចចំអកគាត់", "មិនអើពើ", "ស្តាប់ដោយចិត្តទន់ភ្លន់ និងលើកទឹកចិត្តឱ្យគាត់និយាយជាមួយអ្នកចាស់ទុំ", "ប្រាប់អ្នកដទៃទាំងអស់"],
        correct: 2
      },
      {
        q: "សកម្មភាពមួយណាអាចជួយកាត់បន្ថយស្ត្រេស?",
        options: ["ធ្វើលំហាត់ប្រាណ ឬស្តាប់ចម្រៀងដែលចូលចិត្ត", "នៅតែម្នាក់ឯងក្នុងបន្ទប់ងងឹត", "ខឹងនឹងគ្រួសារ", "មិនញ៉ាំបាយសោះ"],
        correct: 0
      },
      {
        q: "តើការនិយាយអំពីអារម្មណ៍ខ្លួនឯងជាមួយអ្នកជំនាញ ជាការល្អដែរឬទេ?",
        options: ["មិនល្អទេ ព្រោះជាការអាម៉ាស់", "ជាការល្អ ព្រោះជួយឱ្យយល់ និងដោះស្រាយបញ្ហាបាន", "គួរធ្វើតែពេលមានបញ្ហាធ្ងន់ធ្ងរប៉ុណ្ណោះ", "គ្មានតម្លៃអ្វីទាល់តែសោះ"],
        correct: 1
      }
    ]
  },

  body: {
    title: "ជ្រលងភ្នំរាងកាយ",
    icon: "💪",
    iconBg: "var(--male)",
    barColor: "var(--primary)",
    xpPerCorrect: 10,
    questions: [
      {
        q: "គួរធ្វើលំហាត់ប្រាណប៉ុន្មាននាទីក្នុងមួយថ្ងៃ ដើម្បីមានសុខភាពល្អ?",
        options: ["ប្រហែល ៣០ នាទី", "១០ វិនាទី", "១ ម៉ោង ១២ដង", "មិនចាំបាច់ធ្វើទេ"],
        correct: 0
      },
      {
        q: "ការផ្លាស់ប្តូររាងកាយក្នុងវ័យជំទង់ គឺជាបញ្ហាធម្មតាទេ?",
        options: ["ជាបញ្ហាធ្ងន់ធ្ងរ", "ជារឿងធម្មតា និងចាំបាច់សម្រាប់ការលូតលាស់", "កើតឡើងតែចំពោះមនុស្សខ្លះប៉ុណ្ណោះ", "មិនគួរនិយាយអំពីវាទេ"],
        correct: 1
      },
      {
        q: "អ្វីជាវិធីល្អសម្រាប់រក្សាមាត់ធ្មេញឱ្យស្អាត?",
        options: ["ត្រង់ធ្មេញ ២ដងក្នុងមួយថ្ងៃ", "ត្រង់ធ្មេញតែពេលឈឺធ្មេញ", "មិនចាំបាច់ត្រង់ធ្មេញ", "លាងមាត់ដោយទឹកសូដា"],
        correct: 0
      },
      {
        q: "ហេតុអ្វីត្រូវលាងដៃមុននិងក្រោយញ៉ាំបាយ?",
        options: ["ដើម្បីឱ្យដៃមានក្លិនក្រអូប", "ដើម្បីការពារមេរោគ និងជំងឺ", "គ្មានប្រយោជន៍អ្វីទេ", "ដើម្បីធ្វើឱ្យអាហារឆ្ងាញ់ជាង"],
        correct: 1
      },
      {
        q: "ការគេងគ្រប់ម៉ោង ជួយអ្វីខ្លះដល់រាងកាយ?",
        options: ["ធ្វើឱ្យខ្លាឃ្មុំគេងតែម្នាក់", "ជួយឱ្យរាងកាយ និងខួរក្បាលបានស្តារកម្លាំងឡើងវិញ", "គ្មានផលប៉ះពាល់ដល់សុខភាព", "ធ្វើឱ្យខ្ជិលរៀន"],
        correct: 1
      }
    ]
  }

};

let currentQuizKey = null;
let currentIndex = 0;
let correctCount = 0;
let quizModalInstance = null;

/* --------------------------------------------------------------------
   Open a quiz for a given category and show the first question
   -------------------------------------------------------------------- */
function openQuiz(categoryKey) {
  const quiz = QUIZ_DATA[categoryKey];
  if (!quiz) return;

  currentQuizKey = categoryKey;
  currentIndex = 0;
  correctCount = 0;

  renderQuizQuestion();

  const modalEl = document.getElementById('quizModal');
  quizModalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  quizModalInstance.show();
}

/* --------------------------------------------------------------------
   Render the current question (or the result screen once finished)
   -------------------------------------------------------------------- */
function renderQuizQuestion() {
  const quiz = QUIZ_DATA[currentQuizKey];
  const body = document.getElementById('quizBody');

  if (currentIndex >= quiz.questions.length) {
    renderQuizResult();
    return;
  }

  const q = quiz.questions[currentIndex];
  const total = quiz.questions.length;

  const dots = quiz.questions.map((_, i) => {
    let cls = 'quiz-dot';
    if (i < currentIndex) cls += ' filled';
    return `<span class="${cls}" data-dot="${i}"></span>`;
  }).join('');

  body.innerHTML = `
    <div class="quiz-head">
      <div class="quiz-head-icon" style="background:${quiz.iconBg}">${quiz.icon}</div>
      <div>
        <p class="quiz-head-title">${quiz.title}</p>
        <small class="text-muted-r">សំណួរទី ${currentIndex + 1} នៃ ${total}</small>
      </div>
    </div>
    <div class="quiz-progress-dots">${dots}</div>
    <p class="quiz-question">${q.q}</p>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button type="button" class="quiz-option-btn" data-index="${i}">${opt}</button>
      `).join('')}
    </div>
  `;

  body.querySelectorAll('.quiz-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index, 10)));
  });
}

/* --------------------------------------------------------------------
   Handle an answer selection: show correct/wrong states, then advance
   -------------------------------------------------------------------- */
function handleAnswer(selectedIndex) {
  const quiz = QUIZ_DATA[currentQuizKey];
  const q = quiz.questions[currentIndex];
  const buttons = document.querySelectorAll('.quiz-option-btn');
  const dots = document.querySelectorAll('.quiz-dot');
  const isCorrect = selectedIndex === q.correct;

  buttons.forEach((btn) => { btn.disabled = true; });
  buttons[q.correct].classList.add('is-correct');
  if (!isCorrect) {
    buttons[selectedIndex].classList.add('is-wrong');
  } else {
    correctCount++;
  }

  if (dots[currentIndex]) {
    dots[currentIndex].classList.add('filled', isCorrect ? 'correct' : 'wrong');
  }

  setTimeout(() => {
    currentIndex++;
    renderQuizQuestion();
  }, 900);
}

/* --------------------------------------------------------------------
   Final results screen: score, XP earned, and progress bar update
   -------------------------------------------------------------------- */
function renderQuizResult() {
  const quiz = QUIZ_DATA[currentQuizKey];
  const body = document.getElementById('quizBody');
  const total = quiz.questions.length;
  const earnedXp = correctCount * quiz.xpPerCorrect;
  const percent = Math.round((correctCount / total) * 100);

  let emoji = '🌱';
  let message = 'បន្តរៀនទៀត អ្នកនឹងពូកែជាងនេះ!';
  if (percent >= 80) { emoji = '🏆'; message = 'អស្ចារ្យណាស់! អ្នកឆ្លើយបានត្រឹមត្រូវស្ទើរតែទាំងអស់!'; }
  else if (percent >= 50) { emoji = '🎉'; message = 'ល្អណាស់! បន្តទៀត!'; }

  body.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-emoji">${emoji}</div>
      <p class="quiz-result-score">ត្រឹមត្រូវ ${correctCount} លើ ${total}</p>
      <p class="text-muted-r mb-0">${message}</p>
      <div class="quiz-result-xp"><i class="fa-solid fa-star"></i> +${earnedXp} XP</div>
      <div class="d-flex gap-2">
        <button type="button" class="btn-r btn-outline-r flex-fill" data-bs-dismiss="modal">បិទ</button>
        <button type="button" class="btn-r btn-primary-r flex-fill" onclick="openQuiz('${currentQuizKey}')">ព្យាយាមម្តងទៀត</button>
      </div>
    </div>
  `;

  updateChallengeProgress(currentQuizKey, percent);
}

/* --------------------------------------------------------------------
   Reflect the latest quiz result on the challenge card's progress bar
   -------------------------------------------------------------------- */
function updateChallengeProgress(categoryKey, percent) {
  const bar = document.getElementById(`progress-${categoryKey}`);
  if (bar) {
    bar.style.width = `${percent}%`;
  }
}