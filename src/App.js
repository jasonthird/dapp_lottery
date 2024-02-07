import React, { Component, useState } from 'react';
import contract from './contract/artifacts/Lottery.json';

const Web3 = require('web3');
const abi = contract.abi;
const address = '0x704C5Bb7c68123fe5041E2B3e31d26CDd6c164dC';

function LotteryBallot() {

  const [selected, setSelected] = useState(null);
  const [bids, setBids] = useState([0, 0, 0]);
  const [currentAccount, setCurrentAccount] = useState('0x0');
  const [ownersAccount, setOwnersAccount] = getOwner();
  

  const handleClick = (item) => {
    setSelected(item);
  }

  const getOwner = () => {
    const web3 = new Web3(Web3.givenProvider);
    const lottery = new web3.eth.Contract(abi, address);
    const owner = lottery.methods.owner().call();
    setOwnersAccount(owner);
  }

  // const getAccount = async () => {
  //   const { ethereum } = window;
  //   if (!ethereum) {
  //     console.log('Make sure you have a wallet installed!');
  //     return;
  //   }
  //   const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  //   setCurrentAccount(accounts[0]);
  // }

  const bidLaptop = () => {
    // Increase the bid for the selected item by 1
    setBids([bids[0] + 1, bids[1], bids[2]]);
  }
    
  const handleReveal = () => {
    // Implement reveal functionality here
    alert('Congratulations! You won the ' + selected + '!');
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
      <button onClick={bidLaptop} disabled={selected}>
        Laptop
      </button>
      {bids[0]}
      </div>
    );
  }

  const CarSelection=()=> {
    return (
      <div>
        <button onClick={() => handleClick('Car')} disabled={selected}>
          Car
        </button>
      </div>
    );
  }

  function PhoneSelection() {
    return (
      <button onClick={() => handleClick('Phone')} disabled={selected}>
        Phone
      </button>
    );
  }

  return (
    <div className="lottery-ballot">
      <h1>Lottery - Ballot</h1>
      <div className='selection'> 
      <CarSelection />
      <PhoneSelection />
      <LaptopSelection />

      </div>
      <div className="bid-details">
        <p>Bid: {selected ? 5 : '-'}</p>
        <p>Current Account: {currentAccount}</p>
        <p>Owner's Account: {ownersAccount}</p>
      </div>
      <div className="actions">
        <button onClick={handleReveal} disabled={!selected}>
          Reveal
        </button>
        <button onClick={handleWithdraw} disabled={!selected}>
          Withdraw
        </button>
        <button onClick={handleDeclareWinner} disabled={!selected}>
          Declare Winner
        </button>
      </div>
    </div>
  );
}

export default LotteryBallot;
