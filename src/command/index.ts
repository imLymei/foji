import { Command } from 'commander';
import { PROGRAM_DESCRIPTION, PROGRAM_NAME, PROGRAM_VERSION } from '../config';

import configAddCommand from './config/addCommand';
import configRemoveCommand from './config/removeCommand';
import runCommand from './run';
import openConfig from './config/openConfig';
import configUpload from './config/configUpload';

const program = new Command();

program
  .name(PROGRAM_NAME)
  .description(PROGRAM_DESCRIPTION)
  .version(PROGRAM_VERSION);

program.addCommand(configAddCommand);
program.addCommand(configRemoveCommand);
program.addCommand(openConfig);
program.addCommand(configUpload);

program.addCommand(runCommand);

export default program;
