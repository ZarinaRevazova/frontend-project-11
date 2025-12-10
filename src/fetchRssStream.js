import axios from 'axios';
// import parseRssString from './parser';

// создаем промис с таймаутом (для ограничения времени ожидания ответа) и блоком кэширования,
// Скачиваем RSS-поток с помощью запроса на прокси-сервера AllOrigins
// (тогда поток скачивается без CORS-ограничений) ===>
// Получаем JSON-объект, где xml-строка хранится в contents (в  data.contents) ===>
// Эта xml-строка и будет потом входным параметром нашей парсинг-функции
const fetchRssFeed = async (rssUrl, timeout = 1000) => {
  try {
    const response = await axios.get('https://api.allorigins.win/get', {
      params: {
        url: rssUrl,
        cache: 0, // отключаю кэширование
      },
      timeout,
    });

    if (response.status !== 200) {
      throw new Error(`Прокси вернул HTTP ${response.status}`);
    }

    const { data } = response.data;

    if (data.status !== 200) {
      watcherState.stateProcess = {
        ...watcherState.stateProcess,
        process: 'error',
        errorCode: ERROR_CODES.NETWORK_ERROR, // например, 404 от источника
      };
      throw new Error(`Исходный сервер: HTTP ${data.status}`);
    }

    if (!data.contents) {
      watcherState.stateProcess = {
        ...watcherState.stateProcess,
        process: 'error',
        errorCode: ERROR_CODES.INVALID_RSS,
      };
      throw new Error(`Ошибка: ${data.status}`);
    }
    return data.contents;
  } catch (error) {
    watcherState.stateProcess = {
      ...watcherState.stateProcess,
      process: 'error',
      errorCode: ERROR_CODES.NETWORK_ERROR,
    };
    console.error('fetchRssFeed ошибка:', error.message);
    throw error;
  }
};

export default fetchRssFeed;
