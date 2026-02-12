import axios from 'axios';
import uniqid from 'uniqid';
import parseRssString from './parser.js';

export const fetchRssFeed = async (rssUrl, timeout = 5000) => {
  try {
    const response = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`, {
      timeout,
    });

    if (response.status !== 200) {
      throw new Error('NETWORK_ERROR');
    }

    const { contents } = response.data;

    if (!contents) {
      throw new Error('INVALID_RSS');
    }
    return contents;
  } catch (error) {
    if (error.isAxiosError) {
      throw new Error('NETWORK_ERROR');
    }
    throw error;
  }
};
export const updateFeeds = (state) => {
  const existingFeedsPromises = state.feeds.map((feed) => fetchRssFeed(feed.link)
    .then((xmlString) => {
      const { postContent } = parseRssString(xmlString);
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
    })
    .catch((error) => {
      console.warn('updateFeeds ошибка:', error.message);
      throw error;
    }));

  Promise.all(existingFeedsPromises).finally(() => {
    setTimeout(() => {
      updateFeeds(state);
    }, 5000);
  });
};
