import assert from 'assert';
import path from 'path';

import { Core } from 'kratecms';
const coreDir = path.join(__dirname, '..', 'src', 'KrateCMS');

describe('Core', function() {
  describe('#get(\'coreDir\')', function() {
    it('should equal ' + coreDir, function() {
      Core.on('loaded', () => {
        assert.equal(Core.get('coreDir'), coreDir);
      });
    });
  });
});
