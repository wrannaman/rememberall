// source model postgres sql
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Source = sequelize.define('Source', {
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
    meta: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('newsletter', 'podcast', 'website', 'reddit', 'twitter', 'facebook', 'tiktok', 'youtube', 'blog', 'other'),
      allowNull: false,
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
}
