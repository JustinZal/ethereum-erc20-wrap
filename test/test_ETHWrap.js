const ETHWrap = artifacts.require('ETHWrap');

contract('ETHWrap test', async (accounts) => {
  it('The exchange contract should be set correctly', async () => {
    const wrap = await ETHWrap.deployed();
    const exchangeAddress = await wrap.getExchangeAddress();

    assert.equal(exchangeAddress.toLowerCase(), accounts.pop().toLowerCase());
  });

  it('The ')
});
