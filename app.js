import { CONTRACTS, TOKEN_ABI, NFT_ABI, STAKING_ABI, DAO_ABI } from './constants.js';

// Estado da aplicação
const state = {
    connected: false,
    account: "",
    provider: null,
    signer: null,
    networkName: "",
    chainId: 0
};

// Elementos do DOM
const elements = {
    connectBtn: document.getElementById("connectBtn"),
    messageDiv: document.getElementById("message"),
    balanceCard: document.getElementById("balanceCard"),
    balanceAmount: document.getElementById("balanceAmount"),
    networkInfo: document.getElementById("networkInfo"),
    mintBtn: document.getElementById("mintBtn"),
    stakeBtn: document.getElementById("stakeBtn"),
    stakeAmount: document.getElementById("stakeAmount"),
    voteBtn: document.getElementById("voteBtn"),
    proposalSelect: document.getElementById("proposalSelect"),
    createProposalBtn: document.getElementById("createProposalBtn"),
    newProposalDescription: document.getElementById("newProposalDescription")
};

/**
 * Exibe mensagens de feedback para o usuário
 * @param {string} text - Texto da mensagem
 * @param {string} type - Tipo da mensagem (success, error, warning)
 */
function showMessage(text, type) {
    elements.messageDiv.textContent = text;
    elements.messageDiv.className = `message ${type} show`;
    console.log(`[${type.toUpperCase()}] ${text}`);
    setTimeout(() => {
        elements.messageDiv.classList.remove("show");
    }, 6000);
}

/**
 * Atualiza o estado dos botões da interface
 * @param {boolean} disabled - Se os botões devem estar desabilitados
 */
function setButtonsDisabled(disabled) {
    elements.mintBtn.disabled = disabled;
    elements.stakeBtn.disabled = disabled;
    elements.stakeAmount.disabled = disabled;
    elements.voteBtn.disabled = disabled;
    elements.proposalSelect.disabled = disabled;
    elements.createProposalBtn.disabled = disabled;
    elements.newProposalDescription.disabled = disabled;
}

/**
 * Executa uma transação com feedback visual no botão
 * @param {HTMLElement} btn - O botão que disparou a ação
 * @param {Function} action - A função assíncrona que executa a transação
 * @param {string} originalText - O texto original do botão
 */
