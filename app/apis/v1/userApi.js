import { makeClassInvoker } from 'awilix-koa'
import {sign} from 'jsonwebtoken' 
import secrets from '../../../config/secret.json'

class UserApi {
  constructor({ userService }) {
    this.user = userService
  }

  async createUser(ctx) {
    const { account, password } = ctx.request.body
    if (await this.user.createAccount({ account, password })) {
      ctx.success({
        account,
        password
      })
    } else {
      ctx.badRequest({ error: '帳號已註冊' })
    }
  }

  async login(ctx) {
    const { account, password } = ctx.request.body
    const user = await this.user.getUserIfExist({ account, password })
    if (user) {
      var token = sign({Account: user.account,id: user.id},secrets.secretKey,{ 
        expiresIn:86400 // 24小時後到期
      });
      ctx.success({name: user.name,token: token});
    } else {
      ctx.badRequest({ error: '登入失敗' })
    }
  }
}

export default function(router) {
  const api = makeClassInvoker(UserApi)

  router.post('/v1/user/register', api('createUser'))
  router.post('/v1/user/login', api('login'))
}
