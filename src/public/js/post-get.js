urlSearch = new URLSearchParams(location.search);
postId = urlSearch.get('id');

fetch(`/api/posts/${postId}`, {
  method: 'GET', // HTTP 메서드 지정
  headers: {
    'Content-Type': 'application/json', // JSON 형식으로 데이터를 주고받음
  },
  credentials: 'include', // 쿠키 포함 설정 (인증 정보 전송 위함)
})
  // 서버 응답을 처리하는 첫 번째 then
  .then((response) => {
    // 응답이 정상이 아닐 경우 에러 발생
    if (!response.ok) {
      throw new Error('게시물을 가져오는데 실패했습니다.');
    }
    // 응답 데이터를 JSON 형식으로 변환
    return response.json();
  })
  // JSON 데이터를 처리하는 두 번째 then
  .then((data) => {
    document.querySelector('#title').value = data.data.title || '';
    document.querySelector('#content').value = data.data.content || '';
    // document.querySelector('#comment').value = data.data.comment || '';
    //이미지 처리 로직
    document.getElementById('image').src = data.data.media || '';
    // author와 createdAt은 span 태그 내부 텍스트로 설정
    document.querySelector('#author').textContent = data.data.nickname || '';
    document.querySelector('#createdAt').textContent =
      data.data.createdAt || '';
  })
  // 에러 처리
  .catch((err) => {
    console.error('에러:', err); // 콘솔에 에러 출력
    alert('게시물을 가져오는 중 오류가 발생했습니다.'); // 사용자에게 에러 알림
  });
// 댓글 조회 API 호출 추가
// 클라이언트가 댓글 조회하는 api를 서버에 요청
fetch(`/api/posts/${postId}/comments`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    credentials: 'include',
  },
})
  // 서버가 준데이터를 response로 받고 response 데이터형태를 자바스크립트 형태로 변환하기위해서 response.json 을사용
  .then((response) => {
    if (!response.ok) {
      throw new Error('댓글을 가져오는데 실패했습니다.');
    }
    return response.json();
  })
  .then((data) => {
    commentData = data.lookUpComment;

    // html에 comments-list 라는 id를 가진 요소를 찾아서 변수에 저장
    const commentsContainer = document.querySelector('#comments-list');

    // 기존 댓글 내용을 비움
    // commentsContainer.innerHTML = '';

    // 받아온 댓글 데이터를 반복하여 화면에 표시
    commentData.forEach((comment) => {
      console.log(comment.Users.nickname);
      const commentElement = document.createElement('textarea'); // div 태그 생성
      commentElement.className = 'comment'; // div 태그에 class 속성 추가
      commentElement.setAttribute('row', '50');
      commentElement.innerHTML = `
      ${comment.content}
      작성자: ${comment.Users.nickname}
      작성일: ${comment.createdAt}
    `; // 댓글 내용을 표시하는 텍스트 추가
      commentsContainer.appendChild(commentElement);
    });
  });
