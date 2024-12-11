import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Unique constraint directly in the attribute definition
    },
    lastSync: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apikey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Unique constraint directly in the attribute definition
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    // Other model options go here
    indexes: [
      {
        unique: true,
        fields: ['apikey']
      },
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  return User;
}
