import { Command } from 'commander';
import { basicGithubVerifications, getConfiguration } from '../lib/github';
import { confirm } from '@inquirer/prompts';
import { createConfig } from '../lib/utils';

const downloadConfig = new Command('download')
  .alias('d')
  .argument('gistUrl', 'Url/id from the configuration gist')
  .description('Download a foji configuration from github gist')
  .action(async (gistUrl: string) => {
    await basicGithubVerifications();

    console.log('Downloading configuration...');

    const gist = getConfiguration(gistUrl);

    if (!gist) {
      console.error('Something went wrong...');
      process.exit(1);
    }

    const update = await confirm({
      message: `Do you want to make this your new configuration?\n\n${gist}\n`,
    });

    if (!update) process.exit(0);

    try {
      createConfig(JSON.parse(gist));
    } catch {
      console.error('Something went wrong...');
      process.exit(1);
    }
  });

export default downloadConfig;
