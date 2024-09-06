import { Command } from 'commander';
import { PROGRAM_DESCRIPTION, PROGRAM_NAME, PROGRAM_VERSION } from '../config';

import configAddCommand from './config/addCommand';
import configRemoveCommand from './config/removeCommand';
import openConfig from './config/openConfig';
import configUpload from './config/configUpload';
import configDownload from './config/configDownload';
import { getConfig, logList, runUserCommand } from '../lib/utils';

const program = new Command()
  .argument('[command]', 'Command that you want to run')
  .argument('[args...]', 'Arguments for the command')
  .option('-d, --debug', 'Enable debugging features', false)
  .addHelpText('after', '\n* You can use "_" to skip a argument *')
  .action(async (commandName?: string, args?: string[]) => {
    if (!commandName) program.help();

    const configCommands = getConfig().commands;

    if (!commandName) {
      logList('Commands', configCommands);
      process.exit(0);
    }

    const command = configCommands[commandName];

    if (!command) {
      console.error(`command "${commandName}" not found`);
      process.exit(1);
    }

    runUserCommand(command, args, program.getOptionValue('debug'));
  });

program
  .name(PROGRAM_NAME)
  .description(PROGRAM_DESCRIPTION)
  .version(PROGRAM_VERSION);

program.addCommand(configAddCommand);
program.addCommand(configRemoveCommand);
program.addCommand(openConfig);
program.addCommand(configUpload);
program.addCommand(configDownload);

export default program;
