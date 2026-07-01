module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Transform import.meta for web compatibility
          unstable_transformImportMeta: true,
          // Target older JS to transpile modern features for JSC
          targets: { node: 'current' },
        },
      ],
    ],
    plugins: ['expo-router/babel'],
  };
};
