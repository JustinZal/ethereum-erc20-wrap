pragma solidity ^0.8.5;

contract ETHWrap {
    address private exchangeAddress;
    mapping(address => uint256) balances;
    mapping(address => uint256) approvals;

    constructor (address _exchangeAddress) {
        require(_exchangeAddress != address(0));
        exchangeAddress = _exchangeAddress;
    }

    function getExchangeAddress() public view returns (address) {
        return exchangeAddress;
    }

    function wrap() public payable {
        balances[msg.sender] += msg.value;
    }

    function approve(uint256 amount) public {
        approvals[msg.sender] = amount;
    }

    function wrapAndApprove(uint256 amount) public payable {
        wrap();
        approve(amount);
    }
}