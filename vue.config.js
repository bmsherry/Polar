const BASE_URL = process.env.NODE_ENV === 'production'
    ? './'  //绝对路径
    : './'

module.exports = {
    publicPath: BASE_URL
}