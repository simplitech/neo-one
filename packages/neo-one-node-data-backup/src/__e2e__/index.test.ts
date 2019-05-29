/// <reference types="@neo-one/types/e2e"/>

describe('@neo-one/node-data-backup', () => {
  test('time to require', async () => {
    const time = await one.measureRequire('@neo-one/node-data-backup');
    expect(time).toBeLessThan(300);
  });
});
