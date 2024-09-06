import { Command } from 'commander';
import {
  uploadConfiguration,
  login,
  updateCloudConfiguration,
  hasGithubCli,
  isGithubLogged,
  getConfiguration,
} from '../../lib/github';
import { confirm } from '@inquirer/prompts';
import { changeGistUrl, createConfig, getConfig } from '../../lib/utils';

const configSync = new Command('sync')
  .alias('s')
  .description("Sync your local foji configuration with it's github gist")
  .action(async () => {
    if (!hasGithubCli()) {
      console.error('You do not have github cli installed');
      process.exit(1);
    }

    if (!isGithubLogged()) {
      console.log('Your are not logged on github cli.\n');

      const answer = await confirm({ message: 'Log you in?', default: true });

      if (!answer) process.exit(0);

      console.log();

      if (!login()) {
        console.error('Something went wrong...');
        process.exit(1);
      }
    }

    const config = getConfig();
    let gistUrl = config.gistUrl;

    if (!gistUrl) {
      console.log('Creating new Gist...');

      gistUrl = uploadConfiguration();

      if (!gistUrl) {
        console.log('Something went wrong...');
        process.exit(1);
      }

      changeGistUrl(gistUrl);

      if (!updateCloudConfiguration()) {
        console.log('Something went wrong...');
        process.exit(1);
      }
    }

    const newGist = getConfiguration(gistUrl);

    if (!newGist) {
      console.log('Something went wrong fetching you cloud configuration...');
      process.exit(1);
    }

    try {
      createConfig(JSON.parse(newGist));
      console.log('configuration synced!');
    } catch {
      console.log('Something went wrong');
      process.exit(1);
    }
  });

export default configSync;
