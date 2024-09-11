// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensSold;
    uint256 public closingTimestamp;
    uint256 public minContribution;
    uint256 public maxContribution;

    mapping (address => bool) private whitelistedUsers;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);

    constructor(Token _token, uint256 _price, uint256 _maxTokens, uint256 _minContribution, uint256 _maxContribution) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
        minContribution = _minContribution;
        maxContribution = _maxContribution;

        // is open for 7 days
        closingTimestamp = block.timestamp + 7*24*60*60;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Caller is not the owner ");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelistedUsers[msg.sender], "Caller must be whitelisted");
        _;
    }

    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    function addToWhitelist(address _user) public onlyOwner {
        whitelistedUsers[_user] = true;
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function buyTokens(uint256 _amount) public payable onlyWhitelisted {
        require(_amount >= minContribution, 'Amount must be bigger than min contribution');
        require(_amount <= maxContribution, 'Amount must be smaller than max contribution');
        require(msg.value == (_amount / 1e18) * price);
        require(token.balanceOf(address(this)) >= _amount);
        require(block.timestamp < closingTimestamp);
        require(token.transfer(msg.sender, _amount));

        tokensSold += _amount;

        emit Buy(_amount, msg.sender);
    }

    function finalize() public onlyOwner {
        
        require(token.transfer(owner, token.balanceOf(address(this))));

        // Send Ether to crowdsale creator
        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value}("");
        require(sent);

        emit Finalize(tokensSold, value);
    }
}