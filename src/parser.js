// Скачиваем RSS-поток с помощью запроса на прокси-сервера AllOrigins
// (поток скачивается без CORS-ограничений) ===>
// Получаем JSON-объект, где xml-строка хранится в contents (в  data.contents) ===>
// Эта xml-строка и будет входным параметром нашей парсинг-функции ===>
// Разбираем xml-строку с помощью DOMParser и получаем объект ===>
// ========= >
// Возвращаем объекты с нужными нам данными для feed и posts:
// (feedTitle, feedDescription, postContent),
// чтобы потом отобразить фиды и посты в интерфейсе

const parseRssString = (xmlString, watcherState, ERROR_CODES) => {
  try {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(xmlString, 'application/xml');

    const parserError = parsedDoc.querySelector('parsererror');
    if (parserError) {
      watcherState.stateProcess = {
        ...watcherState.stateProcess,
        process: 'error',
        errorCode: ERROR_CODES.INVALID_RSS,
      };
      throw new Error(' Invalid RSS');
    }

    const feedTitle = parsedDoc.querySelector('channel > title').textContent;
    const feedDescription = parsedDoc.querySelector('channel > description').textContent;
    const posts = parsedDoc.querySelectorAll('item');

    const postContent = Array.from(posts).map((post) => {
      const title = post.querySelector('title')?.textContent;
      const link = post.querySelector('link')?.textContent;
      const description = post.querySelector('description')?.textContent;
      return { title, link, description }; // объект с данными для постов
    });
    return { feedTitle, feedDescription, postContent }; // объект с данными для фидов
  } catch (error) {
    watcherState.stateProcess = {
      ...watcherState.stateProcess,
      process: 'error',
      errorCode: ERROR_CODES.INVALID_RSS,
    };
    throw error;
  }
};

export default parseRssString;
