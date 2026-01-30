import onChange from 'on-change';
import uniqid from 'uniqid';
import i18next from 'i18next';
import render from './view.js';

// определяю начальное состояние
const state = {
  url: '',
  savedURLs: [], // нужно для проверки дубликатов
  // trackedFeeds: [], // новые: список { url, lastCheckTime, lastPostCount }
  // isUpdatingFeeds: false,
  stateProcess: {
    process: 'filling', // 'filling', 'success', 'error'
    errorCode: null, // ERROR_CODES
  },
  feeds: [], // { id, link, feedTitle, feedDescription }
  posts: [], // { id, feedId, title, link, description }
};

// функции-конструкторы для дальнейшего добавления данных в состояние фидов и постов
// используем id для соединения сущностей feeds и posts
export const createFeedsState = (url, feedTitle, feedDescription) => ({
  id: uniqid(),
  link: url,
  title: feedTitle,
  description: feedDescription,
  // posts: [],
});

export const createPostsState = (feedId, title, link, description) => ({
  id: uniqid(),
  feedId,
  title,
  link,
  description,
});
// создаю вотчер на объект state --> далее в input.js отработаю логику:
// "меняется состояние --> вотчер отслеживает --> автоматически меняется отображение"
const watcherState = onChange(state, () => {
  render(watcherState, i18next);
});

export default watcherState;
