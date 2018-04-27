/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('empassignedtowarehouse', {
    AssignmentID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    WarehouseID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'warehouse',
        key: 'WarehouseID'
      }
    },
    EmployeeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'UserID'
      }
    }
  }, {
    tableName: 'empassignedtowarehouse',
    timestamps: false
  });
};
