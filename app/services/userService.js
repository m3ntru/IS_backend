export default class UserService {
  constructor({ Users }) {
    this.user = Users
  }

  async createAccount({ account, password, name }) {
    if (await this.checkUserIsExist({ account })) {
      const userData = await this.user.create({
        account,
        password,
        name,
        token: ''
      })
      return userData
    } else {
      return false
    }
  }

  async checkUserIsExist({ account }) {
    const counter = await this.user.count({
      where: {
        account
      }
    })
    return counter === 0
  }

  async getUserIfExist({ account }) {
    const user = await this.user.findOne({
      where: {
        account: account
      }
    })
    return user || false
  }

  async updateUserToken(id, token) {
    const counter = await this.user.update({
      token
    }, {
        where: {
          id
        }
      })
    return counter || 0
  }

  async updateUserProperty({ id, property }) {
    const counter = await this.user.update({
      property
    }, {
        where: {
          id
        }
      })
    return counter === 0
  }

  async getTokenById(id) {
    const user = await this.user.findOne({
      attributes: ['token', 'property'],
      where: {
        id: id
      }
    })
    return user || false
  }
}