async function handleTransaction(btn, action, originalText) {
    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span>Processando...';
        await action();
    } catch (error) {
        console.error("Erro na transação:", error);
        showMessage(`❌ Erro: ${error.reason || error.message || "Ocorreu um erro inesperado"}`, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

/**
 * Obtém e exibe o saldo de tokens EDU do usuário
 */
async function getBalance() {
    try {
        const contract = new ethers.Contract(CONTRACTS.token, TOKEN_ABI, state.provider);
        const bal = await contract.balanceOf(state.account);
        const formattedBalance = ethers.formatUnits(bal, 18);
        const displayBalance = parseFloat(formattedBalance).toFixed(2);
        
        elements.balanceAmount.textContent = `${displayBalance} EDU`;

        if (displayBalance === "0.00") {
            showMessage("ℹ️ Você tem 0 EDU. Você pode emitir um NFT ou votar na DAO mesmo assim!", "warning");
        }
    } catch (error) {
        console.error("Erro ao obter saldo:", error);
        elements.balanceAmount.textContent = "Não disponível";
    }
}

/**
 * Carrega as propostas da DAO e popula o select
 */
async function loadProposals() {
    try {
        const daoContract = new ethers.Contract(CONTRACTS.dao, DAO_ABI, state.provider);
        const proposalCount = (await daoContract.proposals.length);
        elements.proposalSelect.innerHTML = ''; // Limpa as opções existentes

        for (let i = 0; i < proposalCount; i++) {
            const proposal = await daoContract.proposals(i);
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Proposta #${i}: ${proposal.description} (Votos: ${proposal.voteCount})`;
            elements.proposalSelect.appendChild(option);
        }
    } catch (error) {
        console.error("Erro ao carregar propostas:", error);
        showMessage("❌ Erro ao carregar propostas da DAO.", "error");
    }
}

/**
 * Conecta a carteira MetaMask
 */
async function connectWallet() {
    try {
        if (!window.ethereum) {
            showMessage("❌ MetaMask não instalado. Instale a extensão!", "error");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        state.account = accounts[0];
        state.provider = new ethers.BrowserProvider(window.ethereum);
        state.signer = await state.provider.getSigner();
        state.connected = true;

        const network = await state.provider.getNetwork();
        state.networkName = network.name;
        state.chainId = network.chainId;

        // Atualiza UI
        elements.connectBtn.textContent = `${state.account.slice(0, 6)}...${state.account.slice(-4)}`;
        elements.connectBtn.classList.add("connected");
        elements.balanceCard.style.display = "block";
        elements.networkInfo.innerHTML = `Rede: <strong>${state.networkName}</strong> (Chain ID: ${state.chainId})`;
        
        setButtonsDisabled(false);
        showMessage("✅ Carteira conectada com sucesso!", "success");
        
        await getBalance();
        await loadProposals();
    } catch (error) {
        console.error("Erro ao conectar:", error);
        showMessage(`❌ Erro: ${error.message || "Erro ao conectar carteira"}`, "error");
    }
}

/**
 * Emite um certificado NFT
 * NOTA: Esta função requer que o endereço conectado tenha a role CERTIFICATE_ISSUER_ROLE.
 * Em um ambiente de produção, isso seria feito por um backend autorizado.
 */
async function mintNFT() {
    await handleTransaction(elements.mintBtn, async () => {
        const contract = new ethers.Contract(CONTRACTS.nft, NFT_ABI, state.signer);
        const tx = await contract.issueCertificate(state.account, "ipfs://QmSampleHash", "Web3 Avançado");
        
        showMessage("⏳ Aguardando confirmação da transação...", "warning");
        await tx.wait();
        
        showMessage("✅ Certificado NFT emitido com sucesso!", "success");
    }, "Emitir NFT");
}

/**
 * Realiza o staking de tokens EDU
 */
async function stakeTokens() {
    const amount = elements.stakeAmount.value;
    if (!amount || amount <= 0) {
        showMessage("❌ Insira uma quantidade válida", "error");
        return;
    }

    await handleTransaction(elements.stakeBtn, async () => {
        const tokenContract = new ethers.Contract(CONTRACTS.token, TOKEN_ABI, state.signer);
        const stakingContract = new ethers.Contract(CONTRACTS.staking, STAKING_ABI, state.signer);
        const amountWei = ethers.parseUnits(amount, 18);

        showMessage("⏳ Aprovando tokens...", "warning");
        const approveTx = await tokenContract.approve(CONTRACTS.staking, amountWei);
        await approveTx.wait();

        showMessage("⏳ Fazendo stake...", "warning");
        const stakeTx = await stakingContract.stake(amountWei);
        await stakeTx.wait();

        showMessage("✅ Stake realizado com sucesso!", "success");
        elements.stakeAmount.value = "";
        await getBalance();
    }, "Fazer Stake");
}

/**
 * Cria uma nova proposta na DAO
 */
async function createProposal() {
    const description = elements.newProposalDescription.value;
    if (!description) {
        showMessage("❌ A descrição da proposta não pode estar vazia.", "error");
        return;
    }

    await handleTransaction(elements.createProposalBtn, async () => {
        const daoContract = new ethers.Contract(CONTRACTS.dao, DAO_ABI, state.signer);
        showMessage("⏳ Criando proposta...", "warning");
        const tx = await daoContract.createProposal(description);
        await tx.wait();
        showMessage("✅ Proposta criada com sucesso!", "success");
        elements.newProposalDescription.value = "";
        await loadProposals(); // Recarrega as propostas após a criação
    }, "Criar Proposta");
}

/**
 * Vota em uma proposta da DAO
 */
async function voteDAO() {
    const proposalId = elements.proposalSelect.value;
    if (proposalId === "") {
        showMessage("❌ Selecione uma proposta para votar.", "error");
        return;
    }

    await handleTransaction(elements.voteBtn, async () => {
        const daoContract = new ethers.Contract(CONTRACTS.dao, DAO_ABI, state.signer);
        showMessage(`⏳ Registrando seu voto na Proposta #${proposalId}...`, "warning");
        const tx = await daoContract.vote(proposalId);
        await tx.wait();

        showMessage(`✅ Voto registrado com sucesso na Proposta #${proposalId}!`, "success");
        await loadProposals(); // Recarrega as propostas para atualizar a contagem de votos
    }, "Votar Agora");
}

// Event Listeners
elements.connectBtn.addEventListener("click", connectWallet);
elements.mintBtn.addEventListener("click", mintNFT);
elements.stakeBtn.addEventListener("click", stakeTokens);
elements.voteBtn.addEventListener("click", voteDAO);
elements.createProposalBtn.addEventListener("click", createProposal);

// Inicialização
setButtonsDisabled(true); // Desabilita botões até a conexão da carteira
console.log("=== EDU PROTOCOL FRONTEND INICIALIZADO ===");
