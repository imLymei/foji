import { Command } from 'commander';
import { PROGRAM_DESCRIPTION, PROGRAM_NAME, PROGRAM_VERSION } from '../config';
import { getConfig, logList, runCommand } from '../lib/utils';

const program = new Command();

program
  .name(PROGRAM_NAME)
  .description(PROGRAM_DESCRIPTION)
  .version(PROGRAM_VERSION)
  .argument(
    '[scope]',
    'Scope that you want to run a command or get information'
  )
  .argument('[command]', 'Command that you want to run')
  .action((scope, command) => {
    const config = getConfig();

    if (!scope) {
      logList('scopes', Object.keys(config));
      return;
    }

    const scopeObject = config[scope];

    if (!scopeObject) {
      console.log(`scope "${scope}" not found`);
      return;
    }

    if (!command) {
      logList('commands', scopeObject);
      return;
    }

    const realCommand = scopeObject[command];

    if (!realCommand) {
      console.log(`command "${command}" not found`);
      return;
    }

    runCommand(realCommand);
  });

export default program;
