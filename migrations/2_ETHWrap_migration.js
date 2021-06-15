const ETHWrap = artifacts.require('ETHWrap');

const mockExchangeAddress = '0x388Ef493FaD03e3C73844Be82317017dEfdf6899';

module.exports = function (deployer) {
  deployer.deploy(ETHWrap, mockExchangeAddress);
};
