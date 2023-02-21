let walletAddress = ""
let metadatasNFTs = []
let contract = null
let cardsElements = document.querySelector(".cards")
const contractAddress = "0x7B95A3d1b73061702F6313e5754205395BD2D44d";
let web3provider = undefined;

document.querySelector("#mintBAYC").addEventListener('click', async () => {
    if(web3provider != undefined){
        try {
            const nftContract = new web3provider.eth.Contract(contractABI, contractAddress);
            nftContract.methods.mintApe(1).send({from: walletAddress})
        } catch (error) {
            console.log("Erro ao mintar NFT")
        }
        
    }
})

function getMinted(){
    setInterval(async () => {
        const nftContract = new web3provider.eth.Contract(contractABI, contractAddress);
        const minted = await nftContract.methods.totalSupply().call()
        document.querySelector("#supply-nft").innerHTML = minted;
    }, 1500);
}

function changeApe(){
    let i = 2;
    setInterval(() => {
        if(i > 10)
            i = 1;
        document.querySelector(".sneak-peak").src = `./assets/${i}.png`;
        i++;
    }, 1200);
}


async function connect(){
    const { ethereum } = window
    //  Create Web3 instance
    if (ethereum) {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const account = accounts[0]
        const web3 = new Web3(window.ethereum);
        web3provider = web3
        walletAddress = account

        document.querySelector(".buttonConnect").innerHTML = account.substring(0,5) + '...' + account.substring(account.length - 4)

        //  Get Chain Id and switch newtork
        const chainId = await web3.eth.getChainId();

        if (chainId !== 5) {
            try {
                await web3.currentProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(5) }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    await web3.currentProvider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: Web3.utils.toHex(5) }],
                    })
                }
            }
        }
    }else{
        console.log("Algo de errado!")
    }

    getMinted()
}

async function disconnect(){
    document.querySelector(".buttonConnect").innerHTML = "Conectar"
    // Close provider session
    console.log("Desconectou")
}

document.querySelector('#connectWallet').addEventListener('click', () => {
    if(document.querySelector('#connectWallet').innerHTML != "Conectar"){
        disconnect();
    }else{
        connect();
    }
})

changeApe()