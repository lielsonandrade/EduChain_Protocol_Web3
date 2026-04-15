// Endereços dos contratos na rede Sepolia
export const CONTRACTS = {
    token: "0x2016ee7489541f6536e2C72230D02282C0DA2B84",
    nft: "0x6a207B07a63737498DdDB32120bE72B2F857b285",
    staking: "0x562Be5344D53E844B1fE3C8dbD7FB60fA9134e98",
    dao: "0xD070c2ea278684045B7364133eEa2Df5fa0400Cc",
};

// ABIs simplificados para interação via Ethers.js
export const TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
];

export const NFT_ABI = [
    "function issueCertificate(address student, string uri, string courseName) returns (uint256)",
];

export const STAKING_ABI = [
    "function stake(uint256 _amount) external",
];

export const DAO_ABI = [
    "function vote(uint256 _proposalId) external",
    "function createProposal(string _description) external",
    "function proposals(uint256) view returns (string description, uint256 voteCount, bool executed, uint256 deadline)",
];
