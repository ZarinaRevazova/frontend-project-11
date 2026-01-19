import axios from 'axios';

// import parseRssString from './parser';

// создаем промис с таймаутом (для ограничения времени ожидания ответа) и блоком кэширования,
// Скачиваем RSS-поток с помощью запроса на прокси-сервера AllOrigins
// (тогда поток скачивается без CORS-ограничений) ===>
// Получаем JSON-объект, где xml-строка хранится в contents (в  data.contents) ===>
// Эта xml-строка и будет потом входным параметром нашей парсинг-функции
const fetchRssFeed = async (rssUrl, watcherState, errorCode, timeout = 5000) => {
  try {
    const response = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`, {
      timeout,
    });

    if (response.status !== 200) {
      throw new Error(`Прокси вернул HTTP ${response.status}`);
    }

    const { contents } = response.data;

    /* if (data.status !== 200) {
      watcherState.stateProcess = {
        ...watcherState.stateProcess,
        process: 'error',
        errorCode: errorCode.NETWORK_ERROR, // например, 404 от источника
      };
      throw new Error(`Исходный сервер: HTTP ${data.status}`);
    } */

    if (!contents) {
      watcherState.stateProcess = {
        ...watcherState.stateProcess,
        process: 'error',
        errorCode: errorCode.INVALID_RSS,
      };
      throw new Error('Ошибка: пустой RSS-поток');
    }
    return contents;
  } catch (error) {
    watcherState.stateProcess = {
      ...watcherState.stateProcess,
      process: 'error',
      errorCode: error.message.includes('HTTP') ? errorCode.NETWORK_ERROR : errorCode.INVALID_RSS,
    };
    // console.error('fetchRssFeed ошибка:', error.message);
    throw error;
  }
};

export default fetchRssFeed;
