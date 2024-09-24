// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './src/**/*.html',
        './src/**/*.ts',
        './src/**/*.css',
        './src/**/*.scss'
      ],
      safelist: {
        standard: [],
        deep: [],
        greedy: []
      }
    })
  ]
}
