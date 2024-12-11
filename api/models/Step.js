import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Step = sequelize.define('Step', {
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
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    step_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {});

  return Step;
}
