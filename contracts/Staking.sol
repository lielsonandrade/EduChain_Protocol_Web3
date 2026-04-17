// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EduStaking
 * @dev Contrato para staking de EduTokens com recompensas simples.
 */
contract EduStaking is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;
    
    // Taxa de recompensa
    uint256 public rewardRate = 10; 

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Quantidade deve ser maior que zero");
        
        _updateReward(msg.sender);

        stakingToken.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].timestamp = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    function withdraw() external nonReentrant {
        uint256 amount = stakes[msg.sender].amount;
        require(amount > 0, "Nao ha tokens em stake");

        _updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];

        stakes[msg.sender].amount = 0;
        rewards[msg.sender] = 0;

        stakingToken.transfer(msg.sender, amount + reward);

        emit Withdrawn(msg.sender, amount);
        if (reward > 0) emit RewardPaid(msg.sender, reward);
    }

    function _updateReward(address _user) internal {
        if (stakes[_user].amount > 0) {
            uint256 timeElapsed = block.timestamp - stakes[_user].timestamp;
            uint256 reward = (stakes[_user].amount * rewardRate * timeElapsed) / 1e18;
            rewards[_user] += reward;
        }
    }
}