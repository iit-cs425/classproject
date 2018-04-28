/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('address', {
    ContactName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    CompanyName: {
      type: DataTypes.STRING(64),
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    District: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    Province_State: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    Nation: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    PostalCode: {
      type: DataTypes.STRING(16),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    City: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'address',
    timestamps: false
  });
};
