import web3 from "./web3";
import contract from "./contract/artifacts/Lottery.json";

const address = '0xc5E906C0b1A49d2FCD3891EB6F61D4007a302a49';

const abi = contract.abi;


//connect
const lottery = new web3.eth.Contract(abi, address);

export default lottery;