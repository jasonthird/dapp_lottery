import Web3 from 'web3';

// const web3 = new Web3("https://rpc2.sepolia.org");
const web3 = new Web3(window.ethereum);
try {
    // Request account access if needed
    window.ethereum.enable();
    //check if the user is in the right network
    const networkId = web3.eth.net.getId();
    console.log(networkId);
}catch (error) {
    // User denied account access...
    console.log("User denied account access");
    alert("Please install MetaMask");
}



export default web3;