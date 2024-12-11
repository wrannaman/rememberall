import fs from 'fs';
import path from 'path';
import User from './User.js';
import relations from './relations.js';
import Org from './Org.js';
import Team from './Team.js';
import Project from './Project.js';
import TeamXUser from './team_x_user.js';
import Source from './Source.js';
import SourceData from './SourceData.js';
import Platform from './Platform.js';
import Drop from './Drop.js';
import Step from './Step.js';
import Memory from './Memory.js';

export default async s => new Promise((resolve, reject) => {
  const models = [
    User(s),
    Org(s),
    Team(s),
    Project(s),
    TeamXUser(s),
    Source(s),
    SourceData(s),
    Platform(s),
    Drop(s),
    Step(s),
    Memory(s)
  ];
  relations(s);
  resolve();
});
