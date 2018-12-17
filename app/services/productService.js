export default class ProductService {
  constructor({ Product }) {
    this.product = Product
  }

  async createOut({ id, price }) {
    const ProductData = await this.product.create({
        type: 'expenditure',
        price,
        userid: id
      })
      return ProductData || false
  }

  async createIn({ id, price }) {
    const ProductData = await this.product.create({
        type: 'deposit',
        price,
        userid: id
      })
      return ProductData || false
  }

  async getUserRecord({ id }) {
    const data = await this.product.findAll({
      where: {
        userid: id
      },
      order: [
        ['createtime', 'desc']
      ],
      limit: parseInt(10)
    })
    return data || false
  }
}