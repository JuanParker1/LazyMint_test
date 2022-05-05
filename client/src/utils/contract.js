import Web3 from 'web3';
import { ethers } from 'ethers';
import { 
    rpcUrl, 
    contractAddress, 
    chainId 
} from "../constants/config";
import { lazyNFTABI } from '../constants/lazyNFTABI';

const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
const SIGNING_DOMAIN_VERSION = "1"
const domain = {
    name: SIGNING_DOMAIN_NAME,
    version: SIGNING_DOMAIN_VERSION,
    verifyingContract: contractAddress,
    chainId,
};

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const getContract = (abiData, address) => {
    const abi = abiData;
    let contract = new web3.eth.Contract(abi , address);
    return contract;
}

const contract = getContract(lazyNFTABI, contractAddress);

export const getEthBalance = async (address) => {
    let balance =await web3.eth.getBalance(address);
    return balance;
}

export const createVoucher = async (tokenId, uri, price) => {
    const voucher = { 
        tokenId: tokenId, 
        uri: uri, 
        minPrice: price.toString()
    }
    const types = {
      NFTVoucher: [
        {name: "tokenId", type: "uint256"},
        {name: "minPrice", type: "uint256"},
        {name: "uri", type: "string"},  
      ]
    }
    console.log(voucher)
    const signature = await singMessage(domain, types, voucher)
    return {
      ...voucher,
      signature,
    }
}

export const redeem = async (address, voucher, _etherAmount) => {
    let dataABI = await contract.methods.redeem(address, voucher).encodeABI();
    let txHash = await signTransaction(address, dataABI, _etherAmount);
    return txHash;
}

export const availableToWithraw = async (address) => {
    let amount = await contract.methods.availableToWithdraw().call({from: address});
    return amount;
}

export const withdraw = async (address) => {
    let dataABI = await contract.methods.withdraw().encodeABI();
    let txHash = await signTransaction(address, dataABI, 0);
    return txHash;
}

const singMessage = async (domain, types, voucher) => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer._signTypedData(domain, types, voucher)
    return signature;
}

// sign transaction using metamask
const signTransaction = async (address, dataABI, _etherAmount) => {

    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: dataABI,
        gasLimit: "0x5208",
        chainId: chainId,
        value: parseInt(_etherAmount).toString(16),  // this should be hex !!!!
      };
    
    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
        return await checkTx(txHash);
    } catch (error) {
        console.log(error);
        return null;
    }
}

const checkTx = async (txHash) => {
    // let result = await web3.eth.getTransaction(txHash)
    let result = null;
    while(result==null) {
        result = await web3.eth.getTransactionReceipt(txHash.toString());
    }
    if (result.status) return txHash;
    else return null;
}