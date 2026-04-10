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

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter, uint256 weight);
    event ProposalExecuted(uint256 proposalId);

    constructor(address _votingToken) {
        votingToken = IERC20(_votingToken);
    }

    /**
     * @dev Cria uma nova proposta para a comunidade votar.
     */
    function createProposal(string memory _description) external onlyOwner {
        uint256 proposalId = proposals.length;
        Proposal storage newProposal = proposals.push();
        newProposal.description = _description;
        newProposal.deadline = block.timestamp + votingDuration;
        
        emit ProposalCreated(proposalId, _description);
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
     */
    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "Votacao ainda em curso");
        require(!proposal.executed, "Proposta ja executada");

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
}
