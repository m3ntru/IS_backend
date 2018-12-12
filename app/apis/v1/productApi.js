import { makeClassInvoker } from 'awilix-koa' 
import {verify} from 'jsonwebtoken'
import secrets from '../../../config/secret.json'

class ProductApi {
  constructor({ productService }) {
    this.product = productService
  }

  async createBuyIn(ctx) {
    const { token, price, quantity } = ctx.request.body;
    var userid = 0;
    verify(token, secrets.secretKey, function(err, decoded) {
      if(err)
        return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
      else{
        userid = decoded.id;  
      }
    });
    if (await this.product.createBuyIn({ id: userid, price, quantity })) {
      return ctx.success();
    } else {
      return ctx.badRequest({ error: '買入失敗，請再試一次' })
    } 
  }

  async createSellOut(ctx) {
    const { token, price, quantity } = ctx.request.body;
    var userid = 0;
    verify(token, secrets.secretKey, function(err, decoded) {
      if(err)
        return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
      else{
        userid = decoded.id;  
      }
    });
    if (await this.product.createSellOut({ id: userid, price, quantity })) {
      return ctx.success();
    } else {
      return ctx.badRequest({ error: '賣出失敗，請再試一次' })
    } 
  }

  async getAllOrder (ctx) {
    const { token } = ctx.request.body;
    var userid = 0;
    verify(token, secrets.secretKey, function(err, decoded) {
      if(err){
        return ctx.badRequest({ error: '身分驗證失敗，請重新登入後重試' })
      }
      else{
        userid = decoded.id;      
      }
    });
    const data = await this.product.getUserOrder({ id: userid });
    return ctx.success(data)  
  }
}

export default function(router) {
  const api = makeClassInvoker(ProductApi)

  router.post('/v1/product/buy', api('createBuyIn'))
  router.post('/v1/product/sell', api('createSellOut'))
  router.post('/v1/product/order', api('getAllOrder'))
}
