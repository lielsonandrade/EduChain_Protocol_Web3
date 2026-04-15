# Protocolo de Educação Descentralizada (Learn-to-Earn)

Este projeto é um MVP funcional de um protocolo descentralizado de educação, desenvolvido como parte da Fase 2 Avançada do curso de Desenvolvimento de Protocolo Web3.

## 🚀 Funcionalidades

- **EduToken (ERC-20):** Token de recompensa para alunos e governança.
- **EduCertificate (ERC-721):** Certificados de conclusão emitidos como NFTs.
- **Staking:** Sistema de travamento de tokens para ganho de recompensas.
- **DAO:** Governança descentralizada para votação em novas propostas de cursos.
- **Oráculo (Chainlink):** Integração com o preço ETH/USD para ajustes dinâmicos.

## 🛠️ Tecnologias Utilizadas

- **Solidity:** Linguagem dos contratos inteligentes.
- **Hardhat:** Ambiente de desenvolvimento e testes.
- **OpenZeppelin:** Bibliotecas de contratos seguros.
- **Chainlink:** Oráculos descentralizados.
- **Ethers.js:** Integração Web3.
- **HTML/CSS/JavaScript (Módulos ES6):** Frontend para interação com o protocolo.

## 📦 Endereços dos Contratos (Sepolia)

- **EduToken:** `0x2016ee7489541f6536e2C72230D02282C0DA2B84`
- **EduCertificate:** `0x6a207B07a63737498DdDB32120bE72B2F857b285`
- **EduStaking:** `0x562Be5344D53E844B1fE3C8dbD7FB60fA9134e98`
- **EduDAO:** `0xD070c2ea278684045B7364133eEa2Df5fa0400Cc`

## 🔧 Como Executar

### 1. Configuração do Projeto

1.  Instale as dependências:
    ```bash
    npm install
    ```

2.  Compile os contratos:
    ```bash
    npx hardhat compile
    ```

3.  Execute os testes (opcional):
    ```bash
    npx hardhat test
    ```

### 2. Executando o Frontend

O frontend foi refatorado para utilizar módulos JavaScript (ES6). Para que ele funcione corretamente, você precisará executá-lo através de um servidor web local. Abrir o arquivo `index.html` diretamente no navegador pode causar erros de CORS.

**Opções para rodar um servidor local:**

*   **Com `npx serve` (recomendado para desenvolvimento rápido):**
    1.  Instale o `serve` globalmente (se ainda não tiver):
        ```bash
        npm install -g serve
        ```
    2.  Navegue até a pasta raiz do projeto (`EduChain_Protocol_Web3/EduChain_Protocol_Web3`) e execute:
        ```bash
        serve .
        ```
    3.  Abra seu navegador e acesse o endereço fornecido (geralmente `http://localhost:5000`).

*   **Com a extensão "Live Server" do VS Code:**
    1.  Instale a extensão "Live Server" no VS Code.
    2.  Abra a pasta do projeto no VS Code.
    3.  Clique com o botão direito no `index.html` e selecione "Open with Live Server".

--- 
Desenvolvido por Liélson Dos Santos Andrade
