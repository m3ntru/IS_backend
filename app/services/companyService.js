export default class CompanyService {
	constructor({ CompanyList }) {
		this.company = CompanyList;
		this.field = ['no', 'shortName', 'fullName']
	}

	async getCompanyList() {
		const comapny = await this.company.findAll({
			attributes: this.field
		})
		
		if (comapny && comapny.length > 0) {
			return comapny.map(item => item.toJSON())
		}
	}

	async getCompanyById(no) {
		const company = await this.company.findAll({
			attributes: this.field,
			where: {
				no
			}
		})
		return company
	}
}