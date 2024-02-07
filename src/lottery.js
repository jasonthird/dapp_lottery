import web3 from "./web3";
import contract from "./contract/artifacts/Lottery.json";

const address = '0x704C5Bb7c68123fe5041E2B3e31d26CDd6c164dC';

const abi = contract.abi;


//connect to testnet
const lottery = new web3.eth.Contract(abi, address);

export default lottery;