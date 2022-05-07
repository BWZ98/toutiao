module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue: 37.5,
      rootValue ({ file }) {
        return file.indexOf('vant') === -1 ? 75 : 37.5
      },
      propList: ['*']
    }
  }
}
