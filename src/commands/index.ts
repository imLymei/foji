import { Command } from 'commander';
import { PROGRAM_DESCRIPTION, PROGRAM_NAME, PROGRAM_VERSION } from '../config';

import addCommand from './addCommand';
import removeCommand from './removeCommand';
import openConfig from './openConfig';
import uploadConfig from './uploadConfig';
import downloadConfig from './downloadConfig';
import { getConfig, logList, runUserCommand } from '../lib/utils';
import syncConfig from './syncConfig';
import renameCommand from './renameCommand';

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
        .filter((text) => text.includes(addCommand.description()))[0];

      console.log();

      const sortedCommands = Object.keys(configCommands)
        .sort()
        .reduce((acc, key) => {
          acc[key] = configCommands[key];
          return acc;
        }, {} as { [key: string]: string });

      if (Object.keys(sortedCommands).length > 0) {
        logList(
          'Your Commands',
          sortedCommands,
          exampleHelpLine.indexOf(addCommand.description()) - 4
        );

        console.log();
      }

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

program.addCommand(addCommand);
program.addCommand(renameCommand);
program.addCommand(removeCommand);
program.addCommand(openConfig);
program.addCommand(uploadConfig);
program.addCommand(downloadConfig);
program.addCommand(syncConfig);

export default program;
