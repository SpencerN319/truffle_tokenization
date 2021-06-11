import React, {useEffect, useState} from 'react';
import MyToken from '../contracts/MyToken.json';
import MyTokenSale from '../contracts/MyTokenSale.json';
import Kyc from '../contracts/Kyc.json';
import getWeb3 from '../components/getWeb3';
import './App.css';

const App = () => {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    tokens: 0,
    myTokenContract: null,
    myTokenSaleContract: null,
    kycContract: null,
  });

  useEffect(() => {
    async function setup() {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const myTokenContract = new web3.eth.Contract(
            MyToken.abi,
            MyToken.networks[networkId] && MyToken.networks[networkId].address);
        const myTokenSaleContract = new web3.eth.Contract(
            MyTokenSale.abi,
            MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address);
        const kycContract = new web3.eth.Contract(Kyc.abi,
            Kyc.networks[networkId] && Kyc.networks[networkId].address);
        const tokens = await myTokenContract.methods.totalSupply().call();
        setState({
          ...state,
          web3,
          accounts,
          tokens,
          myTokenContract,
          myTokenSaleContract,
          kycContract,
        });
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

  const handleWhitelisting = async (event) => {
    const {address} = event.target;
    await state.kycContract.methods.setKycCompleted(address.value).send({from: state.accounts[0]});
    alert(`KYC for ${address.value} is completed`);
  };

  const handleIsWhitelisted = async (event) => {
    event.preventDefault();
    const {addr} = event.target;
    const response = await state.kycContract.methods.kycCompleted(addr.value).call()
        .catch((error) => {
          alert(error);
          return false;
        });
    if (response === true) {
      alert('Account is whitelisted.');
    } else {
      alert('Account is not whitelisted.');
    }
  };

  return (
    <div className="App">
      <header className="Heading">Total supply of tokens: {state.tokens}</header>
      <div className="Divider"/>
      <form className="Form" onSubmit={ (e) => handleWhitelisting(e) }>
        <header>White List Account</header>
        <input className="FormItem" type="text" name="address" placeholder="Address"/>
        <button className="FormItem" type="submit">Submit</button>
      </form>
      <div className="Divider"/>
      <div>
        <header>Check Whitelisting</header>
        <form className="Form" onSubmit={ (e) => handleIsWhitelisted(e) }>
          <input className="FormItem" type="text" name="addr" placeholder="Address"/>
          <button className="FormItem" type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default App;
