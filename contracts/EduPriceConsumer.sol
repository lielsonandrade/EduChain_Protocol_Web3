// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EduPriceConsumer
 * @dev Consome o preço real do ETH/USD usando Chainlink Oracles.
 */
contract EduPriceConsumer is Ownable {
    AggregatorV3Interface internal priceFeed;

    /**
     * Rede: Sepolia (Testnet)
     * Aggregator: ETH/USD
     * Endereço: 0x694AA1769357215DE4FAC081bf1f309aDC325306
     */
    constructor()  {
        // Endereço do oráculo ETH/USD na rede Sepolia
        priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }

    /**
     * @dev Retorna o preço mais recente do ETH em USD (com 8 casas decimais).
     */
    function getLatestPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * @dev Exemplo de lógica: calcula o custo de um curso em EduTokens 
     * baseado no preço do ETH para manter o valor estável em dólares.
     */
    function getCoursePriceInTokens(uint256 priceInUsd) public view returns (uint256) {
        int ethPrice = getLatestPrice();
        // Lógica simplificada para converter USD para a quantidade de tokens
        return (priceInUsd * 1e18) / uint256(ethPrice);
    }
}
