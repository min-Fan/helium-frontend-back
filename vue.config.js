const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    // 基本路径
    publicPath: '/',
    // 输出文件目录
    outputDir: process.env.VUE_APP_outputDir,
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    runtimeCompiler: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // webpack配置
    chainWebpack: config => {
        // 配置快捷路径，styles为路径名字，resolve是原路径地址
        config.resolve.alias
            .set('@', resolve("src"))
            .set('@eth', resolve("src/ethereum/eth"))
            .set('@api', resolve("src/request/api"))
    },
    configureWebpack: {
        externals: {
            "axios": "axios",
            "qs": "qs",
        }
    },
    configureWebpack: (config) => {
        // 取消console打印
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    },
    devServer: {
        //将服务启动后默认打开浏览器
        open: true,
        host: '0.0.0.0',
        port: 8082,
        https: true,
        hot: true,
        proxy: {// 设置代理
            '/api': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        before: app => {}
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    },
    css: {
        loaderOptions: {
			sass: {
				data: `@import "@/common/theme-hock.scss";@import "@/common/theme-white.scss";@import "@/common/minxin.scss";`,
			},
		}
    }
}