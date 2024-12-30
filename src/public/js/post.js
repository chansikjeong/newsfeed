const postSubmit = document.querySelector('.postSubmit');
const title = document.querySelector('#title');
const content = document.querySelector('#content');

postSubmit.addEventListener('click', function (e) {
  e.preventDefault();

  fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title.value,
      content: content.value,
      type: document.querySelector('input[type=radio][name=type]:checked')
        .value,
    }),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((result) => console.log(result))
    .catch((err) => {
      console.log('에러', err);
    });
});
