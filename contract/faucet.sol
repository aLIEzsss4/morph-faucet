// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Faucet {
    // Stores the last claim time for each user
    mapping(address => uint) public lastAccessTime;
    // Address of the contract owner
    address public owner;
    // Interval between claims in hours
    uint private claimIntervalHours;

    // Event to log claim activity
    event Claim(address indexed claimant, uint amount, uint claimTime);

    // Constructor sets the owner and the default claim interval in hours
    constructor(uint _claimIntervalHours) {
        owner = msg.sender;
        claimIntervalHours = _claimIntervalHours;
    }

    // Ensures that only the contract owner can call a function
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Restricts claiming more than once in the specified interval
    modifier canClaimAgain(address recipient) {
        require(lastAccessTime[recipient] + claimIntervalHours * 1 hours < block.timestamp, "Wait for next claim interval");
        _;
    }

    // Ensures the recipient's account balance is less than 0.1 ETH
    modifier hasLowBalance(address recipient) {
        require(address(recipient).balance < 0.1 ether, "Balance must be less than 0.1 ETH");
        _;
    }

    // Function to update the claim interval in hours
    function updateClaimInterval(uint newIntervalHours) external onlyOwner {
        claimIntervalHours = newIntervalHours;
    }

    // Function for the owner to send funds
    function sendFunds(address payable recipient, uint amount) external onlyOwner canClaimAgain(recipient) hasLowBalance(recipient) {
        require(address(this).balance >= amount, "Insufficient funds in faucet");
        lastAccessTime[recipient] = block.timestamp;
        recipient.transfer(amount);

        // Emit an event for logging
        emit Claim(recipient, amount, block.timestamp);
    }

    // Allows the contract owner to withdraw all funds
    function withdrawAll() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Function to deposit funds into the contract
    function deposit() external payable {}

    receive() external payable { }

    // Function to view the contract's balance
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Function to view the current claim interval in hours
    function getClaimInterval() public view returns (uint) {
        return claimIntervalHours;
    }
}
