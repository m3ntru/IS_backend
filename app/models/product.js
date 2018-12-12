import Sequelize, { Model } from 'sequelize'

export default class Product extends Model {
	static init({ db }) {
		super.init({
			id: {type: Sequelize.INTEGER ,primaryKey: true},
			type: { type: Sequelize.BOOLEAN},
			price: { type: Sequelize.FLOAT },
			quantity: { type: Sequelize.FLOAT },
			userid: { type: Sequelize.INTEGER },
			createtime: {type: Sequelize.DATE}
		}, {
			modelName: 'product',
			sequelize: db,
			// paranoid: true,
			timestamps: false,
			// updatedAt: false,
			// underscored: true,
			freezeTableName: true,
			tableName: 'product'
		})
		return this
	}
}
