// ...existing code...
// const path = require('path');
// ...existing code...

module.exports = {
  // ...existing code...
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "zlib": require.resolve("browserify-zlib")
    }
  },
  // ...existing code...
};
