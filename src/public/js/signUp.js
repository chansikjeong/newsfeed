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
  modal.style.display = 'block';
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
      console.log(response);
      return response.json();
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      alert('중복된 값이 있습니다');
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
  });
  //추후에 로긴으로 이동?
  window.location.href = 'index.html';
});
