import {command, file, handler, line, path, skip, task, variable} from 'fig';
import stat from 'fig/fs/stat.js';

task(
  'set "StreamLocalBindUnlink yes" in /etc/ssh/sshd_config (HUP)',
  async () => {
    await line({
      group: 'root',
      line: 'StreamLocalBindUnlink yes',
      notify: 'send HUP to sshd',
      owner: 'root',
      path: '/etc/ssh/sshd_config',
      regexp: /^(?:\s*#\s*)?StreamLocalBindUnlink\b/,
      sudo: true,
    });
  },
);

task('symlink files', async () => {
  const files = variable.paths('files');

  for (const src of files) {
    await file({
      force: true,
      path: path.home.join(src),
      src: path.aspect.join('files', src),
      state: 'link',
    });
  }
});

task('fetch lotabout/skim.git', async () => {
  await command(
    'git',
    [
      'clone',
      '--branch',
      'v0.10.2', // Not a branch, but a tag (still works).
      '--depth',
      '1',
      'https://github.com/lotabout/skim.git',
    ],
    {
      chdir: 'vendor',
      creates: 'vendor/skim',
      raw: true,
    },
  );
});

task('build skim', async () => {
  await command('cargo', ['install', '--path', '.'], {
    chdir: 'vendor/skim',
    creates: 'vendor/skim/target/release/sk',
  });
});

task('install skim', async () => {
  await command('cp', ['vendor/skim/target/release/sk', '/usr/local/bin/'], {
    creates: '/usr/local/bin/sk',
    sudo: true,
  });
});

handler('send HUP to sshd', async () => {
  await command('pkill', ['-HUP', '-F', '/var/run/sshd.pid'], {
    failedWhen: () => false,
    sudo: true,
  });
});
