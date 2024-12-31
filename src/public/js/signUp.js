const signUpSubmit = document.querySelector('.signUpSubmit');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');
const nickname = document.querySelector('#nickname');
const modal = document.getElementById('myModal');
const verifyEmail = document.querySelector('.verificationCodeSubmit');
const verficationEmail = document.querySelector('#verficationEmail');
const verificationCode = document.querySelector('#verificationCode');

signUpSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  fetch('/api/signUp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      nickname: nickname.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        alert('회원가입에 실패했습니다');
        throw new Error('회원가입에 실패했습니다');
      }
      return response.json();
    })
    .then((result) => {
      modal.style.display = 'block';
      console.log(result);
    })
    .catch((err) => {
      alert('중복된 아이디와 이름의 유저가 있습니다');
      console.log('에러', err);
    });
});

verifyEmail.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(verficationEmail.value);
  fetch('/api/email-verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: verficationEmail.value,
      verificationCode: verificationCode.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        alert('인증에 실패했습니다');
        throw new Error('인증에 실패했습니다');
      }
      return response.json();
    })
    .then((result) => {
      alert('인증에 성공했습니다');
      modal.style.display = 'block';
      console.log(result);
      //추후에 로긴으로 이동?
      window.location.href = 'login.html';
    })
    .catch((err) => {
      console.log('에러', err);
    });
});
