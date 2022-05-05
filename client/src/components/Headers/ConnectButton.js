import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setConnected,
    connectState,
    disconnected,
} from '../../app/reducers/walletSlice';
import { getEthBalance } from 'utils/contract';


function ConnectButton() {
    const [wallet, setWallet] = useState("0x0");
    const [balance, setBalance] = useState(0);

    const connected = useSelector(connectState);
    const dispatch = useDispatch();

    const connectWalletHandler = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            alert("Install MetaMask");
            return;
        }
        
        ethereum.on('accountsChanged', async function (accounts) {
            let wallet = accounts[0];
            if (wallet) {
                let balance = await getEthBalance(wallet);
                setBalance(balance); //set balance of token to balance variable
                setWallet(wallet); // set connected wallet address
                dispatch(setConnected(wallet.toString())) // update connected, address of store
            } else { 
                // if disconnect account on metamask, disconnect account(set connected to false of store)
                await disconnectWalletHandler();
            }
        });
        ethereum.on('chainChanged', async function (networkId) {
            // if connected chain is not avalanche fuji test net, disconnect wallet
            if(networkId !== '0x61') {
                disconnectWalletHandler();
            }
        })
        
        if (wallet!=="0x0") {
            let balance = await getEthBalance(wallet);
            setBalance(balance); //set balance of token to balance variable
        }

        try {
            // request connect one account of metamask to current website
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            // get connected chain id
            const chainId = await window.ethereum.request({ method: 'eth_chainId'});

            if (chainId==="0x61") {
                let wallet = accounts[0];
                let balance = await getEthBalance(wallet);
                // console.log(balance, "ddd");
                setBalance(balance);
                setWallet(wallet);
                dispatch(setConnected(wallet.toString()))
            }
            
        } catch (err) {
            console.log(err);
        }
    };

    const disconnectWalletHandler =useCallback(() => {
        setWallet('0x0');
        dispatch(disconnected()); // update connected of store to false
    }, [dispatch]);

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} type="button" className="btn btn-dark">
                Connect MetaMask
            </button>
        )
    }

    const disconnectWalletButton = () => {
        // this is displayed after wallet is connected to site
        return (
            <div>
                <button type="button" className="mr-2 btn btn-dark">
                    {(balance/10**18).toFixed(3)}
                </button>
                <button type="button" className="mr-2 btn btn-dark">
                    {wallet.substring(0, 6)}...{wallet.substring(38, 42)} 
                </button>
                <button onClick={disconnectWalletHandler} type="button" className="btn btn-dark">
                    Disconnect Wallet
                </button>
            </div>
        )
    }

    return (
        <div>
            {!connected ? connectWalletButton() : disconnectWalletButton()}
        </div>
    )
}

export default ConnectButton;