import { Core } from 'kratecms';

Core.on('loaded', async() => {
  await Core.serve(__dirname);
});
