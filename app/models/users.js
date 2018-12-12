import Sequelize, { Model } from 'sequelize'

export default class Users extends Model {
	static init({ db }) {
		super.init({
			id: {type: Sequelize.INTEGER ,primaryKey: true},
			account: { type: Sequelize.CHAR },
			password: { type: Sequelize.CHAR },
			name: { type: Sequelize.CHAR }
		}, {
			modelName: 'users',
			sequelize: db,
			// paranoid: true,
			timestamps: false,
			// updatedAt: false,
			// underscored: true,
			freezeTableName: true,
			tableName: 'users'
		})
		return this
	}
}
