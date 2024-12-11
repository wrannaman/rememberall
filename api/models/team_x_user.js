// team_x_user join model postgres sql 
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TeamXUser = sequelize.define('TeamXUser', {
    TeamId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });
}