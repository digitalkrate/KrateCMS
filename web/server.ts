import { Core } from 'kratecms';
import { Pages } from 'kratecms/events';

(async() => {

  await Core.serve(__dirname);

  Pages.on('rendered', (obj) => {
    // console.log('pages loaded');
  });

  Pages.Public.on('render', async page => {
    // console.log(page);
  });

  Pages.Public.on('rendered', () => {
    // console.log('pages.public loaded');
  });

  Pages.Admin.on('rendered', () => {
    // console.log('pages.admin loaded');
  });

})();
