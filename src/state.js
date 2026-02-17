import uniqid from 'uniqid';

const state = {
  savedURLs: [],
  stateProcess: {
    process: '',
    errorCode: null,
  },
  feeds: [],
  posts: [],
  uiState: {
    visitedLinks: new Set(),
    modalId: '',
  },
};
export const createFeedsState = (url, feedTitle, feedDescription) => ({
  id: uniqid(),
  link: url,
  title: feedTitle,
  description: feedDescription,
});

export const createPostsState = (feedId, title, link, description) => ({
  id: uniqid(),
  feedId,
  title,
  link,
  description,
});

export default state;
