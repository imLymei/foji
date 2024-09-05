import { spawnSync } from 'node:child_process';

export function hasGithubCli(): boolean {
  const { status } = spawnSync('gh', { shell: true });

  return status === 0;
}

export function isGithubLogged(): boolean {
  const { status } = spawnSync('gh auth status', { shell: true });

  return status === 0;
}

export function githubLogin(): boolean {
  const { status } = spawnSync('gh auth login', {
    shell: true,
    stdio: 'inherit',
  });

  return status === 0;
}

export function githubCreateGist(): boolean {
  return true;
}
