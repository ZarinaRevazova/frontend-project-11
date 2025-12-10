import { ERROR_CODES, ERROR_MESSAGES } from './errors.js';

const render = async (state, i18next) => {
  const urlInput = document.querySelector('#url-input');
  const button = document.querySelector('button[type="submit"]');
  const feedback = document.querySelector('.feedback');

  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  // обновляю в состоянии url
  if (state.url !== undefined) {
    urlInput.value = state.url;
  }

  // очищаю инпут и поле feedback
  urlInput.classList.remove('is-valid', 'is-invalid');
  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');

  // явно выделяю состояние и в зависимости от него меняется отображение (инпут(границы),
  // кнопка и фидбек с изменением цвета шрифта)
  if (state.stateProcess.process === 'filling') {
    button.disabled = false;
  }
  if (state.stateProcess.process === 'success') {
    button.disabled = false;
    urlInput.value = '';
    urlInput.classList.add('is-valid');
    urlInput.focus();
    feedback.textContent = i18next.t(ERROR_MESSAGES[ERROR_CODES.SUCCESS]);
    feedback.classList.add('text-success');

    feeds.innerHTML = '';
    posts.innerHTML = '';

    state.feeds.forEach((feed) => {
      const divBorder = document.createElement('div');
      const divBody = document.createElement('div');
      const h2 = document.createElement('h2');
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');

      divBorder.classList.add('card', 'border-0');
      divBody.classList.add('card-body');
      h2.classList.add('card-title', 'h4');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      h3.classList.add('h6', 'm-0');
      p.classList.add('m-0', 'small', 'text-black-50');

      divBorder.appendChild(divBody);
      divBody.appendChild(h2);
      divBody.appendChild(ul);
      ul.appendChild(li);
      li.appendChild(h3);
      li.appendChild(p);

      h2.textContent = 'Фиды';
      h3.textContent = feed.title;
      p.textContent = feed.description;

      feeds.appendChild(divBorder);
    });

    state.posts.forEach((post) => {
      //
      //
      //
    });
  }
  if (state.stateProcess.process === 'error') {
    button.disabled = false;
    urlInput.classList.add('is-invalid');
    const messageKey = i18next.t(ERROR_MESSAGES[state.stateProcess.errorCode]);
    feedback.textContent = i18next.t(messageKey);
    feedback.classList.add('text-danger');
  }
};

export default render;
