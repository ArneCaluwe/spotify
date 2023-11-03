/* eslint-disable @typescript-eslint/no-var-requires */
(() => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
  const developmentTargetPath = './src/environments/environment.development.ts';
  // Load node modules
  const colors = require('colors');
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/.env',
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
  authApi: 'https://accounts.spotify.com/',
  redirectUrl: 'http://localhost:4200/auth/callback',
  spotifyClientId: '${process.env['SPOTIFY_CLIENT_ID']}',
  spotifyClientSecret: '${process.env['SPOTIFY_CLIENT_SECRET']}',
  appVersion: '${appVersion}',
  production: true,
};
`;
  const developmentEnvConfigFile = `export const environment = {
  authApi: 'https://accounts.spotify.com/',
  redirectUrl: 'http://localhost:4200/auth/callback',
  spotifyClientId: '${process.env['SPOTIFY_CLIENT_ID']}',
  spotifyClientSecret: '${process.env['SPOTIFY_CLIENT_SECRET']}',
  appVersion: '${appVersion}',
  production: false,
};
`;
  console.info(
    colors.magenta(
      'The file `environment.ts` will be written with the following content: \n'
    )
  );
  writeFile(targetPath, envConfigFile, (err: unknown) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.info(
        colors.magenta(
          `Angular environment.ts file generated correctly at ${targetPath} \n`
        )
      );
    }
  });
  writeFile(developmentTargetPath, developmentEnvConfigFile, (err: unknown) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.info(
        colors.magenta(
          `Angular environment.ts file generated correctly at ${targetPath} \n`
        )
      );
    }
  });
})();
