import { Command } from 'commander';
import { getConfig, logList, runUserCommand } from '../lib/utils';

const runCommand = new Command('run')
  .alias('r')
  .alias('.')
  .argument('[command]', 'Command that you want to run')
  .argument('[args...]', 'Arguments for the command')
  .option('-d, --debug', 'Enable debugging features', false)
  .addHelpText('after', '\n* You can use "." as the run command alias *')
  .addHelpText('after', '\n* You can use "_" to skip a argument *')
  .action(async (commandName?: string, args?: string[]) => {
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

    runUserCommand(command, args, runCommand.getOptionValue('debug'));
  });

export default runCommand;
