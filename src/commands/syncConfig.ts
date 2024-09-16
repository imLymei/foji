import { Command } from 'commander';
import {
  uploadConfiguration,
  updateCloudConfiguration,
  getConfiguration,
  basicGithubVerifications,
} from '../lib/github';
import { changeGistUrl, createConfig, getConfig } from '../lib/utils';

const syncConfig = new Command('sync')
  .alias('s')
  .description("Sync your local foji configuration with it's github gist")
  .action(async () => {
    await basicGithubVerifications();

    const config = getConfig();
    let gistUrl = config.gistUrl;

    if (!gistUrl) {
      console.log('Creating new Gist...');

      gistUrl = uploadConfiguration();

      if (!gistUrl) {
        console.error('Something went wrong...');
        process.exit(1);
      }

      changeGistUrl(gistUrl);

      if (!updateCloudConfiguration()) {
        console.error('Something went wrong...');
        process.exit(1);
      }
    }

    const newGist = getConfiguration(gistUrl);

    if (!newGist) {
      console.error('Something went wrong fetching you cloud configuration...');
      process.exit(1);
    }

    try {
      createConfig(JSON.parse(newGist));
      console.log('Configuration synced!');
    } catch {
      console.error('Something went wrong');
      process.exit(1);
    }
  });

export default syncConfig;
