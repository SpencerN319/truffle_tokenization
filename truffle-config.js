require("dotenv").config({path: "./.env"});
const path = require("path");
const WalletProvider = require("@truffle/hdwallet-provider");
const Mnemonic = process.env.MNEMONIC;
const AccountIndex = 0;

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ganache: {
      provider: () => new WalletProvider(Mnemonic, "http://127.0.0.1:7545"),
      network_id: "5777"
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
