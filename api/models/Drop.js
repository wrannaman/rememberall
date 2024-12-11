// Project has many Drops. a Drop is the daily content created by the AI.
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Drop = sequelize.define('Drop', {
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
    }
  }, {});

  return Drop;
}
