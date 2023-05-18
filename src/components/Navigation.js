import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav>
            <div className='nav__brand'>
                <h1>ChronoDapp</h1>
            </div>
            <input type="text" className='nav__search' />
            {account ? (
                 <button type='button' className='nav__connect'>
                 {account.slice(0,5) + '...' + account.slice(38,42)}
                </button>
            ) : (
                <button type='button' className='nav__connect' onClick={connectHandler}>
                    Connect
                </button>
            )}

           

            <ul className='nav__links'>
                <li><a href='#AP'>Audemars Piguet</a></li>
                <li><a href='#Patek'>Patek Philippe</a></li>
                <li><a href='#RM'>Richard Mille</a></li>
            </ul>



        </nav>
    );
}

export default Navigation;