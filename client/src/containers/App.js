import React, {useEffect, useState} from 'react';
import MyToken from '../contracts/MyToken.json';
import MyTokenSale from '../contracts/MyTokenSale.json';
import Kyc from '../contracts/Kyc.json';
import getWeb3 from '../components/getWeb3';
import './App.css';

const App = () => {
  const [state, setState] = useState({
    web3: null,
    account: null,
    tokens: 0,
    myTokenContract: null,
    myTokenSaleContract: null,
    myTokenSaleAddress: '',
    kycContract: null,
    userBalance: 0,
  });

  useEffect(() => {
    async function setup() {
      try {
        const web3 = await getWeb3();
        const [account] = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const myTokenContract = new web3.eth.Contract(
            MyToken.abi,
            MyToken.networks[networkId] && MyToken.networks[networkId].address);
        const myTokenSaleAddress = MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address;
        const myTokenSaleContract = new web3.eth.Contract(MyTokenSale.abi, myTokenSaleAddress);
        const kycContract = new web3.eth.Contract(Kyc.abi,
            Kyc.networks[networkId] && Kyc.networks[networkId].address);
        const tokens = await myTokenContract.methods.totalSupply().call();
        const userBalance = await myTokenContract.methods.balanceOf(account).call();
        setState({
          ...state,
          web3,
          account,
          tokens,
          myTokenContract,
          myTokenSaleContract,
          myTokenSaleAddress,
          kycContract,
          userBalance,
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
    await state.kycContract.methods.setKycCompleted(address.value).send({from: state.account});
    alert(`KYC for ${address.value} is completed`);
  };

  const handleIsWhitelisted = async (event) => {
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

  const handleFetchUserBalance = async () => {
    const userBalance = await state.myTokenContract.methods.balanceOf(state.account).call();
    setState({...state, userBalance});
  };

  const handleTokenPurchase = async (event) => {
    const {amount} = event.target;
    await state.myTokenSaleContract.methods.buyTokens(state.account).send({
      from: state.account,
      value: amount.value})
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
  };

  return (
    <div className="App">
      <header className="Heading">Total supply of tokens: {state.tokens}</header>
      <div className="divider"/>
      <div className="Form">
        <h1 className="FormItem" >You have a balance of: {state.userBalance} tokens</h1>
        <button className="FormItem" onClick={ () => handleFetchUserBalance() } >Update</button>
      </div>
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
      <div className="Divider"/>
      <div>
        <header>Purchase tokens</header>
        <form className="Form" onSubmit={ (e) => handleTokenPurchase(e) }>
          <input className="FormItem" type="number" name="amount" placeholder="Amount"/>
          <button className="FormItem" type="submit">Purchase</button>
        </form>
      </div>
    </div>
  );
};

export default App;
