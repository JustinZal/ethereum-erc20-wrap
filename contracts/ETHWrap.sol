pragma solidity ^0.8.5;

contract ETHWrap {
    address private exchangeAddress;
    mapping(address => uint256) private balances;
    mapping(address => uint256) private approvals;

    constructor (address _exchangeAddress) {
        require(_exchangeAddress != address(0));
        exchangeAddress = _exchangeAddress;
    }

    function getExchangeAddress() public view returns (address) {
        return exchangeAddress;
    }

    function getBalance(address user) public view returns (uint256 balance) {
        balance = balances[user];
    }

    function getApproval(address user) public view returns (uint256 approval) {
        approval = approvals[user];
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

    function withdraw(uint256 amount) public {
        require(amount <= balances[msg.sender], 'Balance overdraw!');
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    function transferFrom(address user, uint256 amount) public {
      require(msg.sender == exchangeAddress, 'Unauthorized transfer!');
      require(amount <= approvals[user], 'Not enough ethereum approved!');
      require(amount <= balances[user], 'User balance insufficient!');

      payable(exchangeAddress).transfer(amount);
      balances[user] -= amount;
    }
}