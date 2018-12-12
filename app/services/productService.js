export default class ProductService {
  constructor({ Product }) {
    this.product = Product
  }

  async createBuyIn({ id, price, quantity }) {
    const ProductData = await this.product.create({
        type: false,
        price,
        quantity,
        userid: id
      })
      return ProductData || false
  }

  async createSellOut({ id, price, quantity }) {
    const ProductData = await this.product.create({
        type: true,
        price,
        quantity,
        userid: id
      })
      return ProductData || false
  }

  async getUserOrder({ id }) {
    const data = await this.product.findAll({
      where: {
        userid: id
      },
      order: [
        ['createtime', 'desc']
      ]
    })
    return data || false
  }
}