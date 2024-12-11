import { DataTypes } from 'sequelize';


// platforms alre like twitter, ghost, etc
export default (sequelize) => {
  const Platform = sequelize.define('Platform', {
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
    type: {
      type: DataTypes.ENUM,
      values: ['ghost', 'twitter', 'linkedin', 'tiktok', 'youtube', 'substack', 'email', 'castos', 'reddit', 'threads'],
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    meta: {
      type: DataTypes.JSONB,
    }
  });

  return Platform;
}
