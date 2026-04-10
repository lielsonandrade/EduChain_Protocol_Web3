const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Protocolo Edu Web3 Completo", function () {
  let token, nft, staking, dao;
  let owner, student;

  beforeEach(async function () {
    [owner, student] = await ethers.getSigners();

    // Deploy Token
    const EduToken = await ethers.getContractFactory("EduToken");
    token = await EduToken.deploy(1000000);

    // Deploy NFT
    const EduCertificate = await ethers.getContractFactory("EduCertificate");
    nft = await EduCertificate.deploy();

    // Deploy Staking
    const EduStaking = await ethers.getContractFactory("EduStaking");
    staking = await EduStaking.deploy(await token.getAddress());

    // Deploy DAO
    const EduDAO = await ethers.getContractFactory("EduDAO");
    dao = await EduDAO.deploy(await token.getAddress());
  });

  it("Deve permitir Staking e Votação na DAO", async function () {
    const totalAmount = ethers.parseEther("100");

    // 1. Transferir tokens para o aluno
    await token.transfer(student.address, totalAmount);

    // 2. Fazer staking parcial (para manter saldo para votar)
    const stakeAmount = ethers.parseEther("50");

    await token.connect(student).approve(await staking.getAddress(), stakeAmount);
    await staking.connect(student).stake(stakeAmount);

    const stakeInfo = await staking.stakes(student.address);
    expect(stakeInfo.amount).to.equal(stakeAmount);

    // 3. Criar proposta (owner)
    await dao.connect(owner).createProposal("Novo curso de Solidity");

    // 4. Votar (student ainda tem tokens na carteira)
    await dao.connect(student).vote(0);

    const proposal = await dao.proposals(0);
    expect(proposal.voteCount).to.be.greaterThan(0);

    console.log("✅ Sucesso: Staking e DAO funcionando!");
  });
});