import assert from 'assert';
import path from 'path';

process.env.JEST = true;

import { Core } from 'kratecms';

describe('Core', function() {
  describe('#get(\'coreDir\')', function() {
    const coreDir = path.join(__dirname, '..', 'src', 'KrateCMS');
    it('should equal ' + coreDir, function() {
      assert.equal(Core.get('coreDir'), coreDir);
    });
  });
});
