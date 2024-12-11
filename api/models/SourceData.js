import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SourceData = sequelize.define('SourceData', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    SourceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Sources',
        key: 'id'
      }
    },
    // just raw from the source
    raw_content: {
      type: DataTypes.TEXT,
    },
    // filtered based on the project prompt
    filtered_content: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    meta: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  });

  SourceData.associate = (models) => {
    SourceData.belongsTo(models.Source, {
      foreignKey: 'sourceId',
      as: 'source'
    });
  };

  return SourceData;
};
