/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    Name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    CategoryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    MerchantID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'UserID'
      }
    }
  }, {
    tableName: 'category',
    timestamps: false
  });
};
