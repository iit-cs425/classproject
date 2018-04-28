/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    Name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    Attribute1Name: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    Attribute1Value: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    Attribute2Name: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    Attribute2Value: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    QuantityNow: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    QuantityLow: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    QuantityRefill: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    Photograph: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    ProductID: {
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
    MerchantID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'UserID'
      }
    }
  }, {
    tableName: 'Product',
    timestamps: false
  });
};
