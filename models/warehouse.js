/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('warehouse', {
    WarehouseID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RegionName: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'address',
        key: 'AddressID'
      }
    },
    ManagerID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    // Can't put this here in the beginning 
      // references: {
      //   model: 'user',
      //   key: 'UserID'
      // }
    }
  }, {
    tableName: 'warehouse',
    timestamps: false
  });
};
