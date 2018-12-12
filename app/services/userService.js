export default class UserService {
  constructor({ Users }) {
    this.user = Users
  }

  async createAccount({ account, password }) {
    if (await this.checkUserIsExist({ account, password })) {
      const userData = await this.user.create({
        account,
        password
      })
      return userData
    } else {
      return false
    }
  }

  async checkUserIsExist({ account, password }) {
    const counter = await this.user.count({
      where: {
        account,
        password
      }
    })
    return counter === 0
  }

  async getUserIfExist({ account, password }) {
    const user = await this.user.findOne({
      where: {
        account: account,
        password: password
      }
    })
    return user || false
  }
}