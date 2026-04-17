// Endereços dos contratos na rede Sepolia (ATUALIZAR APÓS CADA DEPLOY)
export const CONTRACTS = {
    token: "0x2016ee7489541f6536e2C72230D02282C0DA2B84", // Exemplo, substituir pelo endereço real
    nft: "0x6a207B07a63737498DdDB32120bE72B2F857b285", // Exemplo, substituir pelo endereço real
    staking: "0x562Be5344D53E844B1fE3C8dbD7FB60fA9134e98", // Exemplo, substituir pelo endereço real
    dao: "0xD070c2ea278684045B7364133eEa2Df5fa0400Cc", // Exemplo, substituir pelo endereço real
    oracle: "0x...", // Adicionar endereço do EduPriceConsumer após deploy
};

// ABIs simplificados para interação via Ethers.js
export const TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)",
];

export const NFT_ABI = [
    "function issueCertificate(address student, string uri, string courseName) returns (uint256)",
    "function hasRole(bytes32 role, address account) view returns (bool)",
    "function grantRole(bytes32 role, address account)",
    "function CERTIFICATE_ISSUER_ROLE() view returns (bytes32)",
];

export const STAKING_ABI = [
    "function stake(uint256 _amount) external",
    "function withdraw() external",
    "function earned(address _account) view returns (uint256)",
];

export const DAO_ABI = [
    "function createProposal(string _description) external",
    "function vote(uint256 _proposalId) external",
    "function executeProposal(uint256 _proposalId) external",
    "function proposals(uint256) view returns (string description, uint256 voteCount, bool executed, uint256 deadline)",
    "function minTokenToCreateProposal() view returns (uint256)",
];

export const ORACLE_ABI = [
    "function getLatestPrice() public view returns (int)",
    "function getCoursePriceInTokens(uint256 priceInUsd) public view returns (uint256)",
];
