/* eslint-env jasmine, mocha */

import helperFixture from './lib/fixture';
import '@webcomponents/custom-elements';
import '@webcomponents/shadydom';
import '@webcomponents/shadycss';

// eslint-disable-next-line no-undef
mocha.setup({ timeout: 10000 });

afterEach(() => {
  // Ensure perf tests have enough time to cleanup after themselves.
  // eslint-disable-next-line no-undef
  mocha.timeout(120000);
  helperFixture('');
});
