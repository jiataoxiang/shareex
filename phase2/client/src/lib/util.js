export const rand_string = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

export const toHttps = url => {
  if (url.substring(0, 5) === 'https') {
    return url;
  } else if (url.substring(0, 4) === 'http') {
    return url.replace('http', 'https'); // replace only replaces the first occurrence, it's safe
  }
  return url;
};
