import { makeClassInvoker } from 'awilix-koa'
import { verify } from 'jsonwebtoken'
import secrets from '../../../config/secret.json'

class ProductApi {
  constructor({ productService }) {
    this.product = productService
  }

  async getUserRecord(ctx) {
    const { token } = ctx.request.body;
    var userid = 0;
    verify(token, secrets.secretKey, function (err, decoded) {
      if (err) {
        return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
      }
      else {
        userid = decoded.id;
      }
    });
    const data = await this.product.getUserRecord({ id: userid });
    return ctx.success(data)
  }
}

export default function (router) {
  const api = makeClassInvoker(ProductApi)

  router.post('/v1/product/order', api('getUserRecord'))
}
