import { Command } from 'commander';
import { getConfig, logList, runUserCommand } from '../lib/utils';

const runCommand = new Command('run')
  .alias('r')
  .alias('.')
  .argument(
    '[scope]',
    'Scope that you want to run a command or get information'
  )
  .argument('[command]', 'Command that you want to run')
  .argument('[args...]', 'Arguments for the command')
  .option('-d, --debug', 'Enable debugging features', false)
  .action(async (scope: string, command: string, args: string[]) => {
    const config = getConfig();

    if (!scope) {
      const scopes = Object.keys(config);

      if (scopes.length === 0) {
        console.error('No scope has been configured');
        process.exitCode = 1;
        return;
      }

      logList('scopes', scopes);
      return;
    }

    const scopeObject = config[scope];

    if (!scopeObject) {
      console.error(`scope "${scope}" not found`);
      process.exitCode = 1;
      return;
    }

    if (!command) {
      if (Object.keys(scopeObject).length === 0) {
        console.error('No command created at this scope');
        process.exitCode = 1;
        return;
      }

      logList('commands', scopeObject);
      return;
    }

    const realCommand = scopeObject[command];

    if (!realCommand) {
      console.error(`command "${command}" not found`);
      process.exitCode = 1;
      return;
    }

    runUserCommand(realCommand, args, runCommand.getOptionValue('debug'));
  });

export default runCommand;
