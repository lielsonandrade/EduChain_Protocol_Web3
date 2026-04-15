const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy na rede Sepolia...\n");

  // 🔍 Mostrar quem está fazendo o deploy
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploy sendo feito por:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Saldo:", ethers.formatEther(balance), "ETH\n");

  // ⚠️ Verificação de saldo
  if (balance == 0n) {
    throw new Error("❌ Carteira sem ETH! Pegue ETH no faucet antes de continuar.");
  }

  // 📦 Deploy Token
  console.log("📦 Deploying EduToken...");
  const EduToken = await ethers.getContractFactory("EduToken");
  const token = await EduToken.deploy(1000000);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ EduToken:", tokenAddress, "\n");

  // 🖼️ Deploy NFT
  console.log("📦 Deploying EduCertificate...");
  const EduCertificate = await ethers.getContractFactory("EduCertificate");
  const nft = await EduCertificate.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("✅ EduCertificate:", nftAddress, "\n");

  // 🔒 Deploy Staking
  console.log("📦 Deploying EduStaking...");
  const EduStaking = await ethers.getContractFactory("EduStaking");
  const staking = await EduStaking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ EduStaking:", stakingAddress, "\n");

  // 🗳️ Deploy DAO
  console.log("📦 Deploying EduDAO...");
  const EduDAO = await ethers.getContractFactory("EduDAO");
  const dao = await EduDAO.deploy(tokenAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log("✅ EduDAO:", daoAddress, "\n");

  console.log("🎉 --- Deploy Concluído com sucesso! ---");
  console.log("📌 Endereços:");
  console.log("Token:", tokenAddress);
  console.log("NFT:", nftAddress);
  console.log("Staking:", stakingAddress);
  console.log("DAO:", daoAddress);
}

main().catch((error) => {
  console.error("❌ Erro no deploy:");
  console.error(error);
  process.exitCode = 1;
});