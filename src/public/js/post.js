const postSubmit = document.querySelector('.postSubmit');
const title = document.querySelector('#title');
const content = document.querySelector('#content');
const media = document.querySelector('#media');

postSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  //폼 데이터 생성
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('content', content.value);
  formData.append(
    'type',
    document.querySelector('input[type=radio][name=type]:checked').value,
  );

  //기존 데이터를 formData에 파일과 함께 묶음
  formData.append('media', media.files[0]);

  fetch('/api/posts', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      console.log(response);
      return response.json();
    })
    .then((result) => {
      alert('게시글 작성 완료');
      console.log('요청성공', result);
      window.location.href = 'index.html';
    })
    .catch((err) => {
      console.log('에러 발생', err);
    });
});
