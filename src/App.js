import React, {useState, useEffect} from 'react';
import Lottery from './lottery';
import web3 from './web3';

function LotteryBallot() {

  const [bids, setBids] = useState([0, 0, 0]);
  const [currentAccount, setCurrentAccount] = useState('0x000');
  const [ownersAccount, setOwnersAccount] = useState('0x000');
  const [ethBalance, setEthBalance] = useState(0);


  const bidLaptop = async () => {
    //we call bid function from the contract with the value of 3
    Lottery.methods.bid(2).send({from: currentAccount, value: web3.utils.toWei('0.01', 'ether'), gasLimit:3000000}).then((res) => {
      console.log(res);
    }
    ).catch((err) => {
      console.log(err);
    });
  }

  const getUserAddress = () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        setCurrentAccount(accounts[0]);
      })
      .catch((err) => {
        alert('Please connect to MetaMask');
      }
    ); 
  }

  const getBalance = async () => {
    if (await checkNetwork() === false || await checkMetamask() === false){
      return;
    }
    const balance = await web3.eth.getBalance(currentAccount);
    const eth = web3.utils.fromWei(balance, 'ether');
    setEthBalance(eth);
  }

  const getContractOwner = async () => {
    if (await checkNetwork() === false || await checkMetamask() === false){
      return;
    }
    const owner = await Lottery.methods.getOwner().call();
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

  const checkNetwork = async () => {
    const id = await web3.eth.net.getId();
    if (id !== 11155111n) {
      alert('Please connect to the Sepolia network');
      return false;
    }
    return true;
  }
  
  const checkMetamask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask');
      return false;
    }
    return true;
  }

  const getTotalBidValues = async () => {
    if (await checkNetwork() === false || await checkMetamask() === false){
      return;
    }
    const totalBids = await Lottery.methods.getAllItemBidNumber().call();
    const newbids = [parseInt([totalBids[0]]), parseInt([totalBids[1]]), parseInt([totalBids[2]])];
    console.log(totalBids);
    console.log(newbids);
    setBids(newbids);
  }

  const LaptopSelection=()=> {
    return (
      <div className='bid-button'>
      <button onClick={bidLaptop}>
        Laptop
      </button>
      <div className='bid-value'>
        {bids[2]}
      </div>
      </div>
    );
  }

  const CarSelection=()=> {
    return (
      <div className='bid-button'>
        <button >
          Car
        </button>
        <div className='bid-value'>
          {bids[0]}
        </div>
      </div>
    );
  }

  function PhoneSelection() {
    return (
      <div className='bid-button'>
      <button >
        Phone
      </button>
      <div className='bid-value'>
          {bids[1]}
      </div>
      </div>
    );
  }

  function load(){

    getUserAddress();
    getContractOwner();
    getTotalBidValues();

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
