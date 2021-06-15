const ETHWrap = artifacts.require('ETHWrap');

const ONE_ETH = web3.utils.toBN(web3.utils.toWei('1'));
const { BN } = web3.utils;
const { _ } = web3.utils;

const adjustBalance = async (balanceBefore, surplus, gasUsed) => {
  const gasPrice = await web3.eth.getGasPrice();
  const gasInWei = gasPrice * gasUsed;
  const term1 = new BN(balanceBefore).sub(new BN(gasInWei));

  return term1.add(new BN(surplus)).toString();
};

contract('ETHWrap test', async (accounts) => {
  it('The exchange contract should be set correctly', async () => {
    const ethWrap = await ETHWrap.deployed();
    const mockedExchange = _.last(accounts);

    const exchangeAddress = await ethWrap.getExchangeAddress();
    assert.equal(exchangeAddress.toLowerCase(), mockedExchange.toLowerCase());
  });

  it('Wrapping should work correctly', async () => {
    const sender1 = accounts[0];
    const ethWrap = await ETHWrap.deployed();

    await ethWrap.wrap({ from: sender1, value: ONE_ETH });
    const balance = await ethWrap.getBalance(sender1);

    assert.equal(balance.toString(), ONE_ETH.toString());
  });

  it('Withdrawal should work correctly', async () => {
    const sender1 = accounts[0];
    const ethWrap = await ETHWrap.deployed();
    const HALF_ETHER = ONE_ETH.div(new BN(2));

    await ethWrap.withdraw(HALF_ETHER, { from: sender1 });
    const balance = await ethWrap.getBalance(sender1);

    assert.equal(balance.toString(), HALF_ETHER.toString());

    await ethWrap.withdraw(HALF_ETHER, { from: sender1 });
    const balance2 = await ethWrap.getBalance(sender1);

    assert.equal(balance2.toString(), '0');
  });

  it('Approval should work correctly', async () => {
    const sender2 = accounts[1];
    const ethWrap = await ETHWrap.deployed();
    const AMOUNT = ONE_ETH.mul(new BN(10));

    await ethWrap.approve(AMOUNT, { from: sender2 });
    const approval = await ethWrap.getApproval(sender2);

    assert.equal(approval.toString(), AMOUNT.toString());
  });

  it('Wrap and approve should work correctly', async () => {
    const sender3 = accounts[2];
    const ethWrap = await ETHWrap.deployed();
    const AMOUNT = ONE_ETH.mul(new BN(5));

    await ethWrap.wrapAndApprove(ONE_ETH, { from: sender3, value: AMOUNT });
    const balance = await ethWrap.getBalance(sender3);
    const approval = await ethWrap.getApproval(sender3);

    assert.equal(balance.toString(), AMOUNT.toString());
    assert.equal(approval.toString(), ONE_ETH.toString());
  });

  it('Transfer from should work correctly', async () => {
    const sender4 = accounts[3];
    const mockExchange = _.last(accounts);
    const ethWrap = await ETHWrap.deployed();
    const AMOUNT = ONE_ETH.mul(new BN(3));
    const TRANSFER_AMOUNT_1 = ONE_ETH;
    const TRANSFER_AMOUNT_2 = ONE_ETH.mul(new BN(2));

    await ethWrap.wrapAndApprove(AMOUNT, { from: sender4, value: AMOUNT });

    const balance1Before = await web3.eth.getBalance(mockExchange);
    const receipt1 = await ethWrap.transferFrom(sender4, TRANSFER_AMOUNT_1, { from: mockExchange });
    const balance1After = await web3.eth.getBalance(mockExchange);
    const adjustedBalance1 = await adjustBalance(
      balance1Before,
      TRANSFER_AMOUNT_1.toString(),
      receipt1.receipt.cumulativeGasUsed,
    );

    assert.equal(balance1After, adjustedBalance1);

    const userBalanceAfter1 = await ethWrap.getBalance(sender4);
    assert.equal(userBalanceAfter1.toString(), ONE_ETH.mul(new BN(2)).toString());

    const receipt2 = await ethWrap.transferFrom(sender4, TRANSFER_AMOUNT_2, { from: mockExchange });
    const adjustedBalance2 = await adjustBalance(
      balance1After,
      TRANSFER_AMOUNT_2.toString(),
      receipt2.receipt.cumulativeGasUsed,
    );
    const balance2After = await web3.eth.getBalance(mockExchange);

    assert.equal(balance2After, adjustedBalance2);

    const userBalanceAfter2 = await ethWrap.getBalance(sender4);
    assert.equal(userBalanceAfter2, '0');
  });
});
