import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);
  const [AP, setAP] = useState(null);
  const [patek, setPatek] = useState(null);
  const [RM, setRM] = useState(null);

  const[item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  }
  
  const loadBlockchainData = async() =>{
    //Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log(network);

    //Connect to smart contracts (make JS versions)
      const dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon, provider)
      setDappazon(dappazon);

    //Load products
    const items = []

    for( let i=0 ; i < 9 ; i++)
    {
      const item = await dappazon.items(i+1);
      items.push(item)
      console.log(item)
    }

      const AP = items.filter((item) => item.category === 'Audemars Piguet');
      const patek = items.filter((item) => item.category === 'Patek Philippe');
      const RM = items.filter((item) => item.category === 'Richard Mille');

      setAP(AP);
      setPatek(patek);
      setRM(RM);

  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

    
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>MarketPlace</h2>
    
      {AP && patek && RM ? (
        <>
          <Section title={"Audemars Piguet"} items={AP} togglePop= {togglePop} />
          <Section title={"Patek Philippe"} items={patek} togglePop= {togglePop} />
          <Section title={"Richard Mille"} items={RM} togglePop= {togglePop} />
        </>
       ) : (
        <>
       <h4>Loading...</h4>
       <h4>Connect Wallet and Select network Sepolia/Goerli !</h4>
       </>
      )}


      {toggle && (
        <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;
