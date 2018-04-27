/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userhasaddress', {
    UserHasAddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'address',
        key: 'AddressID'
      }
    },
    UserID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'UserID'
      }
    }
  }, {
    tableName: 'userhasaddress'
  });
};
