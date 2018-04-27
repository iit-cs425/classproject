/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('address', {
    ContactName: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    CompanyName: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    District: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    Province_State: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    Nation: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    PostalCode: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    City: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'address'
  });
};
