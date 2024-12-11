import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Org = sequelize.define('Org', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openai_api_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openai_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://api.openai.com/v1"
    },
    openai_model: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "gpt-4o"
    }
  }, {
    indexes: [
    ]
  });

  return Org;
}
