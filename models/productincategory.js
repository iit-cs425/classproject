/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productincategory', {
    ProductInCategoryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ProductID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'product',
        key: 'ProductID'
      }
    },
    CategoryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'category',
        key: 'CategoryID'
      }
    }
  }, {
    tableName: 'productincategory'
  });
};
