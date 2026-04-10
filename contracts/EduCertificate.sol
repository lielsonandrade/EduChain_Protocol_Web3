// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EduCertificate is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event CertificateIssued(address indexed student, uint256 indexed tokenId, string courseName);

    // 🔥 REMOVIDO Ownable(msg.sender)
    constructor() ERC721("EduCertificate", "EDUCERT") {}

    function issueCertificate(address student, string memory uri, string memory courseName)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, uri);

        emit CertificateIssued(student, tokenId, courseName);
        return tokenId;
    }

    // ✅ Override obrigatório
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}