import onChange from 'on-change';
import { ERROR_CODES, ERROR_MESSAGES } from './errors.js';
// import watcherState from './state.js';
import { feedsBlock, postsBlock } from './viewUtils.js';

const render = (state, i18next) => {
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

  if (state.stateProcess.process === 'success') {
    button.disabled = false;
    urlInput.value = '';
    urlInput.classList.add('is-valid');
    urlInput.focus();
    feedback.textContent = i18next.t(ERROR_MESSAGES[ERROR_CODES.SUCCESS]);
    feedback.classList.add('text-success');

    // feeds.innerHTML = '';
    // posts.innerHTML = '';

    feedsBlock(state, feeds);
    postsBlock(state, posts);

    /* state.posts.forEach((post) => {
      //
      //
      //
    }); */
  } else if (state.stateProcess.process === 'error') {
    button.disabled = false;
    urlInput.classList.add('is-invalid');
    // в зависимости от значения ошибки (errorCode в состоянии), выводим соответствующее сообщение
    const errorMessage = ERROR_MESSAGES[state.stateProcess.errorCode];
    const messageKey = i18next.t(errorMessage);
    feedback.textContent = messageKey;
    feedback.classList.add('text-danger');
  } else {
    button.disabled = false;
  }
};

const watcher = (state, i18next) => {
  const watchedState = onChange(state, () => {
    render(state, i18next);
  });
  return watchedState;
};

export default watcher;
