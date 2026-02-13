import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import i18next from 'i18next';
import state, { createFeedsState, createPostsState } from './state.js';
import resources from './locales/index.js';
import { ERROR_CODES } from './errors.js';
import { fetchRssFeed, updateFeeds } from './fetchRssStream.js';
import parseRssString from './parser.js';
import watcher from './view.js';

const schema = yup.object().shape({
  website: yup.string().url().required('url must be a valid url').trim()
    .lowercase(),
});

const validateURL = async (url) => {
  try {
    await schema.validate({ website: url });
    return { valid: true, code: ERROR_CODES.SUCCESS };
  } catch (error) {
    return { valid: false, code: ERROR_CODES.INVALID_URL };
  }
};

const app = async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const watcherState = watcher(state, i18nextInstance);

  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');
  const postsClick = document.querySelector('.posts');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const currentURL = urlInput.value.trim();
    watcherState.url = currentURL;

    try {
      const { valid, code } = await validateURL(currentURL);
      if (!valid) {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = code;
        throw new Error('INVALID_URL');
      }
      if (watcherState.savedURLs.includes(currentURL)) {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = ERROR_CODES.DUPLICATE_URL;
        throw new Error('DUPLICATE_URL');
      }
      const xmlString = await fetchRssFeed(currentURL);
      const { feedTitle, feedDescription, postContent } = parseRssString(xmlString);
      const existingFeed = watcherState.feeds.find((feed) => feed.link === currentURL);
      const currentFeed = existingFeed
        ? { ...existingFeed, title: feedTitle, description: feedDescription }
        : createFeedsState(currentURL, feedTitle, feedDescription);

      if (!existingFeed) {
        watcherState.feeds = [...watcherState.feeds, currentFeed];
        watcherState.posts = [createPostsState(currentFeed.id), ...watcherState.posts];
      }

      const newPosts = postContent.map((post) => createPostsState(
        currentFeed.id,
        post.title,
        post.link,
        post.description,
      ));
      watcherState.posts = [...watcherState.posts, ...newPosts];

      watcherState.savedURLs.push(currentURL);
      watcherState.stateProcess.process = 'success';
      watcherState.stateProcess.errorCode = ERROR_CODES.SUCCESS;
    } catch (error) {
      console.error('Ошибка в обработке RSS:', error.message);
      if (error.message === 'INVALID_RSS') {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = ERROR_CODES.INVALID_RSS;
      } else if (error.message === 'NETWORK_ERROR') {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = ERROR_CODES.NETWORK_ERROR;
      }
    }

    urlInput.value = '';
    urlInput.focus();
  });

  postsClick.addEventListener('click', (event) => {
    const targetElement = event.target;
    const postId = targetElement.dataset.id;

    watcherState.uiState.visitedLinks.add(postId);

    if (targetElement.tagName === 'BUTTON') {
      watcherState.uiState.modalId = postId;
    }
  });

  updateFeeds(watcherState);
};

export default app;
