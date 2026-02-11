import * as yup from 'yup';
import i18next from 'i18next';
// import render from './view.js';
import state, { createFeedsState, createPostsState } from './state.js';
import resources from './locales/index.js';
import { ERROR_CODES } from './errors.js';
import { fetchRssFeed, updateFeeds } from './fetchRssStream.js';
import parseRssString from './parser.js';
import watcher from './view.js';
// import addTrackedFeed from './updates.js';

/* yup.setLocale({
    string: {
        url: 'url must be a valid url',
    },
}); */

// создаю шаблон-схему валидации
const schema = yup.object().shape({
  website: yup.string().url().required('url must be a valid url').trim()
    .lowercase(),
});

// функция проверки валидности введенного url
const validateURL = async (url) => {
  try {
    await schema.validate({ website: url });
    return { valid: true, code: ERROR_CODES.SUCCESS };
  } catch (error) {
    return { valid: false, code: ERROR_CODES.INVALID_URL };
  }
};

// основная логика с обработчиком
const app = async () => {
  // инициализирую библиотеку i18next
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const watcherState = watcher(state, i18nextInstance);

  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');
  // const button = document.querySelector('button[type="submit"]');
  // const feedback = document.querySelector('.feedback');
  const postsClick = document.querySelector('.posts');

  // обработчик
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // watcherState.stateProcess = { ...watcherState.stateProcess.process, process: 'processing' };

    // проверяю валидность введенного url и обновляю состояние
    const currentURL = urlInput.value.trim();
    // const initialState = { ...state };
    watcherState.url = currentURL;

    try {
      const { valid, code } = await validateURL(currentURL);
      if (!valid) {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = code; // если url не валиден
        throw new Error('INVALID_URL');
      }
      if (watcherState.savedURLs.includes(currentURL)) {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = ERROR_CODES.DUPLICATE_URL; // если url дублируется
        // await render(state, i18nextInstance);
        throw new Error('DUPLICATE_URL');
      }
      // скачиваю поток
      const xmlString = await fetchRssFeed(currentURL);
      // парсю полученные данные в объекте
      // eslint-disable-next-line max-len
      const { feedTitle, feedDescription, postContent } = parseRssString(xmlString);

      // проверяю наличие фидов в состоянии
      const existingFeed = watcherState.feeds.find((feed) => feed.link === currentURL);

      // если фид есть --> обновляю данные, если нет --> создаю новый фид
      const currentFeed = existingFeed
        ? { ...existingFeed, title: feedTitle, description: feedDescription }
        : createFeedsState(currentURL, feedTitle, feedDescription);

      if (!existingFeed) {
        // добавляю данные фида в состояние
        watcherState.feeds = [...watcherState.feeds, currentFeed];
        watcherState.posts = [createPostsState(currentFeed.id), ...watcherState.posts];
      }

      // addTrackedFeed(currentURL);

      // добавляю данные поста в состояние
      // eslint-disable-next-line max-len
      const newPosts = postContent.map((post) => createPostsState(currentFeed.id, post.title, post.link, post.description));
      watcherState.posts = [...watcherState.posts, ...newPosts];

      watcherState.savedURLs.push(currentURL);
      watcherState.stateProcess.process = 'success';
      watcherState.stateProcess.errorCode = ERROR_CODES.SUCCESS;

      // await updateFeeds(state, ERROR_CODES);
    } catch (error) {
      console.error('Ошибка в обработке RSS:', error.message);
      if (error.message === 'INVALID_RSS') {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = ERROR_CODES.INVALID_RSS;
      } else if (error.message === 'NETWORK_ERROR') {
        watcherState.stateProcess.process = 'error';
        watcherState.stateProcess.errorCode = ERROR_CODES.NETWORK_ERROR;
      }
      // all errors are handled above
    }
    // отображаю состояние
    // очищаю инпут, ставлю фокус

    // await render(state, i18nextInstance);
    urlInput.value = '';
    urlInput.focus();
  });

  postsClick.addEventListener('click', (event) => {
    event.preventDefault();
    const targetElement = event.target;
    const postId = targetElement.dataset.id;
    // const button = targetElement.closest('button');

    watcherState.uiState.visitedLinks.add(postId);

    if (targetElement.tagName === 'BUTTON') {
      watcherState.uiState.modalId = postId;
    }
  });

  /* const closedCross = document.querySelector('.btn-close');
  closedCross.addEventListener('click', async () => {
    watcherState.uiState.modalId = '';
  }); */

  updateFeeds(watcherState);
  // await render(state, i18nextInstance);
};

export default app;
