/* ==========================================================================
   QUIZ.JS — Games & quiz interactivity (no backend)
   ========================================================================== */

const quizBank = {
  puberty: [
    { q: "Which gland is mainly responsible for triggering puberty?", options: ["Thyroid","Pituitary","Adrenal","Pancreas"], correct: 1 },
    { q: "Growth spurts during puberty are completely normal and vary by person.", options: ["True","False"], correct: 0 },
    { q: "Which of these is a common emotional change during puberty?", options: ["Mood swings","Permanent sadness","No changes at all","Loss of memory"], correct: 0 }
  ],
  nutrition: [
    { q: "Which food group provides the most long-lasting energy?", options: ["Sugary snacks","Whole grains","Soda","Candy"], correct: 1 },
    { q: "How many glasses of water should most teens drink daily?", options: ["1-2","3-4","6-8","15+"], correct: 2 }
  ],
  mental: [
    { q: "Talking to a trusted adult about stress is a sign of:", options: ["Weakness","Strength","Failure","Nothing"], correct: 1 },
    { q: "Deep breathing can help reduce anxiety in the moment.", options: ["True","False"], correct: 0 }
  ]
};

let currentQuiz = [];
let currentIndex = 0;
let score = 0;

function startQuiz(topic){
  currentQuiz = quizBank[topic] || quizBank.puberty;
  currentIndex = 0;
  score = 0;
  const modalEl = document.getElementById('quizModal');
  if(!modalEl) return;
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  renderQuestion();
  modal.show();
}
window.startQuiz = startQuiz;

function renderQuestion(){
  const box = document.getElementById('quizBody');
  if(!box) return;
  if(currentIndex >= currentQuiz.length){
    box.innerHTML = `
      <div class="text-center py-4 bounce-in">
        <div class="badge-medal mx-auto" style="background:var(--green);color:var(--green-dark);">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <h4 class="mt-3">Quiz complete!</h4>
        <p class="text-muted-r">You scored ${score} / ${currentQuiz.length}</p>
        <p class="fw-bold" style="color:var(--green-dark);">+${score * 10} XP earned</p>
        <button class="btn btn-primary-r btn-lg-touch w-100 mt-2 ripple" data-bs-dismiss="modal">Done</button>
      </div>`;
    return;
  }
  const item = currentQuiz[currentIndex];
  box.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <span class="badge-r badge-primary">Question ${currentIndex + 1}/${currentQuiz.length}</span>
      <span class="text-muted-r small">Score: ${score}</span>
    </div>
    <h5 class="mb-3">${item.q}</h5>
    <div class="d-grid gap-2" id="quizOptions">
      ${item.options.map((opt, i) => `<button class="btn btn-outline-r btn-lg-touch text-start ripple quiz-opt" data-idx="${i}">${opt}</button>`).join('')}
    </div>`;

  box.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const correct = idx === item.correct;
      box.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
      btn.style.background = correct ? 'var(--green)' : 'var(--red)';
      btn.style.borderColor = correct ? 'var(--green-dark)' : 'var(--red-dark)';
      if(correct) score++;
      setTimeout(() => {
        currentIndex++;
        renderQuestion();
      }, 900);
    });
  });
}

// Animate progress bars on load (Games page)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.progress-r .bar[data-target]').forEach(bar => {
    const target = bar.dataset.target;
    requestAnimationFrame(() => { bar.style.width = target + '%'; });
  });
});
