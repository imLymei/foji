import { Command } from 'commander';
import {
  CONFIG_DIRECTORY,
  CONFIG_FILE_PATH,
  openDirectory,
} from '../../lib/utils';

const openConfig = new Command('config')
  .alias('c')
  .description('Open foji configuration path')
  .option('-p, --path', 'Output config path', false)
  .option('-f, --file', 'Output config file path', false)
  .action(() => {
    const path = openConfig.getOptionValue('file')
      ? CONFIG_FILE_PATH
      : CONFIG_DIRECTORY;

    if (openConfig.getOptionValue('path')) {
      console.log(path);
      return;
    }

    openDirectory(path);
  });

export default openConfig;
