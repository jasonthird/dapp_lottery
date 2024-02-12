import web3 from "./web3";
import contract from "./contract/artifacts/Lottery.json";

const address = '0x1E49CEFEDCA02C68B9D518d4db5F60B01c21e21D';

const abi = contract.abi;


//connect
const lottery = new web3.eth.Contract(abi, address);

export default lottery;