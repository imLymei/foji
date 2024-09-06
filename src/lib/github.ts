import { spawnSync } from 'node:child_process';
import { CONFIG_FILE_PATH, getConfig } from './utils';

export function hasGithubCli(): boolean {
  const { status } = spawnSync('gh', { shell: true });

  return status === 0;
}

export function isGithubLogged(): boolean {
  const { status } = spawnSync('gh auth status', { shell: true });

  return status === 0;
}

export function login(): boolean {
  const { status } = spawnSync('gh auth login', {
    shell: true,
    stdio: 'inherit',
  });

  return status === 0;
}

export function uploadConfiguration(): string | undefined {
  const { stdout, status } = spawnSync(
    `gh gist create -d "foji configuration file" -f foji.json ${CONFIG_FILE_PATH}`,
    {
      shell: true,
    }
  );

  const gistUrl = stdout.toString().trim();

  if (status === 0) return gistUrl;
}

export function getConfiguration(gistUrl: string): string | undefined {
  const { stdout, status } = spawnSync(`gh gist view ${gistUrl} -r`, {
    shell: true,
  });

  const rawGist = stdout.toString().trim();

  const configStart = rawGist.indexOf('{');
  const gist = rawGist.slice(configStart);

  if (status === 0) return gist;
}

export function updateCloudConfiguration(): boolean {
  const config = getConfig();

  if (!config.gistUrl) {
    return false;
  }

  const { status } = spawnSync(
    `gh gist edit ${config.gistUrl} -f foji.json ${CONFIG_FILE_PATH}`,
    {
      shell: true,
    }
  );

  return status === 0;
}
