import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import {
    connectState,
    connectedAddress
} from '../app/reducers/walletSlice';
import { getNFTs, updateNFT } from "api/api";
import { redeem } from "utils/contract";
import { baseUrl } from "constants/config";

export default function ExploreLazyNFT() {
    const connected = useSelector(connectState);
    const wallet = useSelector(connectedAddress);
    const [nfts, setNfts] = useState([]);
    
    async function loadNFTs() {
        let nfts = await getNFTs();
        console.log(nfts)
        setNfts(nfts);
    }

    useEffect(() => {
        loadNFTs();
    }, [])

    const buyLazyNFT = async(lazyNFT) => {
        if (!connected) {
            alert("Please connect metamask");
            return;
        }
        try {
            await redeem(wallet, lazyNFT.signature, lazyNFT.price);
            let nft = {...lazyNFT, owner: wallet}
            await updateNFT(nft);
            
        } catch {}
    }

    const parseWeiToETh = (wei) => {
        return (parseInt(wei)/10**18).toFixed(3);
    }

    return (
        <>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {nfts.map(nft => (
                    <div key={nft._id} className="card mr-4 mb-4" style={{width: "250px"}}>
                        <img 
                            className="card-img-top"
                            style={{
                                height: "210px"
                            }}
                            src={baseUrl+nft.uri} 
                            alt="Loading Error"
                        />
                        <div className="card-body">
                            <span className="card-title">Current Price</span>
                            <p className="card-text" style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                                <img
                                    alt="..."
                                    src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg"
                                    style={{width: "14px", marginRight: "4px"}}
                                />
                                {parseWeiToETh(nft.price)}
                            </p>
                        </div>
                        <div className="card-footer" style={{display: "flex", justifyContent: "center"}}>
                            {nft.owner===undefined||nft.owner==="" ? 
                                (<button type="button" className="btn btn-success" onClick={()=>buyLazyNFT(nft)}>
                                    Buy Now
                                </button>) :
                                (<button type="button" className="btn btn-dark">
                                    Sold Out
                                </button>)
                            }
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}