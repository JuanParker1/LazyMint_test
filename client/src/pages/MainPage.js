import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import {
    connectState,
    connectedAddress
} from '../app/reducers/walletSlice';
import { createVoucher, availableToWithraw, withdraw } from "utils/contract";
import { uploadToIPFS } from "utils/uploader";
import { createLazyNFT, getNFTs } from "api/api";

const center = {
    display: "flex",
    justifyContent: "center",
}

export default function MainPage() {
    const connected = useSelector(connectState);
    const wallet = useSelector(connectedAddress);
    const [selectedImage, setSelectedImage] = useState(undefined);
    const [price, setPrice] = useState(0);
    const [awailableBNB, setAvailableBNB] = useState(0);

    const mintLazyNFT = async() => {
        if (!connected) {
            alert("Please connect metamask");
            return;
        } else if(selectedImage==null) {
            alert("Choose Image");
            return;
        }
        let tokenID = (await getNFTs()).length + 4;
        let success = await uploadToIPFS(selectedImage, tokenID);
        // let success ={data: {IpfsHash: "await  Upload(values.userID)"}};
        if (success) {
            let voucher = await createVoucher(tokenID, success.data.IpfsHash, parseFloat(price) * 10 ** 18);
            let data = await createLazyNFT({
                tokenID: 1,
                uri: success.data.IpfsHash,
                price: (parseFloat(price) * 10 ** 18).toString(),
                creator: wallet,
                signature: voucher
            });
            console.log(data);
        } else {
            alert("Image can't be uploaded");
        }
    }

    const withdrawBNB = async () => {
        try{
            await withdraw(wallet);
            await loadAvailableBNB();
        } catch {
            console.error()
        }
    }
    
    const loadAvailableBNB = async() => {
        let amount = await availableToWithraw(wallet);
        setAvailableBNB((amount/10**18).toFixed(3))
    }

    useEffect(() => {
        loadAvailableBNB(wallet);
    }, [wallet])


    return (
        <>
            <div 
                className="mt-5"
                style={center}
            >
                <div>
                    <h2 style={{textAlign: "center"}}>Withdraw Available BNB</h2>
                    <div className="input-group mt-3 mb-5">
                        <div className="input-group-append" style={{width: "290px"}}>
                            <span className="input-group-text">Available BNB Amount: {awailableBNB}</span>
                        </div>
                        <div className="mr-0">
                            <button type="button" className="btn btn-dark" onClick={withdrawBNB}>
                                withraw
                            </button>
                        </div>
                    </div>

                    <h2 style={{textAlign: "center"}}>Mint New NFT</h2>
                    <div>
                        {selectedImage!==undefined && 
                            <img 
                                alt="not fount" 
                                src={URL.createObjectURL(selectedImage)} 
                                style={{
                                    width: "600px",
                                }}
                            />
                        }
                    </div>
                    
                    <div className="input-group mt-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file">
                            <input
                                className="custom-file-input"
                                id="inputGroupFile01"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    console.log(event.target.files[0]);
                                    setSelectedImage(event.target.files[0]);
                                }}
                            />  
                            <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                        </div>
                    </div>
                    
                    <div className="input-group mt-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Price</span>
                        </div>
                        <input 
                            type="number" 
                            className="form-control" 
                            aria-label="Amount (to the nearest dollar)"
                            onChange={(event) => {
                                if (event.target.value>=0) setPrice(event.target.value)
                            }}
                            value={price}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">BNB</span>
                        </div>
                    </div>
                    
                    <div className="mt-3" style={center}>
                        <button type="button" className="mr-2 btn-lg btn-success" onClick={mintLazyNFT}>
                            Lazy Mint
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
