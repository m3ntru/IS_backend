import { makeClassInvoker } from 'awilix-koa'
import { sign, verify } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import secrets from '../../../config/secret.json'
var HmacSHA256 = require('crypto-js/hmac-sha256')
var CryptoJS = require('crypto-js')

class UserApi {
  constructor({ userService, productService }) {
    this.user = userService
    this.product = productService
  }

  async createUser(ctx) {
    const { account, password, name } = ctx.request.body
    const hashPassword = bcrypt.hashSync(password, 8);
    const user = await this.user.createAccount({ account, password: hashPassword, name });
    if (user) {
      const userCreate = await this.user.getUserIfExist({ account })
      var token = sign({ Account: account, id: userCreate.id }, secrets.secretKey, {
        expiresIn: 86400 // 24小時後到期
      });
      ctx.success({
        token
      })
    } else {
      ctx.badRequest({ error: '帳號已註冊' })
    }
  }

  async login(ctx) {
    const { account, password } = ctx.request.body
    const user = await this.user.getUserIfExist({ account })
    if (!user) {
      return ctx.badRequest({ error: '帳號不存在' })
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (passwordIsValid) {
      var token = sign({ Account: user.account, id: user.id }, secrets.secretKey, {
        expiresIn: 86400 // 24小時後到期
      });
      var list = await this.product.getUserRecord({ id: user.id })
      ctx.success({ name: user.name, token: token, property: user.property, list });
    } else {
      ctx.badRequest({ error: '登入失敗' })
    }
  }


  async verifyAccount(ctx) {
    const token = ctx.request.headers['x-access-token'];
    if (!token) return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
    var userid = null
    verify(token, secrets.secretKey, function (err, decoded) {
      if (err) {
        return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
      }
      else {
        userid = decoded.id
      }
    });
    if (userid === null || userid == 0) return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
    var timestamp = Date.parse(new Date())
    var tokenForVerify = sign({ id: userid, time: timestamp }, secrets.secretKey, {
      expiresIn: 18000 // 24小時後到期
    });
    var key = tokenForVerify.split(".");
    var result = await this.user.updateUserToken(userid, key[2]);
    if (result) {
      ctx.success({ token: key[2] });
    } else {
      ctx.badRequest({ error: result })
    }
  }

  async trade(ctx) {
    const { price, signature, timestamp, token, type } = ctx.request.body
    var userid = null
    verify(token, secrets.secretKey, function (err, decoded) {
      if (err) {
        return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
      }
      else {
        userid = decoded.id
      }
    });
    if (userid === null) {
      return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' + userid })
    }

    var key = await this.user.getTokenById(userid);

    const get_sign = (data) => {
      var pars = [];
      for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
      }
      var p = pars.sort().join("&");
      var meta = ['GET', 'localhost:8888', '/v1/user/trade', p].join('\n');
      var hash = HmacSHA256(meta, key.dataValues.token);
      var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
      return Signature
    }

    let data = {
      price, timestamp, token, type
    }

    if (signature !== get_sign(data)) {
      return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
    }
    var money = Number(key.dataValues.property);
    if (type == 'deposit') {
      await this.product.createIn({ id: userid, price })
      money += Number(price);
    }
    else {
      await this.product.createOut({ id: userid, price })
      money -= Number(price);
    }
    var finalMoney = await this.user.updateUserProperty({ id: userid, property: money })
    var list = await this.product.getUserRecord({ id: userid })
    return ctx.success({ list, property: money })

  }

}

export default function (router) {
  const api = makeClassInvoker(UserApi)

  router.post('/v1/user/trade', api('trade'))
  router.get('/v1/user/verifyAccount', api('verifyAccount'))
  router.post('/v1/user/register', api('createUser'))
  router.post('/v1/user/login', api('login'))
}
