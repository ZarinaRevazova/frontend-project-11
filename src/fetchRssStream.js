import axios from 'axios';
import uniqid from 'uniqid';
import parseRssString from './parser.js';

// создаем промис с таймаутом (для ограничения времени ожидания ответа) и блоком кэширования,
// Скачиваем RSS-поток с помощью запроса на прокси-сервера AllOrigins
// (тогда поток скачивается без CORS-ограничений) ===>
// Получаем JSON-объект, где xml-строка хранится в contents (в  data.contents) ===>
// Эта xml-строка и будет потом входным параметром нашей парсинг-функции
export const fetchRssFeed = async (rssUrl, state, errorCode, timeout = 5000) => {
  try {
    const response = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`, {
      timeout,
    });

    if (response.status !== 200) {
      state.stateProcess = {
        ...state.stateProcess,
        process: 'error',
        errorCode: errorCode.NETWORK_ERROR,
      };
      throw new Error(`Прокси вернул HTTP ${response.status}`);
    }

    const { contents } = response.data;

    if (!contents) {
      state.stateProcess = {
        ...state.stateProcess,
        process: 'error',
        errorCode: errorCode.INVALID_RSS,
      };
      throw new Error('Ошибка: пустой RSS-поток');
    }
    return contents;
  } catch (error) {
    state.stateProcess = {
      ...state.stateProcess,
      process: 'error',
      errorCode: error.message.includes('HTTP') ? errorCode.NETWORK_ERROR : errorCode.INVALID_RSS,
    };
    // console.error('fetchRssFeed ошибка:', error.message);
    throw error;
  }
};
export const updateFeeds = (state, errorCode) => {
  const existingFeedsPromises = state.feeds.map((feed) => fetchRssFeed(feed.link, state, errorCode)
    .then((xmlString) => {
      const { postContent } = parseRssString(xmlString, state, errorCode);
      const newPosts = postContent.map((post) => ({
        id: uniqid(),
        feedId: feed.id,
        ...post,
      }));
      const existingPostsURLs = new Set(state.posts.map((post) => post.link));
      const postsToAdd = newPosts.filter((post) => !existingPostsURLs.has(post.link));
      if (postsToAdd.length > 0) {
        state.posts = [...postsToAdd, ...state.posts];
        // watcherState.posts = [...state.posts];
      }
    })
    .catch((error) => {
      console.error('updateFeeds ошибка:', error);
    }));

  Promise.all(existingFeedsPromises).then(() => {
    setTimeout(() => {
      updateFeeds(state, errorCode);
    }, 5000);
  });
};

/*
  if (state.feeds.length === 0) return;// если нет фидов, то ничего не делаем

  const existingFeedsPromises = state.feeds.map(async (feed) => {
    try {
      const xmlString = await fetchRssFeed(feed.link, state, errorCode);
      const { postContent } = parseRssString(xmlString, state, errorCode);

      const newPosts = postContent.map((post) => ({
        id: uniqid(),
        feedId: feed.id,
        ...post,
      }));

      const existingPostsURLs = new Set(state.posts.map((post) => post.link));
      const postsToAdd = newPosts.filter((post) => !existingPostsURLs.has(post.link));

      if (postsToAdd.length > 0) {
        state.posts = [...postsToAdd, ...state.posts];
      }
    } catch (error) {
      console.error('updateFeeds ошибка:', error);
    }
  }); */

/* await Promise.all(existingFeedsPromises)
    .catch((ovError) => console.error('updateFeeds ошибка:', ovError))
    .finally(() => {
      state.isUpdatingFeeds = false;
    });

  setTimeout(() => {
    if (!state.isUpdatingFeeds) {
      updateFeeds(state, errorCode);
    }
  }, 5000); */
/* await Promise.all(existingFeedsPromises)
    .catch((ovError) => console.error('updateFeeds ошибка:', ovError))
    .finally(() => {
      state.isUpdatingFeeds = false;
    });

  setTimeout(() => updateFeeds(state, errorCode), 5000); */

/* await Promise.all(existingFeedsPromises).then(() => {
  }).finally(() => {
    setTimeout(() => updateFeeds(state, errorCode), 5000);
  }); */

/* if (data.status !== 200) {
      watcherState.stateProcess = {
        ...watcherState.stateProcess,
        process: 'error',
        errorCode: errorCode.NETWORK_ERROR, // например, 404 от источника
      };
      throw new Error(`Исходный сервер: HTTP ${data.status}`);
    } */
