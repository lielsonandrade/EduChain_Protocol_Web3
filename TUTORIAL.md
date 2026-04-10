# Tutorial: Como Rodar o EduChain Protocol Web3 do Zero

Este tutorial irá guiá-lo através do processo de configuração e execução do projeto Web3 `EduChain_Protocol_Web3` em sua máquina local. O projeto utiliza Hardhat para desenvolvimento de contratos inteligentes.

## 1. Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados em seu sistema:

*   **Node.js e npm (ou Yarn)**: O Node.js é um ambiente de tempo de execução JavaScript que inclui o npm (Node Package Manager). Você pode baixá-lo em [nodejs.org](https://nodejs.org/). Recomenda-se usar a versão LTS.
*   **Git**: Para clonar o repositório do projeto. Baixe em [git-scm.com](https://git-scm.com/).

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

### 2.3. Configurar Variáveis de Ambiente

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

## 3. Interagindo com os Contratos

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

Para implantar seus contratos em uma rede local (como Hardhat Network) ou em uma rede de teste (como Sepolia), você pode usar um script de implantação. Assumindo que você tem um script `deploy.js` na pasta `scripts/`:

```bash
npx hardhat run scripts/deploy_sepolia.cjs --network sepolia
```

Substitua `sepolia` pela rede desejada configurada em `hardhat.config.cjs`.

## 4. Estrutura do Projeto

O projeto `EduChain_Protocol_Web3` possui a seguinte estrutura principal:

```
meu-protocolo-web3/
├── contracts/              # Contratos inteligentes Solidity
├── scripts/                # Scripts para implantação, interação, etc.
├── test/                   # Testes para os contratos inteligentes
├── hardhat.config.cjs      # Configuração do Hardhat
├── package.json            # Dependências e scripts do projeto
├── .gitignore              # Arquivos e pastas a serem ignorados pelo Git
├── .env.example            # Exemplo de arquivo de variáveis de ambiente
└── TUTORIAL.md             # Este tutorial
```


