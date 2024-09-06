import { Command } from 'commander';
import { PROGRAM_DESCRIPTION, PROGRAM_NAME, PROGRAM_VERSION } from '../config';

import configAddCommand from './config/addCommand';
import configRemoveCommand from './config/removeCommand';
import openConfig from './config/openConfig';
import configUpload from './config/configUpload';
import configDownload from './config/configDownload';
import { getConfig, logList, runUserCommand } from '../lib/utils';
import configSync from './config/configSync';

const program = new Command()
  .argument('[command]', 'Command that you want to run')
  .argument('[args...]', 'Arguments for the command')
  .option('-d, --debug', 'Enable debugging features', false)
  .action(async (commandName?: string, args?: string[]) => {
    const configCommands = getConfig().commands;

    if (!commandName) {
      program.outputHelp();
      const help = program.helpInformation();

      const exampleHelpLine = help
        .split('\n')
        .filter((text) => text.includes(configAddCommand.description()))[0];

      console.log();

      const sortedCommands = Object.keys(configCommands)
        .sort()
        .reduce((acc, key) => {
          acc[key] = configCommands[key];
          return acc;
        }, {} as { [key: string]: string });

      logList(
        'Your Commands',
        sortedCommands,
        exampleHelpLine.indexOf(configAddCommand.description()) - 4
      );

      console.log();

      console.log('You can use "_" to skip a optional argument');
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
program.addCommand(configSync);

export default program;
