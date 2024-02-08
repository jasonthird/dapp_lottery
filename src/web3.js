import Web3 from 'web3';

// const web3 = new Web3("https://rpc2.sepolia.org");
const web3 = new Web3(window.ethereum);
window.ethereum.enable();

//check if the user is in the right network
const networkId = web3.eth.net.getId();
console.log(networkId);

export default web3;