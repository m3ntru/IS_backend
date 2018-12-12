import Sequelize, { Model } from 'sequelize'

export default class CompanyList extends Model {
	static init({ db }) {
		super.init({
			no: { type: Sequelize.CHAR, primaryKey: true },
			shortName: { type: Sequelize.CHAR, field: 'short_name' },
			fullName: { type: Sequelize.CHAR, field: 'full_name' },
		}, {
			modelName: 'ComanyList',
			sequelize: db,
			timestamps: false,
			// paranoid: true,
			freezeTableName: true,
			tableName: 'tw_company_list'
		})

		return this
	}
}