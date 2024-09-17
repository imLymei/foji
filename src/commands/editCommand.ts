import { Command } from 'commander';
import { Config, createConfig, getConfig } from '../lib/utils';
import { error } from 'console';

const editCommand = new Command('edit')
  .alias('e')
  .description('Edit a foji command')
  .argument('name', 'Command name')
  .argument('command', 'New command')
  .action((name: string, command: string) => {
    const newConfig: Config = getConfig();

    if (!newConfig.commands[name]) error(`Command "${name}" not found`);

    newConfig.commands[name] = command;

    createConfig(newConfig);
  });

export default editCommand;
