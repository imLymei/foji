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
  .addHelpText('after', '\n* You can use "." as the run command alias *')
  .addHelpText('after', '\n* You can use "_" to skip a argument *')
  .action(async (scope?: string, command?: string, args?: string[]) => {
    const config = getConfig();

    if (!scope) {
      const scopesAndCommands = Object.keys(config);

      if (scopesAndCommands.length === 0) {
        console.error(
          'No scope or commands found. You can create one with "foji add"'
        );
        process.exitCode = 1;
        return;
      }

      const scopes = scopesAndCommands.filter(
        (scope) => typeof config[scope] !== 'string'
      );
      const commands = scopesAndCommands
        .filter((command) => typeof config[command] === 'string')
        .reduce(
          (commands, command) => ({ ...commands, [command]: config[command] }),
          {}
        );

      logList('scopes', scopes);
      console.log();
      logList('commands', commands);
      return;
    }

    const scopeObject = config[scope];

    if (!scopeObject) {
      console.error(`scope "${scope}" not found`);
      process.exitCode = 1;
      return;
    }

    if (typeof scopeObject === 'string') {
      runUserCommand(
        scopeObject,
        [command, ...args],
        runCommand.getOptionValue('debug')
      );
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
