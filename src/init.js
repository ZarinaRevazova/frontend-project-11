import * as yup from 'yup';
import i18next from 'i18next';
import render from './view.js';
import state, { createFeedsState, createPostsState } from './state.js';
import resources from './locales/index.js';
import { ERROR_CODES } from './errors.js';
import { fetchRssFeed, updateFeeds } from './fetchRssStream.js';
import parseRssString from './parser.js';
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
  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');
  // const button = document.querySelector('button[type="submit"]');
  // const feedback = document.querySelector('.feedback');

  // обработчик
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // проверяю валидность введенного url и обновляю состояние
    const currentURL = urlInput.value.trim();
    state.url = currentURL;

    try {
      const { valid, code } = await validateURL(currentURL);
      if (!valid) {
        state.stateProcess.process = 'error';
        state.stateProcess.errorCode = code; // если url не валиден
        await render(state, i18nextInstance);
        return;
      }
      if (state.savedURLs.includes(currentURL)) {
        state.stateProcess.process = 'error';
        state.stateProcess.errorCode = ERROR_CODES.DUPLICATE_URL; // если url дублируется
        await render(state, i18nextInstance);
        return;
      }
      // скачиваю поток
      const xmlString = await fetchRssFeed(currentURL, state, ERROR_CODES);
      // парсю полученные данные в объекте
      // eslint-disable-next-line max-len
      const { feedTitle, feedDescription, postContent } = parseRssString(xmlString, state, ERROR_CODES);

      if (!feedTitle || !postContent.length) { // Базовая проверка на валидность RSS
        throw new Error('Invalid RSS');
      }

      // проверяю наличие фидов в состоянии
      const existingFeed = state.feeds.find((feed) => feed.link === currentURL);

      // если фид есть --> обновляю данные, если нет --> создаю новый фид
      const currentFeed = existingFeed
        ? { ...existingFeed, title: feedTitle, description: feedDescription }
        : createFeedsState(currentURL, feedTitle, feedDescription);

      if (!existingFeed) {
        // добавляю данные фида в состояние
        state.feeds = [...state.feeds, currentFeed];
        // watcherState.posts = [createPostsState(currentFeed.id), ...watcherState.posts];
      }

      // addTrackedFeed(currentURL);

      // добавляю данные поста в состояние
      // eslint-disable-next-line max-len
      const newPosts = postContent.map((post) => createPostsState(currentFeed.id, post.title, post.link, post.description));
      state.posts = [...state.posts, ...newPosts];

      state.savedURLs.push(currentURL);
      state.stateProcess.process = 'success';
      state.stateProcess.errorCode = ERROR_CODES.SUCCESS;

      // await updateFeeds(state, ERROR_CODES);
    } catch (error) {
      if (error.message === 'Invalid RSS') {
        state.stateProcess.process = 'error';
        state.stateProcess.errorCode = ERROR_CODES.INVALID_RSS;
      } else {
        state.stateProcess.process = 'error';
        state.stateProcess.errorCode = ERROR_CODES.NETWORK_ERROR;
      }
    }
    // отображаю состояние
    // очищаю инпут, ставлю фокус
    if (state.feeds.length > 0) {
      await updateFeeds(state, ERROR_CODES);
    }
    await render(state, i18nextInstance);
    urlInput.value = '';
    urlInput.focus();
  });
};

export default app;
