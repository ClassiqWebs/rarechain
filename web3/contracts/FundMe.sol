// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundMe {
    address public owner;
    uint256 public totalContributions;

    struct Category {
        uint256 minDeposit;
        uint256 maxDeposit;
    }

    mapping(string => Category) public categories;

    uint256 public constant USD_TO_WEI = 1000000000000000000; // 1 ether = $1,000.00

    event Contribute(address indexed contributor, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;

        // Define categories and their minimum/maximum deposit amounts
        categories["Master"] = Category(100000 ether, 180000 ether);
        categories["Full"] = Category(50000 ether, 99000 ether);
        categories["Validator"] = Category(10000 ether, 49000 ether);
        categories["Lightning"] = Category(1000 ether, 9999 ether);
    }

    function contribute(string memory category, uint256 usdAmount) public payable {
        require(categories[category].minDeposit > 0, "Invalid category");
        require(usdAmount >= categories[category].minDeposit, "Amount too low");
        require(usdAmount <= categories[category].maxDeposit, "Amount too high");

        uint256 weiAmount = usdAmount * USD_TO_WEI;
        totalContributions += weiAmount;
        
        emit Contribute(msg.sender, weiAmount);
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        payable(owner).transfer(amount);
        emit Withdrawal(owner, amount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function usdToWei(uint256 usdAmount) public pure returns (uint256) {
        return usdAmount * USD_TO_WEI;
    }

    function weiToUsd(uint256 weiAmount) public pure returns (uint256) {
        return weiAmount / USD_TO_WEI;
    }
}
