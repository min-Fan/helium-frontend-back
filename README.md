# helium-frontend

## Project setup

```js
// 初始化依赖
npm install
```

### Compiles and hot-reloads for development

```json
/**
* 跑项目前修改相关配置
* vue.config.js
*/

devServer: 
	...
	// 此处为修改的配置 改为本地的外网ip地址 手机上链接局域网网络即可访问到
    host: '0.0.0.0',
	...
},
```

~~~js
// run
npm run serve
~~~



### Compiles and minifies for production

```js
// 测试网包 输出 dev 文件夹
npm run build:dev
// 主网包 输出 dist 文件夹
npm run build:prod
```



### Lints and fixes files

```
npm run lint
```
