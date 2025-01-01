const logInSubmit = document.querySelector('.logInSubmit');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
logInSubmit.addEventListener('click', function (e) {
  e.preventDefault();

  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('로그인에 실패하였습니다');
      return response.json();
    })
    .then((result) => {
      console.log(result);
      window.location.href = 'index.html';
    })

    .catch((err) => {
      console.log('에러: ', err);
    });
});

// 네이버 소셜 로그인
const naverLogin = new naver.LoginWithNaverId({
  clientId: '8IB5mriP4Rr7RIikvRdy',
  callbackUrl: 'http://127.0.0.1:3000/login.html',
  loginButton: { color: 'green', type: 2, height: 40 },
});

naverLogin.init();
naverLogin.getLoginStatus(function (status) {
  if (status) {
    const nickName = naverLogin.user.getNickName();

    if (nickName === null || nickName === undefined) {
      alert('별명이 필요합니다. 정보제공을 동의해주세요.');
      naverLogin.reprompt();
      return;
    } else {
      setLoginStatus();
    }
  }
});
console.log(naverLogin);

naverLogin.getLoginStatus(function (status) {
  if (status) {
    const nickName = naverLogin.user.getNickName();
    const email = naverLogin.user.getEmail();

    if (!nickName) {
      alert('별명이 필요합니다. 정보제공을 동의해주세요.');
      naverLogin.reprompt();
      return;
    } else {
      fetch('/api/socialLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          nickname: nickName,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('소셜 로그인에 실패하였습니다');
          return response.json();
        })
        .then((result) => {
          console.log(result);
          setLoginStatus(); // 로그인 성공 상태 설정
          alert('로그인에 성공하였습니다')
          window.location.href = 'index.html';
        })
        .catch((err) => {
          console.log('에러: ', err);
        });
    }
  }
});

function setLoginStatus() {
  // const message_area = document.getElementById('message');
  // message_area.innerHTML = `
  //    <h3> Login 성공 </h3>
  //    <div>user Nickname : ${naverLogin.user.nickname}</div>
  //    `;

  const button_area = document.getElementById('button_area');
  button_area.innerHTML = "<button id='btn_logout'>로그아웃</button>";

  const logout = document.getElementById('btn_logout');
  logout.addEventListener('click', (e) => {
    naverLogin.logout();
    location.replace('http://127.0.0.1:3000/login.html');
  });
}
