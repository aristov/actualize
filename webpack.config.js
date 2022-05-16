const { NODE_ENV } = process.env
const JS_EXT = NODE_ENV === 'production' ? '.min.js' : '.js'

module.exports = {
  mode : NODE_ENV || 'none',
  entry : './index.js',
  output : {
    filename : 'actualize' + JS_EXT,
    library : {
      name : 'actualize',
      type : 'umd',
    },
    globalObject : 'this',
  },
}
