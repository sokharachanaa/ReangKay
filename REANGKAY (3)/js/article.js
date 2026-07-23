/* ============================================================
   REANGKAY · Article page (list + detail in one page)
   js/article.js
   ------------------------------------------------------------
   This one file drives article.html end to end:
   - renders the list of every article + category filter chips
   - renders a single article's full content on demand
   - switches between the two views without a page reload,
     while still keeping a real, shareable ?id= URL
   - if someone opens/refreshes article.html?id=X directly,
     it opens straight into that article's detail view
   Requires js/articles-data.js to be loaded first.
   ============================================================ */
console.log("Article JS loaded");
let activeCategory = 'ទាំងអស់';

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryChips();
  renderArticleGrid();
  wireBackButton();
  wireReadingProgress();

  // Support the browser's back/forward buttons switching between views
  window.addEventListener('popstate', () => syncViewWithUrl());

  // If the page was opened with ?id=, jump straight into that article
  syncViewWithUrl();
});

/* ============================================================
   VIEW SWITCHING
   ============================================================ */
function syncViewWithUrl(){
  const id = new URLSearchParams(window.location.search).get('id');
  if (id){
    openArticle(id, /* pushHistory */ false);
  } else {
    showListView();
  }
}

function showListView(){
  document.getElementById('detailView').style.display = 'none';
  document.getElementById('listView').style.display = 'block';
  document.title = 'REANGKAY | អត្ថបទ';
}

function showDetailView(){
  document.getElementById('listView').style.display = 'none';
  document.getElementById('detailView').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function wireBackButton(){
  document.getElementById('backToList').addEventListener('click', (e) => {
    e.preventDefault();
    
    history.pushState({}, '', 'article.html');
    showListView();

    document.getElementById("backToList")
.addEventListener("click", function(e){

    e.preventDefault();

    document.getElementById("detailView").style.display="none";

    document.getElementById("listView").style.display="block";

});
  });
}

/* ============================================================
   LIST VIEW — category chips + article grid
   ============================================================ */
function renderCategoryChips(){
  const categories = ['ទាំងអស់', ...new Set(healthArticles.map(a => a.category))];
  const wrap = document.getElementById('categoryChips');

  wrap.innerHTML = categories.map(cat => `
    <button
      class="badge-r cat-chip ${cat === activeCategory ? 'active' : ''}"
      onclick="filterByCategory('${cat.replace(/'/g, "\\'")}')"
    >${cat}</button>
  `).join('');

  document.getElementById('articleCount').textContent = `${toKhmerDigits(healthArticles.length)} អត្ថបទ`;
}

function filterByCategory(category){
  activeCategory = category;
  renderCategoryChips();
  renderArticleGrid();
}

function renderArticleGrid(){

  const grid = document.getElementById('articleGrid');
  const empty = document.getElementById('articleEmpty');


  const list = activeCategory === 'ទាំងអស់'
    ? healthArticles
    : healthArticles.filter(
        a => a.category === activeCategory
      );


  if(!list.length){

    grid.innerHTML='';
    empty.style.display='block';
    return;

  }


  empty.style.display='none';


  grid.innerHTML = list.map(a => `

    <a href="article.html?id=${a.id}"
       class="article-card js-article-link"
       data-id="${a.id}">


        <img 
          src="${a.image}"
          class="article-image"
          alt="${a.title}"
        >


        <div class="article-content">


            <span class="article-tag">
                ${a.category}
            </span>


            <h3 class="article-title">
                ${a.title}
            </h3>


            <p class="article-text">
                ${a.description}
            </p>


            <div class="article-meta">

                <i class="fa-regular fa-clock"></i>

                អាន ${toKhmerDigits(
                  estimateReadMinutes(a)
                )} នាទី

                ·

                ${formatKhmerDate(a.date)}

            </div>


        </div>


    </a>


  `).join('');


  wireArticleLinks(grid);

}

/* Intercept clicks on article cards so they switch views instantly
   instead of doing a full page reload — but the href is still a
   real URL, so opening in a new tab / direct refresh still works. */
function wireArticleLinks(scopeEl){
  scopeEl.querySelectorAll('.js-article-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openArticle(link.dataset.id, /* pushHistory */ true);
    });
  });
}
// function renderArticles(category = "all") {

//     const grid = document.getElementById("articleGrid");

//     if (!grid) return;


//     let articles = healthArticles;


//     if(category !== "all"){
//         articles = healthArticles.filter(
//             article => article.category === category
//         );
//     }


//     grid.innerHTML = articles.map(article => `

//         <div class="col-12 col-md-6">

//             <div class="card-r">

//                 <h3>${article.title}</h3>

//                 <p>${article.description}</p>

//                 <button 
//                 class="btn-r btn-primary-r read-btn"
//                 data-id="${article.id}">
//                 អានបន្ថែម
//                 </button>
//             </div>

//         </div>

//     `).join("");

// }

/* ============================================================
   DETAIL VIEW
   ============================================================ */
