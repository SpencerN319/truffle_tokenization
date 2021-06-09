import React, {useEffect, useState} from 'react';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from './getWeb3';
import './App.css';

const App = () => {
  const [state, setState] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
  });

  useEffect(() => {
    async function setup() {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const contract = new web3.eth.Contract(SimpleStorageContract.abi, deployedNetwork && deployedNetwork.address);
        setState({...state, web3, accounts, contract});
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    }

    setup().catch( (error) => {
      alert('setup failure');
      console.log(error);
    });
  }, []);

  const runExample = async () => {
    const {accounts, contract, storageValue} = state;
    await contract.methods.set(5).send({from: accounts[0]});
    const response = await contract.methods.get().call();
    setState({...state, storageValue: storageValue + parseInt(response)});
  };

  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <button onClick={() => runExample()}>run example</button>
      <p>
                If your contracts compiled and migrated successfully, below will show
                a stored value of 5 (by default).
      </p>
      <p>
                Try changing the value stored on <strong>line 40</strong> of App.js.
      </p>
      <div>The stored value is: {state.storageValue}</div>
    </div>
  );
};

export default App;
