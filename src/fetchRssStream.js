import axios from 'axios';

// import parseRssString from './parser';

// создаем промис с таймаутом (для ограничения времени ожидания ответа) и блоком кэширования,
// Скачиваем RSS-поток с помощью запроса на прокси-сервера AllOrigins
// (тогда поток скачивается без CORS-ограничений) ===>
// Получаем JSON-объект, где xml-строка хранится в contents (в  data.contents) ===>
// Эта xml-строка и будет потом входным параметром нашей парсинг-функции
const fetchRssFeed = async (rssUrl, watcherState, errorCode, timeout = 1000) => {
  try {
    const response = await axios.get('https://api.allorigins.win/get', {
      params: {
        url: rssUrl,
        cache: 0, // отключаю кэширование
      },
      timeout,
    });

    const { contents } = response.data;

    /* if (response.status !== 200) {
      throw new Error(`Прокси вернул HTTP ${response.status}`);
    } */

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
      errorCode: errorCode.NETWORK_ERROR,
    };
    console.error('fetchRssFeed ошибка:', error.message);
    throw error;
  }
};

export default fetchRssFeed;
