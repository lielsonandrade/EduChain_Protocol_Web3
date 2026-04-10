const { ethers } = require("hardhat");

async function main() {
  const [deployer, student] = await ethers.getSigners();

  console.log("--- Iniciando Integração Web3 ---");
  console.log("Conta do Aluno:", student.address);

  // 1. Deploy dos Contratos (Simulando ambiente de produção)
  const EduToken = await ethers.getContractFactory("EduToken");
  const token = await EduToken.deploy(1000000);
  const tokenAddress = await token.getAddress();

  const EduCertificate = await ethers.getContractFactory("EduCertificate");
  const nft = await EduCertificate.deploy();
  const nftAddress = await nft.getAddress();

  const EduStaking = await ethers.getContractFactory("EduStaking");
  const staking = await EduStaking.deploy(tokenAddress);
  const stakingAddress = await staking.getAddress();

  const EduDAO = await ethers.getContractFactory("EduDAO");
  const dao = await EduDAO.deploy(tokenAddress);
  const daoAddress = await dao.getAddress();

  console.log("Contratos implantados com sucesso!");

  // --- DEMONSTRAÇÃO DAS FUNCIONALIDADES ---

  // Ação 1: Mint de NFT (Certificado)
  console.log("\n1. Emitindo Certificado NFT...");
  const txNft = await nft.issueCertificate(
    student.address, 
    "ipfs://meu-certificado-hash", 
    "Web3 Avançado"
  );
  await txNft.wait();
  console.log("NFT emitido para o aluno!");

  // Ação 2: Stake de Tokens
  console.log("\n2. Realizando Stake de 500 EDU Tokens...");
  const amountToStake = ethers.parseUnits("500", 18);
  
  // Primeiro: Transferir tokens para o aluno e aprovar o contrato de staking
  await token.transfer(student.address, amountToStake);
  await token.connect(student).approve(stakingAddress, amountToStake);
  
  // Segundo: Executar o Stake
  const txStake = await staking.connect(student).stake(amountToStake);
  await txStake.wait();
  console.log("Stake realizado com sucesso!");

  // Ação 3: Votação na DAO
  console.log("\n3. Criando Proposta e Votando na DAO...");
  await dao.createProposal("Adicionar curso de DeFi");
  
  // O aluno vota (o peso do voto é o saldo de tokens dele)
  // Nota: Como ele deu stake de 500, ele precisa ter saldo na carteira para votar nesta DAO simples
  await token.transfer(student.address, ethers.parseUnits("100", 18)); // Dá mais 100 tokens para ele votar
  const txVote = await dao.connect(student).vote(0);
  await txVote.wait();
  console.log("Voto registrado na DAO!");

  console.log("\n--- Integração Web3 Concluída com Sucesso! ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
