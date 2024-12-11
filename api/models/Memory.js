// Project has many Drops. a Drop is the daily content created by the AI.
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Memory = sequelize.define('Memory', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    memory: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    indexed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }

  }, {});

  return Memory;
}
