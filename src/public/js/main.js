// 현재 페이지와 타입을 관리하는 변수
let currentPage = 1;
let currentType = 'mobile';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  // 네비게이션 클릭 이벤트 설정
  setupNavigation();
  // 초기 모바일 게시글 로드
  loadPosts('mobile', 1);

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});

// 네비게이션 설정
function setupNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = e.target.dataset.type;
      currentType = type;
      currentPage = 1;
      loadPosts(type, currentPage);
      // 활성 링크 스타일 변경
      navLinks.forEach((link) => link.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
}
// 게시글 로드 함수
async function loadPosts(type, page) {
  try {
    const response = await fetch(`/api/posts/${type}?page=${page}`);
    const data = await response.json();
    if (data.data) {
      displayPosts(data.data);
      displayPagination(data.pageInfo);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

// 게시글 표시 함수
function displayPosts(posts) {
  const container = document.querySelector('#posts-container');

  if (posts.length === 0) {
    container.innerHTML = '<p>게시글이 없습니다.</p>';
    return;
  }
  container.innerHTML = posts
    .map(
      (post) => `
        <article class="post">
            <h2>${post.title}</h2>
            <div class="meta">
                <span>작성자: ${post.nickname}</span>
                <span>좋아요: ${post.likes}</span>
            </div>
        </article>
    `,
    )
    .join('');
}
// 페이지네이션 표시 함수
function displayPagination(pageInfo) {
  const pagination = document.querySelector('#pagination');
  const { currentPage, totalPages } = pageInfo;

  let paginationHTML = '';

  // 이전 페이지 버튼
  if (currentPage > 1) {
    paginationHTML += `<button onclick="changePage(${currentPage - 1})">이전</button>`;
  }

  // 페이지 번호
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
            <button 
                onclick="changePage(${i})" 
                class="${i === currentPage ? 'active' : ''}"
            >${i}</button>
        `;
  }
  // 다음 페이지 버튼
  if (currentPage < totalPages) {
    paginationHTML += `<button onclick="changePage(${currentPage + 1})">다음</button>`;
  }

  pagination.innerHTML = paginationHTML;
}

// 페이지 변경 함수
function changePage(page) {
  currentPage = page;
  loadPosts(currentType, page);
}
// 테마 토글 함수 추가
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  if (currentTheme === 'light') {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}
