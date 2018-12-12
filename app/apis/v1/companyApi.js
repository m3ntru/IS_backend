import { makeClassInvoker } from 'awilix-koa'

class CompanyApi {
  constructor ({ companyService }) {
    this.companyService = companyService
  }

  async getCompany (ctx) {
    const company = await this.companyService.getCompanyList()
    
    return ctx.success(company)
  }
}

export default function (router) {
  // Same trick as the functional API, but using `makeClassInvoker`.
  const api = makeClassInvoker(CompanyApi)

  router.get('/v1/company', api('getCompany'))
}
