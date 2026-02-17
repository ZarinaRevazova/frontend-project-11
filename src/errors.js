export const ERROR_CODES = {
  INVALID_URL: 1,
  DUPLICATE_URL: 2,
  INVALID_RSS: 3,
  NETWORK_ERROR: 4,
  EMPTY_URL: 5,
  SUCCESS: 0,
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_URL]: 'error_invalid_url',
  [ERROR_CODES.DUPLICATE_URL]: 'error_duplicate_url',
  [ERROR_CODES.INVALID_RSS]: 'error_invalid_rss',
  [ERROR_CODES.NETWORK_ERROR]: 'error_network',
  [ERROR_CODES.EMPTY_URL]: 'error_empty_url',
  [ERROR_CODES.SUCCESS]: 'success_rss_loaded',
};
