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

    // 📦 Deploy EduToken
    console.log("📦 Deploying EduToken...");
    const EduToken = await ethers.getContractFactory("EduToken");
    const eduToken = await EduToken.deploy(ethers.parseUnits("1000000", 18)); // 1 milhão de tokens
    await eduToken.waitForDeployment();
    const tokenAddress = await eduToken.getAddress();
    console.log("✅ EduToken deployed to:", tokenAddress, "\n");

    // 🖼️ Deploy EduCertificate
    console.log("📦 Deploying EduCertificate...");
    const EduCertificate = await ethers.getContractFactory("EduCertificate");
    const eduCertificate = await EduCertificate.deploy();
    await eduCertificate.waitForDeployment();
    const nftAddress = await eduCertificate.getAddress();
    console.log("✅ EduCertificate deployed to:", nftAddress, "\n");

    // 📡 Deploy EduPriceConsumer (Oracle)
    console.log("📦 Deploying EduPriceConsumer...");
    const EduPriceConsumer = await ethers.getContractFactory("EduPriceConsumer");
    const eduPriceConsumer = await EduPriceConsumer.deploy();
    await eduPriceConsumer.waitForDeployment();
    const oracleAddress = await eduPriceConsumer.getAddress();
    console.log("✅ EduPriceConsumer deployed to:", oracleAddress, "\n");

    // 🔒 Deploy EduStaking
    console.log("📦 Deploying EduStaking...");
    const EduStaking = await ethers.getContractFactory("EduStaking");
    const eduStaking = await EduStaking.deploy(tokenAddress);
    await eduStaking.waitForDeployment();
    const stakingAddress = await eduStaking.getAddress();
    console.log("✅ EduStaking deployed to:", stakingAddress, "\n");

    // 🗳️ Deploy EduDAO
    console.log("📦 Deploying EduDAO...");
    const EduDAO = await ethers.getContractFactory("EduDAO");
    const eduDAO = await EduDAO.deploy(tokenAddress);
    await eduDAO.waitForDeployment();
    const daoAddress = await eduDAO.getAddress();
    console.log("✅ EduDAO deployed to:", daoAddress, "\n");

    // Configurar roles e permissões
    const CERTIFICATE_ISSUER_ROLE = await eduCertificate.CERTIFICATE_ISSUER_ROLE();
    await eduCertificate.grantRole(CERTIFICATE_ISSUER_ROLE, deployer.address); // Concede ao deployer
    console.log("Deployer granted CERTIFICATE_ISSUER_ROLE on EduCertificate.");

    console.log("🎉 --- Deploy Concluído com sucesso! ---");
    console.log("📌 Endereços:");
    console.log("Token:", tokenAddress);
    console.log("NFT:", nftAddress);
    console.log("Staking:", stakingAddress);
    console.log("DAO:", daoAddress);
    console.log("Oracle:", oracleAddress);
}

main().catch((error) => {
    console.error("❌ Erro no deploy:");
    console.error(error);
    process.exitCode = 1;
});
