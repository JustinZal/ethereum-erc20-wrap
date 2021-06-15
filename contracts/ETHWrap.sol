pragma solidity ^0.8.4;

contract ETHWrap {

    address private exchangeAddress;

    constructor (address _exchangeAddress) {
        require(_exchangeAddress != address(0));
        exchangeAddress = _exchangeAddress;
    }

    function getExchangeAddress() public view returns (address) {
        return exchangeAddress;
    }

}