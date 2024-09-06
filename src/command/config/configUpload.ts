import { Command } from 'commander';
import {
  uploadConfiguration,
  login,
  updateCloudConfiguration,
  hasGithubCli,
  isGithubLogged,
} from '../../lib/github';
import { confirm } from '@inquirer/prompts';
import { changeGistUrl, getConfig } from '../../lib/utils';

const configUpload = new Command('upload')
  .alias('u')
  .description('Upload your foji configuration to github gist')
  .action(async () => {
    if (!hasGithubCli()) {
      console.error('You do not have github cli installed');
      process.exit(1);
    }

    if (!isGithubLogged()) {
      console.error('Your are not logged on github cli.\n');

      const answer = await confirm({ message: 'Log you in?', default: true });

      if (!answer) process.exit(0);

      console.log();

      if (!login()) {
        console.error('Something went wrong...');
        process.exit(1);
      }
    }

    const config = getConfig();

    if (!config.gistUrl) {
      console.log('Creating new Gist...');

      const gistUrl = uploadConfiguration();

      if (!gistUrl) {
        console.error('Something went wrong...');
        process.exit(1);
      }

      changeGistUrl(gistUrl);
    }

    if (!updateCloudConfiguration()) {
      console.error('Something went wrong...');
      process.exit(1);
    }

    console.log('configuration uploaded!');
  });

export default configUpload;
