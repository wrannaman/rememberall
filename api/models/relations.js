export default s => {
  const {
    User,
    Org,
    Project,
    Team,
    Source,
    Platform,
    Drop,
    Step,
    Memory
  } = s.models;

  User.belongsTo(Org);
  Org.hasMany(User);
  Project.belongsTo(Org);
  Org.hasMany(Project);
  Team.belongsTo(Org);
  Org.hasMany(Team);
  Source.belongsTo(Org);
  Project.hasMany(Source);
  Project.hasMany(Platform);
  Platform.belongsTo(Project);
  Project.hasMany(Drop);
  Drop.belongsTo(Project);
  Step.belongsTo(Drop);
  Drop.hasMany(Step);
  Step.belongsTo(Project)
  Memory.belongsTo(Org)
  Memory.belongsTo(User)
  // Optionally, if there are relationships not covered above, add them here.
  // For example:
  // User.hasMany(Weight);
  // User.hasMany(Steps);
  // etc.

  // If using a junction table or many-to-many relationships, specify them here
  // For example:
  // User.belongsToMany(ActivitySummary, { through: 'UserActivitySummary' });
};
