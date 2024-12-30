const logInSubmit = document.querySelector('.logInSubmit');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
logInSubmit.addEventListener("click", function(e) {
  e.preventDefault();

  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    })
  })
  .then((response) => {
    console.log(response);
    return response.json()
  })
  .then((result) => console.log(result))
  .catch((err) => {
    console.log('에러: ', err);
  });
})