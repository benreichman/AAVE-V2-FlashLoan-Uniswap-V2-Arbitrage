const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const pk = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    kovan: {
      provider: () => new HDWalletProvider(pk, `https://kovan.infura.io/v3/<YOUR_KEY_GOES_HERE>`),
      network_id: 42,       // Ropsten's id      // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false     // Skip dry run before migrations? (default: false for public nets )
    },
    main: {
      provider: () => new HDWalletProvider(pk, `https://mainnet.infura.io/v3/<YOUR_KEY_GOES_HERE>`),
      network_id: 1,       // Ropsten's id      // Ropsten has a lower block limit than mainnet
      confirmations: 3,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false     // Skip dry run before migrations? (default: false for public nets )
    },
  },

 
  mocha: {
  },

  compilers: {
    solc: {
      version: "0.6.12",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },

};
