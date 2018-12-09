
## Run & Deploy

#### - 开发环境

推荐使用 nodemon，它能方便的检测文件变化，自动重启服务。

``` bash
$ yarn global add nodemon babel-cli
$ yarn run dev
```

当然，也可以直接通过 node 来启动。

```
$ yarn global add babel-cli
$ yarn start
```

> 这两者都直接使用了 [babel-node](https://babeljs.io/docs/usage/cli/#babel-node)，它可以只使用一个 .babelrc 的配置，而不用 babel-register。

#### - 生产环境

推荐使用 PM2，`process.yml` 是 PM2 的启动脚本。
