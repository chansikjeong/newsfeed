function openNicknameModal() {
  document.getElementById('nicknameModal').style.display = 'block';
}

function closeNicknameModal() {
  document.getElementById('nicknameModal').style.display = 'none';
  document.getElementById('newNickname').value = '';
}

function openPasswordModal() {
  document.getElementById('passwordModal').style.display = 'block';
}

function closePasswordModal() {
  document.getElementById('passwordModal').style.display = 'none';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
}

function openMediaModal() {
  document.getElementById('mediaModal').style.display = 'block';
}

function closeMediaModal() {
  document.getElementById('mediaModal').style.display = 'none';
  document.getElementById('media').value = '';
}

// 닉네임 변경
function saveNickname() {
  const newNickname = document.getElementById('newNickname').value;

  fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({ nickname: newNickname }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('닉네임 변경에 실패했습니다.');
      }
      document.getElementById('nickname').textContent = newNickname;
      closeNicknameModal();
      alert('닉네임이 변경되었습니다.');
    })
    .catch((err) => alert(err.message));
}

// 비밀번호 변경
function savePassword() {
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({ password: newPassword }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('비밀번호 변경에 실패했습니다.');
      }
      closePasswordModal();
      alert('비밀번호가 변경되었습니다.');
    })
    .catch((err) => alert(err.message));
}
// 프로필 사진 변경
function saveMedia() {
  const formData = new FormData();
  formData.append('media', media.files[0]);

  fetch('/api/profile', {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('프로필 변경에 실패했습니다.');
      }
      closeMediaModal();
      alert('프로필 사진이 변경되었습니다.');
      location.reload(); //새로고침
    })
    .catch((err) => alert(err.message));
}

function getUserPosts() {
  fetch('/api/posts', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 쿠키를 포함하여 요청을 보냄
  })
    .then((response) => response.json())
    .then((posts) => {
      const postsContainer = document.getElementById('userPosts');

      // 게시글이 없는 경우
      if (posts.data.length === 0) {
        postsContainer.innerHTML = '<p>작성한 게시글이 없습니다.</p>';
        return;
      }
      // 게시글 HTML 만들기
      let postList = '';
      posts.data.forEach((post) => {
        postList += `
          <article class="post-card">
            <h5>${post.title}</h5>
            <p>${post.content}</p>
            <div class="post-info">
              <small>작성일: ${new Date(post.createdAt).toLocaleDateString()}</small>
              <small>❤️ ${post._count.Like}</small>
            </div>
          </article>
        `;
      });

      postsContainer.innerHTML = postList;
    })
    .catch((err) => alert('게시글을 불러오는데 실패했습니다.'));
}

// 사용자 정보 조회
function getUserProfile() {
  fetch('/api/profile', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((res) => {
      document.getElementById('nickname').textContent = res.data.nickname;
      document.getElementById('email').textContent = res.data.email;
      document.getElementById('image').src = res.data.media || '';
    })
    .catch((err) => alert('프로필 정보를 불러오는데 실패했습니다.', err));
}

// 페이지 로드시 사용자 정보와 게시글 모두 조회
window.onload = function () {
  getUserProfile();
  getUserPosts();
};
