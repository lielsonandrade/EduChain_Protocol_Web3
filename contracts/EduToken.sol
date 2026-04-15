// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract EduToken is ERC20, Ownable, ERC20Burnable {
    
    event RewardMinted(address indexed to, uint256 amount);

    // 🔥 REMOVIDO Ownable(msg.sender)
    constructor(uint256 initialSupply) ERC20("EduToken", "EDU") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mintReward(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit RewardMinted(to, amount);
    }
}