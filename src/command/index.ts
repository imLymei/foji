import { Command } from 'commander';
import { PROGRAM_DESCRIPTION, PROGRAM_NAME, PROGRAM_VERSION } from '../config';
import {
  CONFIG_FILE_PATH,
  createConfig,
  getConfig,
  logList,
  runCommand,
} from '../lib/utils';
import { createPromptModule } from 'inquirer';

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
  .action(async (scope, command) => {
    const config = getConfig();

    if (!config) {
      const prompt = createPromptModule();

      const answers = await prompt([
        {
          type: 'confirm',
          name: 'createConfig',
          message: 'You do not have a configuration file. Create one?',
          default: true,
        },
      ]);

      if (answers.createConfig) {
        createConfig();
      }
      console.log(
        answers.createConfig
          ? `Configuration file created at "${CONFIG_FILE_PATH}"`
          : `You can create your configuration file at "${CONFIG_FILE_PATH}"`
      );

      return;
    }

    if (!scope) {
      const scopes = Object.keys(config);

      if (scopes.length === 0) {
        console.log('No scope has been configured');
        return;
      }

      logList('scopes', scopes);
      return;
    }

    const scopeObject = config[scope];

    if (!scopeObject) {
      console.log(`scope "${scope}" not found`);
      return;
    }

    if (!command) {
      if (Object.keys(scopeObject).length === 0) {
        console.log('No command created at this scope');
        return;
      }

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
