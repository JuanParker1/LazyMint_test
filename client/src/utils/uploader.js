import axios from 'axios';
import FormData from 'form-data';
import { pinataApiKey, pinataSecretApiKey } from 'constants/config';

export const uploadToIPFS = async (file, name) => {
    try {
        var fd = new FormData();
        fd.append("file", file);
        const metadata = JSON.stringify({
            name: name,
            keyvalues: {
            }
        });
        fd.append('pinataMetadata', metadata);
    
        const pinataOptions = JSON.stringify({
            cidVersion: 0
        });
        fd.append('pinataOptions', pinataOptions);
    
        let response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fd, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${fd._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
        return response;
    } catch (error) {
        console.log("Uploading Error", error);
        return "";
    }
}