// function openArticle(id, pushHistory){
//   const article = getArticleById(id);
//   if (!article){
//     renderNotFound();
//     showDetailView();
//     return;
//   }

//   if (pushHistory){
//     history.pushState({ id: article.id }, '', `article.html?id=${article.id}`);
//   }

//   renderArticle(article);
//   renderRelatedArticles(article);
//   wireBookmarkButton();
//   showDetailView();
// }

function renderArticle(article){
  document.title = `${article.title} | REANGKAY`;

  document.getElementById('articleBanner').style.backgroundImage = `url('${article.image}')`;

  const badge = document.getElementById('articleBadge');
  badge.textContent = article.category;
  badge.className = categoryBadgeClass(article.category) + ' mb-2';

  document.getElementById('articleTitle').textContent = article.title;
  document.getElementById('articleAuthor').textContent = article.author;

  const minutes = estimateReadMinutes(article);
  document.getElementById('articleMeta').innerHTML =
    `<i class="fa-regular fa-clock"></i> អាន ${toKhmerDigits(minutes)} នាទី · ${formatKhmerDate(article.date)}`;

  document.getElementById('articleContent').innerHTML = article.content;

  // reset the bookmark icon to its default (unfilled) state for the new article
  const icon = document.querySelector('#bookmarkBtn i');
  icon.classList.add('fa-regular');
  icon.classList.remove('fa-solid');
}

function renderRelatedArticles(article){
  const related = getRelatedArticles(article.id, 3);
  const container = document.getElementById('relatedArticles');
  const section = document.getElementById('relatedSection');

  if (!related.length){
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';

  container.innerHTML = related.map(a => `
    <div class="col-md-4">
      <a href="article.html?id=${a.id}" class="card-r hoverable d-block p-2 reveal text-decoration-none js-article-link" data-id="${a.id}">
        <div style="height:110px;background:url('${a.image}') center/cover;border-radius:10px;"></div>
        <p class="fw-semibold small mt-2 mb-0">${a.title}</p>
      </a>
    </div>
  `).join('');

  wireArticleLinks(container);
}

/* ---------- Bookmark toggle (in-memory for this session) ---------- */
function wireBookmarkButton(){
  const btn = document.getElementById('bookmarkBtn');
  const icon = btn.querySelector('i');
  // replace the node to clear any listener from a previously opened article
  const freshBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(freshBtn, btn);

  let bookmarked = false;
  freshBtn.addEventListener('click', () => {
    bookmarked = !bookmarked;
    const freshIcon = freshBtn.querySelector('i');
    freshIcon.classList.toggle('fa-regular', !bookmarked);
    freshIcon.classList.toggle('fa-solid', bookmarked);
    if (typeof showToast === 'function'){
      showToast(bookmarked ? 'បានរក្សាទុកអត្ថបទ' : 'បានដកចេញពីការរក្សាទុក', 'fa-bookmark');
    }
  });
}

/* ---------- Reading progress bar ---------- */
function wireReadingProgress(){
  const bar = document.querySelector('.reading-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }, { passive: true });
}

/* ---------- Fallback view if the id in the URL is unknown ---------- */
function renderNotFound(){
  document.getElementById('relatedSection').style.display = 'none';
  document.getElementById('articleBanner').style.backgroundImage = 'none';
  document.getElementById('articleBadge').textContent = '';
  document.getElementById('articleAuthor').textContent = '';
  document.getElementById('articleMeta').textContent = '';
  document.getElementById('articleTitle').textContent = '';
  document.title = 'REANGKAY | រកមិនឃើញអត្ថបទ';

  document.getElementById('articleContent').innerHTML = `
    <div class="text-center py-5 reveal">
      <div style="width:78px;height:78px;margin:0 auto 16px;border-radius:50%;background:var(--male);
                  display:flex;align-items:center;justify-content:center;font-size:1.9rem;color:var(--primary-dark);">
        <i class="fa-solid fa-file-circle-question"></i>
      </div>
      <h3 class="mb-2">រកមិនឃើញអត្ថបទនេះទេ</h3>
      <p class="text-muted-r small mb-4">អត្ថបទដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានលុប ឬតំណភ្ជាប់មិនត្រឹមត្រូវ។</p>
      <a href="article.html" class="btn-primary-r px-4 py-2 d-inline-block text-decoration-none">
        <i class="fa-solid fa-arrow-left me-1"></i> ត្រឡប់ទៅអត្ថបទទាំងអស់
      </a>
    </div>
  `;
}

function openArticle(id){

    const article = healthArticles.find(
        item => item.id == id
    );

    if(!article){
        console.log("Article not found");
        return;
    }


    document.getElementById("listView").style.display="none";

    document.getElementById("detailView").style.display="block";


    document.getElementById("articleTitle").textContent =
        article.title;


    document.getElementById("articleAuthor").textContent =
        article.author;


    document.getElementById("articleContent").innerHTML =
        article.content;


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}



document.addEventListener("click", function(e){

    if(e.target.classList.contains("read-btn")){

        const id = e.target.dataset.id;

        openArticle(id);

    }

});


