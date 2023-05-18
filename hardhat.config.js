require("@nomicfoundation/hardhat-toolbox");
// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY1 = "1Uzhe_TZ-uIivcCFQ-ApGaxCf-n22t1c";
const ALCHEMY_API_KEY2 = "_VZ-7fTl7a0HoFVpo9w_up-jCJEF-8HO";

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
// const SEPOLIA_PRIVATE_KEY ="48ad06bd2cd912b5db5f0a3bf5073bdd44a5e1da464da32cb912c4ad14f3cb18Y";

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY1}`,
      accounts: ["48ad06bd2cd912b5db5f0a3bf5073bdd44a5e1da464da32cb912c4ad14f3cb18",]
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY2}`,
      accounts: ["48ad06bd2cd912b5db5f0a3bf5073bdd44a5e1da464da32cb912c4ad14f3cb18",]
    },

  }
};