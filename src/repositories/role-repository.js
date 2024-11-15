const CrudRepository = require('./crud-repository');
const { Role } = require('../models');
const { where } = require('sequelize');

class RoleRepository extends CrudRepository {
    constructor() {
        super(Role)
    }
    async getRoleByName(name) {
        const user = await Role.findOne({ where: { name: name } });
        return user;
    }
}

module.exports = RoleRepository;