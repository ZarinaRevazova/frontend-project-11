const parseRssString = (xmlString) => {
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(xmlString, 'application/xml');

  const parserError = parsedDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('INVALID_RSS');
  }

  const feedTitle = parsedDoc.querySelector('channel > title').textContent;
  const feedDescription = parsedDoc.querySelector('channel > description').textContent;

  if (!feedTitle || !feedDescription) {
    throw new Error('INVALID_RSS');
  }

  const posts = parsedDoc.querySelectorAll('item');
  const postContent = Array.from(posts).map((post) => {
    const title = post.querySelector('title')?.textContent;
    const link = post.querySelector('link')?.textContent;
    const description = post.querySelector('description')?.textContent;
    return { title, link, description };
  });
  return { feedTitle, feedDescription, postContent };
};

export default parseRssString;
