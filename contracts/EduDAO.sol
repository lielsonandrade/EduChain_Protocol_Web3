// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EduDAO
 * @dev Sistema de governança simplificado para o protocolo de educação.
 * Alunos usam seus EduTokens para votar em propostas.
 */
contract EduDAO is Ownable {
    IERC20 public votingToken;

    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
        uint256 deadline;
        mapping(address => bool) hasVoted;
    }

    Proposal[] public proposals;
    uint256 public votingDuration = 3 days;
    uint256 public minTokenToCreateProposal = 100 * 10**18; // Ex: 100 EDU

    event ProposalCreated(uint256 proposalId, string description, address creator);
    event Voted(uint256 proposalId, address voter, uint256 weight);
    event ProposalExecuted(uint256 proposalId);
    event MinTokenToCreateProposalUpdated(uint256 newAmount);

    constructor(address _votingToken) {
        votingToken = IERC20(_votingToken);
    }

    /**
     * @dev Permite que o owner defina a quantidade mínima de tokens para criar uma proposta.
     */
    function setMinTokenToCreateProposal(uint256 _amount) external onlyOwner {
        minTokenToCreateProposal = _amount;
        emit MinTokenToCreateProposalUpdated(_amount);
    }

    /**
     * @dev Cria uma nova proposta para a comunidade votar.
     * Requer um mínimo de tokens para evitar spam.
     */
    function createProposal(string memory _description) external {
        require(votingToken.balanceOf(msg.sender) >= minTokenToCreateProposal, "Nao possui tokens suficientes para criar proposta");

        uint256 proposalId = proposals.length;
        Proposal storage newProposal = proposals.push();
        newProposal.description = _description;
        newProposal.deadline = block.timestamp + votingDuration;
        
        emit ProposalCreated(proposalId, _description, msg.sender);
    }

    /**
     * @dev Vota em uma proposta. O peso do voto é o saldo de tokens do usuário.
     */
    function vote(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Votacao encerrada");
        require(!proposal.hasVoted[msg.sender], "Ja votou nesta proposta");

        uint256 weight = votingToken.balanceOf(msg.sender);
        require(weight > 0, "Nao possui tokens para votar");

        proposal.voteCount += weight;
        proposal.hasVoted[msg.sender] = true;

        emit Voted(_proposalId, msg.sender, weight);
    }

    /**
     * @dev Executa a proposta (simulação de aprovação).
     * Pode ser executada por qualquer um após o prazo, se a proposta for aprovada.
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "Votacao ainda em curso");
        require(!proposal.executed, "Proposta ja executada");
        require(proposal.voteCount > 0, "Proposta nao aprovada"); // Adiciona um requisito minimo de votos

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
}
