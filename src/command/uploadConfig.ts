import { Command } from 'commander';
import {
  uploadConfiguration,
  updateCloudConfiguration,
  basicGithubVerifications,
} from '../lib/github';
import { changeGistUrl, getConfig } from '../lib/utils';

const uploadConfig = new Command('upload')
  .alias('u')
  .description('Upload your foji configuration to github gist')
  .action(async () => {
    await basicGithubVerifications();

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

export default uploadConfig;
