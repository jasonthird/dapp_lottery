import React, { useState, useEffect } from "react";
import Lottery from "./lottery";
import web3 from "./web3";
import lottery from "./lottery";

function LotteryBallot() {
  const [bids, setBids] = useState([0, 0, 0]);
  const [currentAccount, setCurrentAccount] = useState("0x000");
  const [ethBalance, setEthBalance] = useState(0);
  const [owners = [], setOwners] = useState([]);
  const [contractEthBalance, setContractEthBalance] = useState(0);

  const bidLaptop = async () => {
    bidItem(2);
  };

  const bidCar = async () => {
    bidItem(0);
  };

  const bidPhone = async () => {
    bidItem(1);
  };

  const bidItem = async (item) => {
    if ((await checkNetwork()) === false || (await checkMetamask()) === false) {
      return;
    }
    if (checkIfUserIsAnOwner() === true) {
      alert("The owner cannot participate in the lottery");
      return;
    }
    let biddable = true;
    await lottery.methods
      .items(item)
      .call()
      .then((res) => {
        if (res.winner != 0x0000000000000000000000000000000000000000) {
          alert("The lottery is closed for this item");
          biddable = false;
        }
      });

    if (biddable === false) {
      return;
    }

    //we call bid function from the contract
    Lottery.methods
      .bid(item)
      .send({
        from: currentAccount,
        value: web3.utils.toWei("0.01", "ether"),
        gasLimit: 3000000,
      })
      .then((res) => {
        console.log(res);
        getTotalBidValues();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserAddress = () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask");
      return;
    }
    try {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setCurrentAccount(accounts[0].toLowerCase());
        })
        .catch((err) => {
          // alert("Please connect to MetaMask");
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getBalance = async () => {
    if ((await checkNetwork()) === false || (await checkMetamask()) === false) {
      return;
    }
    const balance = await web3.eth.getBalance(currentAccount);
    const eth = web3.utils.fromWei(balance, "ether");
    setEthBalance(eth);
  };

  const updateOwners = async () => {
    if ((await checkNetwork()) === false || (await checkMetamask()) === false) {
      return;
    }
    try {
      const owner = await Lottery.methods.getOwners().call();
      const owners = owner.map((owner) => owner.toLowerCase());
      console.log(owners);
      setOwners(owners);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfUserIsAnOwner = () => {
    return owners.includes(currentAccount);
  };

  const handleWithdraw = () => {
    if (checkIfUserIsAnOwner()) {
      const withdraw = async () => {
        await Lottery.methods
          .withdraw()
          .send({ from: currentAccount })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      withdraw();
    } else {
      alert("You are not the owner of the contract");
    }
  };

  const handleDeclareWinner = () => {
    if (checkIfUserIsAnOwner()) {
      const declareWinner = async () => {
        await Lottery.methods
          .DeclareAllWinners()
          .send({ from: currentAccount })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      declareWinner();
    } else {
      alert("You are not the owner of the contract");
    }
  };

  const hideOwnerActions = () => {
    if (checkIfUserIsAnOwner()) {
      return "flex";
    } else {
      return "none";
    }
  };

  const checkNetwork = async () => {
    // const id = await web3.eth.net.getId();
    // if (id !== 11155111n) {
    //   alert('Please connect to the Sepolia network');
    //   return false;
    // }
    return true;
  };

  const checkMetamask = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask");
      return false;
    }
    return true;
  };

  const getTotalBidValues = async () => {
    if ((await checkNetwork()) == false || (await checkMetamask()) == false) {
      return;
    }
    try {
      const totalBids = await Lottery.methods.getAllItemBidNumber().call();
      const newBids = [
        parseInt([totalBids[0]]),
        parseInt([totalBids[1]]),
        parseInt([totalBids[2]]),
      ];
      setBids(newBids);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCheckWinner = () => {
    if (checkIfUserIsAnOwner() == false) {
      const checkWinner = async () => {
        await Lottery.methods
          .getItems()
          .call()
          .then((res) => {
            let lotteryDrawn = Boolean(true);
            const itemsWon = [];
            res.forEach((item, index) => {
              if (item.winner == 0x0000000000000000000000000000000000000000) {
                lotteryDrawn = Boolean(false);
              }
              if (item.winner.toLowerCase() === currentAccount) {
                itemsWon.push(index);
              }
            });
            if (lotteryDrawn === false) {
              alert(
                "The lottery is still open and the winners have not been drawn yet"
              );
            } else if (itemsWon.length === 0) {
              alert("You did not win anything (0)");
            } else {
              const stringItems = itemsWon.map((item) => {
                if (item === 0) {
                  return "Car(1)";
                } else if (item === 1) {
                  return "Phone(2)";
                } else {
                  return "Laptop(3)";
                }
              });
              alert("You won the following items: " + stringItems);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      checkWinner();
    } else {
      alert("the owner cannot participate in the lottery.");
    }
  };

  const LaptopSelection = () => {
    return (
      <div className="bid-button">
        <button onClick={bidLaptop}>Laptop</button>
        <div className="bid-value">{bids[2]}</div>
      </div>
    );
  };

  const CarSelection = () => {
    return (
      <div className="bid-button">
        <button onClick={bidCar}>Car</button>
        <div className="bid-value">{bids[0]}</div>
      </div>
    );
  };

  function PhoneSelection() {
    return (
      <div className="bid-button">
        <button onClick={bidPhone}>Phone</button>
        <div className="bid-value">{bids[1]}</div>
      </div>
    );
  }

  const ownersForDisplay = () => {
    return owners.map((owner) => owner + " ");
  };

  const transferOwnership = (e) => {
    e.preventDefault();
    if (checkIfUserIsAnOwner()) {
      const newOwner = e.target[0].value;
      const transfer = async () => {
        await Lottery.methods
          .transferOwnership(newOwner)
          .send({ from: currentAccount })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      transfer();
    } else {
      alert("You are not the owner of the contract");
    }
  };

  const AddOwner = (e) => {
    e.preventDefault();
    if (checkIfUserIsAnOwner()) {
      const newOwner = e.target[0].value;
      const addOwner = async () => {
        await Lottery.methods
          .addOwner(newOwner)
          .send({ from: currentAccount })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      addOwner();
    } else {
      alert("You are not the owner of the contract");
    }
  };

  const destroyContract = () => {
    if (checkIfUserIsAnOwner()) {
      const destroy = async () => {
        await Lottery.methods
          .selfDestruct()
          .send({ from: currentAccount })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      destroy();
    } else {
      alert("You are not the owner of the contract");
    }
  };

  const resetContract = () => {
    if (checkIfUserIsAnOwner()) {
      const reset = async () => {
        await Lottery.methods
          .reset()
          .send({ from: currentAccount })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      reset();
    } else {
      alert("You are not the owner of the contract");
    }
  };

  const getContractBalance = async () => {
    if ((await checkNetwork()) === false || (await checkMetamask()) === false) {
      return;
    }
    try {
      const balance = await web3.eth.getBalance(Lottery.options.address);
      const eth = web3.utils.fromWei(balance, "ether");
      setContractEthBalance(eth);
    } catch (err) {
      console.log(err);
    }
  };

  function load() {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask");
      return;
    }
    getUserAddress();
    // getContractOwner();
    getTotalBidValues();
    updateOwners();
    getContractBalance();
    window.ethereum.on("accountsChanged", function (accounts) {
      try {
        setCurrentAccount(accounts[0].toLowerCase());
      } catch (err) {
        console.log(err);
      }
    });
  }

  useEffect(load, []);

  useEffect(() => {
    if (currentAccount !== "0x000") {
      getBalance();
    }
  }, [currentAccount]);

  //every 5 seconds we update the bids
  useEffect(() => {
    const interval = setInterval(() => {
      getTotalBidValues();
      updateOwners();
      getContractBalance();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lottery-ballot">
      <h1>Lottery - Ballot</h1>
      <div className="selection">
        <CarSelection />
        <PhoneSelection />
        <LaptopSelection />
      </div>
      <div className="bid-details">
        <p>Current Account: {currentAccount}</p>
        <p>Balance eth: {ethBalance}</p>
        <p>Owner's Accounts: {ownersForDisplay()}</p>
        <p>Contract Balance eth: {contractEthBalance}</p>
      </div>
      <div className="actions">
        <button onClick={handleCheckWinner}>Am I the Winner?</button>
      </div>
      <div className="owner-actions" style={{ display: hideOwnerActions() }}>
        for owner only:
        <button onClick={handleWithdraw}>Withdraw</button>
        <button onClick={handleDeclareWinner}>Declare Winner</button>
        <button onClick={destroyContract}>Destroy Contract</button>
        <button onClick={resetContract}>Reset Contract</button>
        <form onSubmit={transferOwnership}>
          <input type="text" />
          <button>Transfer Ownership</button>
        </form>
        <form onSubmit={AddOwner}>
          <input type="text" />
          <button>Add Owner</button>
        </form>
      </div>
    </div>
  );
}

export default LotteryBallot;
