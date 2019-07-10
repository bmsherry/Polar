const BASE_URL = process.env.NODE_ENV === 'production'
    ? './'  //绝对路径
    : './'

module.exports = {
    publicPath: BASE_URL,
    chainWebpack: config => {
        Object.assign(config, {
            externals: {
                ThreeBSP: "ThreeBSP",
                THREE: "THREE"
            }
        })
    }
}