import React, {useState, useEffect} from 'react';
// import contract from './contract/artifacts/Lottery.json';
import Lottery from './lottery';
import web3 from './web3';

// const address = '0x704C5Bb7c68123fe5041E2B3e31d26CDd6c164dC';

function LotteryBallot() {

  const [bids, setBids] = useState([0, 0, 0]);
  const [currentAccount, setCurrentAccount] = useState('0x000');
  const [ownersAccount, setOwnersAccount] = useState('0x000');
  const [ethBalance, setEthBalance] = useState(0);
  const bidLaptop = () => {
    // Increase the bid for the selected item by 1
    setBids([bids[0] + 1, bids[1], bids[2]]);
  }

  const getUserAddress = () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        setCurrentAccount(accounts[0]);
      })
      .catch((err) => console.error(err));  
  }

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(currentAccount);
    const eth = web3.utils.fromWei(balance, 'ether');
    setEthBalance(eth);
  }

  const getContractOwner = async () => {
    const owner = await Lottery.provider.getSigner();
    setOwnersAccount(owner);
  }
    
  const handleReveal = () => {
    // Implement reveal functionality here
    alert('Congratulations! You won the ' + '!');
  };

  const handleWithdraw = () => {
    // Implement withdraw functionality here
    alert('Your bid has been withdrawn.');
  };

  const handleDeclareWinner = () => {
    // Implement declare winner functionality here
    alert('A winner has been declared!');
  };

  const LaptopSelection=()=> {
    return (
      <div className='selection'>
      <button onClick={bidLaptop}>
        Laptop
      </button>
      {bids[0]}
      </div>
    );
  }

  const CarSelection=()=> {
    return (
      <div>
        <button >
          Car
        </button>
      </div>
    );
  }

  function PhoneSelection() {
    return (
      <button >
        Phone
      </button>
    );
  }

  function load(){
    getUserAddress();

    //check event account change and update the state
    window.ethereum.on('accountsChanged', function (accounts) {
      setCurrentAccount(accounts[0]);
    });
  }

  useEffect(load, []);

  useEffect(() => {
    if (currentAccount!== '0x000') {
      getBalance();
    }
  }, [currentAccount]);



  return (

    <div className="lottery-ballot">
      <h1>Lottery - Ballot</h1>
      <div className='selection'> 
      <CarSelection />
      <PhoneSelection />
      <LaptopSelection />

      </div>
      <div className="bid-details">
        <p>Current Account: {currentAccount}</p>
        <p>Balance eth: {ethBalance}</p>
        <p>Owner's Account: {ownersAccount}</p>
      </div>
      <div className="actions">
        <button onClick={getUserAddress}>
          Reveal
        </button>
        <button onClick={handleWithdraw}>
          Withdraw
        </button>
        <button onClick={handleDeclareWinner}>
          Declare Winner
        </button>
      </div>
    </div>
  );
}

export default LotteryBallot;
