// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EduStaking
 * @dev Contrato para staking de EduTokens com recompensas simples e cálculo mais preciso.
 */
contract EduStaking is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;
    
    // Taxa de recompensa por segundo (ex: 10 * 1e18 para 10 tokens por segundo por 1e18 de stake)
    uint256 public rewardRatePerSecond;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    struct Stake {
        uint256 amount;
        uint256 startTimestamp;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
        lastUpdateTime = block.timestamp;
    }

    function setRewardRate(uint256 _newRate) external onlyOwner {
        updateReward(address(0)); // Atualiza o pool antes de mudar a taxa
        rewardRatePerSecond = _newRate;
        emit RewardRateUpdated(_newRate);
    }

    function earned(address _account) public view returns (uint256) {
        uint256 currentRewardPerToken = rewardPerTokenStored;
        if (stakes[_account].amount > 0) {
            currentRewardPerToken = currentRewardPerToken + (rewardRatePerSecond * (block.timestamp - lastUpdateTime));
        }
        return (stakes[_account].amount * (currentRewardPerToken - userRewardPerTokenPaid[_account])) / 1e18 + rewards[_account];
    }

    function updateReward(address _account) internal {
        rewardPerTokenStored = rewardPerTokenStored + (rewardRatePerSecond * (block.timestamp - lastUpdateTime));
        lastUpdateTime = block.timestamp;

        if (_account != address(0)) {
            rewards[_account] = earned(_account);
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }
    }

    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Quantidade deve ser maior que zero");
        
        updateReward(msg.sender);

        stakingToken.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].startTimestamp = block.timestamp; // Atualiza o timestamp para o novo stake

        emit Staked(msg.sender, _amount);
    }

    function withdraw() external nonReentrant {
        uint256 amount = stakes[msg.sender].amount;
        require(amount > 0, "Nao ha tokens em stake");

        updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];

        stakes[msg.sender].amount = 0;
        stakes[msg.sender].startTimestamp = 0;
        rewards[msg.sender] = 0;
        userRewardPerTokenPaid[msg.sender] = rewardPerTokenStored;

        stakingToken.transfer(msg.sender, amount + reward);

        emit Withdrawn(msg.sender, amount);
        if (reward > 0) emit RewardPaid(msg.sender, reward);
    }
}
