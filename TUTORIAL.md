# Tutorial: Como Rodar o EduChain Protocol Web3 do Zero

Este tutorial irá guiá-lo através do processo de configuração e execução do projeto Web3 `EduChain_Protocol_Web3` em sua máquina local. O projeto utiliza Hardhat para desenvolvimento de contratos inteligentes e um frontend refatorado para interação.

## 1. Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados em seu sistema:

*   **Node.js e npm (ou Yarn)**: O Node.js é um ambiente de tempo de execução JavaScript que inclui o npm (Node Package Manager). Você pode baixá-lo em [nodejs.org](https://nodejs.org/). Recomenda-se usar a versão LTS.
*   **Git**: Para clonar o repositório do projeto. Baixe em [git-scm.com](https://git-scm.com/).
*   **MetaMask**: Extensão de navegador para interagir com a blockchain Ethereum. Instale-a em seu navegador preferido.

## 2. Configuração do Ambiente

Siga os passos abaixo para configurar o projeto:

### 2.1. Clonar o Repositório

Primeiro, clone o repositório do GitHub para sua máquina local. Substitua `[URL_DO_SEU_REPOSITORIO]` pela URL real do seu repositório no GitHub.

```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd EduChain_Protocol_Web3
```

### 2.2. Instalar Dependências

Navegue até o diretório do projeto e instale todas as dependências necessárias usando npm ou Yarn:

```bash
npm install
# ou
yarn install
```

### 2.3. Configurar Variáveis de Ambiente (Opcional, para implantação/testes de contrato)

Este projeto utiliza variáveis de ambiente para informações sensíveis, como URLs de RPC e chaves privadas. Você precisará criar um arquivo `.env` na raiz do projeto.

1.  Copie o arquivo de exemplo fornecido:
    ```bash
    cp .env.example .env
    ```
2.  Abra o arquivo `.env` recém-criado e preencha as variáveis:
    *   `ALCHEMY_SEPOLIA_URL`: A URL do seu nó RPC para a rede Sepolia (ou outra rede que você esteja usando). Você pode obter uma gratuitamente em serviços como Alchemy ou Infura.
    *   `PRIVATE_KEY`: A chave privada da sua carteira Ethereum. **ATENÇÃO: NUNCA use uma chave privada de uma carteira com fundos reais em um ambiente de desenvolvimento ou teste. Crie uma carteira nova apenas para desenvolvimento.**

    Seu arquivo `.env` deve se parecer com isto (com seus próprios valores):
    ```
    ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/SUA_CHAVE_DA_ALCHEMY
    PRIVATE_KEY=0xSUA_CHAVE_PRIVADA
    ```

## 3. Interagindo com os Contratos (Backend)

### 3.1. Compilar Contratos

Para compilar os contratos inteligentes, execute o seguinte comando:

```bash
npx hardhat compile
```

Isso irá gerar os artefatos de compilação na pasta `artifacts/`.

### 3.2. Executar Testes

Se houver testes definidos para os contratos, você pode executá-los com:

```bash
npx hardhat test
```

### 3.3. Implantar Contratos (Opcional)

Para implantar seus contratos em uma rede local (como Hardhat Network) ou em uma rede de teste (como Sepolia), você pode usar um script de implantação. Assumindo que você tem um script `deploy_sepolia.cjs` na pasta `scripts/`:

```bash
npx hardhat run scripts/deploy_sepolia.cjs --network sepolia
```

Substitua `sepolia` pela rede desejada configurada em `hardhat.config.cjs`.

## 4. Executando o Frontend

O frontend foi refatorado para utilizar módulos JavaScript (ES6) e interage diretamente com os contratos implantados na rede Sepolia. Para que ele funcione corretamente, você precisará executá-lo através de um servidor web local. Abrir o arquivo `index.html` diretamente no navegador pode causar erros de CORS (Cross-Origin Resource Sharing).

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

Após iniciar o servidor, abra o navegador, conecte sua carteira MetaMask (certifique-se de estar na rede Sepolia) e interaja com as funcionalidades do protocolo.

## 5. Estrutura do Projeto Atualizada

O projeto `EduChain_Protocol_Web3` agora possui a seguinte estrutura principal, com a separação do frontend:

```
meu-protocolo-web3/
├── contracts/              # Contratos inteligentes Solidity
├── scripts/                # Scripts para implantação, etc.
├── test/                   # Testes para os contratos inteligentes
├── app.js                  # Lógica JavaScript do frontend (interação Web3, DOM)
├── constants.js            # Constantes do frontend (endereços de contrato, ABIs)
├── index.html              # Estrutura HTML e CSS do frontend
├── hardhat.config.cjs      # Configuração do Hardhat
├── package.json            # Dependências e scripts do projeto
├── .gitignore              # Arquivos e pastas a serem ignorados pelo Git
├── .env.example            # Exemplo de arquivo de variáveis de ambiente
├── README.md               # Informações gerais do projeto
└── TUTORIAL.md             # Este tutorial
```
