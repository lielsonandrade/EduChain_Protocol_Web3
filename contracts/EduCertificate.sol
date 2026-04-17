// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract EduCertificate is Context, ERC721, ERC721URIStorage, AccessControl {
    uint256 private _nextTokenId;

    bytes32 public constant CERTIFICATE_ISSUER_ROLE = keccak256("CERTIFICATE_ISSUER_ROLE");

    event CertificateIssued(address indexed student, uint256 indexed tokenId, string courseName);

    constructor() ERC721("EduCertificate", "EDUCERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(CERTIFICATE_ISSUER_ROLE, _msgSender()); // O deployer também é um emissor de certificados
    }

    function issueCertificate(address student, string memory uri, string memory courseName)
        public
        onlyRole(CERTIFICATE_ISSUER_ROLE)
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, uri);

        emit CertificateIssued(student, tokenId, courseName);
        return tokenId;
    }

    //  Override obrigatório
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
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
