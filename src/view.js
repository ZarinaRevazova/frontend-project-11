import onChange from 'on-change';
import { ERROR_CODES, ERROR_MESSAGES } from './errors.js';
// import watcherState from './state.js';
import { feedsBlock, postsBlock } from './viewUtils.js';

const renderErrors = (state, i18next) => {
  const feedback = document.querySelector('.feedback');
  if (state.stateProcess.errorCode === null) {
    feedback.textContent = '';
  }
  const errorMessage = ERROR_MESSAGES[state.stateProcess.errorCode];
  const messageKey = i18next.t(errorMessage);
  feedback.textContent = messageKey;

  if (state.stateProcess.errorCode !== null && state.stateProcess.process === 'error') {
    feedback.classList.add('text-danger');
  } else {
    feedback.classList.remove('text-danger');
  }
};
const render = (state, value, i18next) => {
  const urlInput = document.querySelector('#url-input');
  const button = document.querySelector('button[type="submit"]');
  const feedback = document.querySelector('.feedback');

  // обновляю в состоянии url
  if (state.url !== undefined) {
    urlInput.value = state.url;
  }

  // очищаю инпут и поле feedback
  urlInput.classList.remove('is-valid', 'is-invalid');
  // feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');

  // явно выделяю состояние и в зависимости от него меняется отображение (инпут(границы),
  // кнопка и фидбек с изменением цвета шрифта)

  if (value === 'success') {
    button.disabled = false;
    urlInput.value = '';
    urlInput.classList.add('is-valid');
    urlInput.focus();
    feedback.textContent = i18next.t(ERROR_MESSAGES[ERROR_CODES.SUCCESS]);
    feedback.classList.add('text-success');
  } else if (value === 'error') {
    button.disabled = false;
    urlInput.classList.add('is-invalid');
    // feedback.classList.add('text-danger');
    // в зависимости от значения ошибки (errorCode в состоянии), выводим соответствующее сообщение
    renderErrors(state, i18next);
  } else {
    button.disabled = true;
  }
};
const renderFeeds = (state) => {
  const feeds = document.querySelector('.feeds');
  feeds.innerHTML = '';
  feedsBlock(state, feeds);
};

const renderPosts = (state) => {
  const posts = document.querySelector('.posts');
  posts.innerHTML = '';
  postsBlock(state, posts);
};

const watcher = (state, i18next) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'stateProcess.process':
        render(state, value, i18next);
        break;
      case 'stateProcess.errorCode':
        renderErrors(state, i18next);
        break;
      case 'feeds':
        renderFeeds(state);
        break;
      case 'posts':
        renderPosts(state);
        break;
      default:
        break;
    }
  });
  return watchedState;
};

export default watcher;

/*
const renderSuccessProcess = (i18next) => {
  // const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');
  // const button = document.querySelector('button[type="submit"]');
  const feedback = document.querySelector('.feedback');

  // обновляю в состоянии url
  if (state.url !== undefined) {
    urlInput.value = state.url;
  }

  // очищаю инпут и поле feedback
  urlInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');

  // явно выделяю состояние и в зависимости от него меняется отображение (инпут(границы),
  // кнопка и фидбек с изменением цвета шрифта)
  urlInput.value = '';
  // urlInput.classList.add('is-valid');
  feedback.textContent = i18next.t('success_rss_loaded');
  // feedback.classList.add('text-success');
  urlInput.value = '';
  urlInput.focus();
};

const renderErrors = (state, i18next) => {
  const feedback = document.querySelector('.feedback');
  const urlInput = document.querySelector('#url-input');

  const ERROR_CODE_MAP = {
    INVALID_URL: 'error_invalid_url',
    DUPLICATE_URL: 'error_duplicate_url',
    INVALID_RSS: 'error_invalid_rss',
    NETWORK_ERROR: 'error_network',
  };
  feedback.textContent = '';

  if (state.stateProcess.errorCode !== null) {
    urlInput.classList.remove('is-valid');
    feedback.classList.remove('text-success');
    urlInput.classList.add('is-invalid');
    feedback.classList.add('text-danger');

    if (state.stateProcess.errorCode === 'error_invalid_url') {
      feedback.textContent = i18next.t('error_invalid_url');
    } else if (state.stateProcess.errorCode === 'error_network') {
      feedback.textContent = i18next.t('error_network');
    } else {
      const errorCase = state.stateProcess.errorCode;
      feedback.textContent = i18next.t(errorCase);
    }
  } else {
    urlInput.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
  }
};

const renderCases = (state, value, i18next) => {
  const input = document.querySelector('#url-input');
  const button = document.querySelector('button[type="submit"]');
  switch (value) {
    case 'success':
      input.disabled = false;
      button.disabled = false;
      renderSuccessProcess(i18next);
      break;
    case 'error':
      input.disabled = false;
      button.disabled = false;
      renderErrors(state, i18next);
      break;
    default:
      throw new Error('Unknown render case');
  }
};
*/
