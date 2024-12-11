import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Project = sequelize.define('Project', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        days: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
        time: '09:00',
        timeZone: 'America/New_York',
      },
    },
    prompt: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        content_filter: ``,
        intro: ``,
        outro: ``,
        newsletter: ``,
        persona: ``,
        podcast: ``,
      },
    },
  });

  return Project;
}
