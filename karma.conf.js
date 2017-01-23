module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    basePath: './',

    typescriptPreprocessor: {
      // options passed to the typescript compiler
      options: {
        sourceMap: false, // (optional) Generates corresponding .map file.
        target: 'ES6', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
        module: 'commonjs', // (optional) Specify module code generation: 'commonjs' or 'amd'
        noImplicitAny: false, // (optional) Warn on expressions and declarations with an implied 'any' type.
        removeComments: true // (optional) Do not emit comments to output.
      },
      // transforming the filenames
      transformPath: function (path) {
        return path.replace(/\.ts$/, '.js');
      }
    },
    files: [
      { pattern: "src/**/**/*.ts" }, // *.tsx for React Jsx
    ],
    preprocessors: {
      "**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
    },
    reporters: ["progress", "karma-typescript"],
    browsers: ["PhantomJS"]
  });
};