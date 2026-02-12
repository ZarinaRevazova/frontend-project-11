import onChange from 'on-change';
import { ERROR_CODES, ERROR_MESSAGES } from './errors.js';
import {
  feedsBlock, postsBlock, modalBlock, updateReadedLinks,
} from './viewUtils.js';

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

  if (state.url !== undefined) {
    urlInput.value = state.url;
  }

  urlInput.classList.remove('is-valid', 'is-invalid');
  feedback.classList.remove('text-danger', 'text-success');

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
  updateReadedLinks(state);
};

const renderModalWindow = (state) => {
  const currentId = state.uiState.modalId;

  if (currentId !== '' || state.uiState.visitedLinks.has(currentId)) {
    const readedLink = document.querySelector(`a[data-id="${currentId}"]`);
    readedLink.classList.remove('fw-bold');
    readedLink.classList.add('fw-normal', 'link-secondary');
  }
  modalBlock(state, currentId);
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
      case 'uiState.modalId':
        renderModalWindow(state);
        break;
      case 'uiState.visitedLinks':
        renderPosts(state);
        break;
      default:
        break;
    }
  });
  return watchedState;
};

export default watcher;
