/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    Username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },
    IsAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    IsEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    IsMerchant: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    EmailAddress: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    UserID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    WarehouseID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'warehouse',
        key: 'WarehouseID'
      }
    }
  }, {
    tableName: 'User',
    timestamps: false
  });
};
