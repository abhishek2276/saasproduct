module.exports = {
    // ...
    resolve: {
      fallback: {
        "util": require.resolve("util/"),
        "buffer": require.resolve("buffer/"),
      },
    },
  };
  