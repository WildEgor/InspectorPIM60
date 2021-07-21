

const serverURI =
  process.env.NODE_ENV === 'production' ? window.location.href : 'http://192.168.99.9';

export { serverURI };
