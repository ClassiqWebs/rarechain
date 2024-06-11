// Import Web3 library
// const Web3 = require("web3");

// Initialize Web3 with provider (e.g., MetaMask)
let web3;

// Check if Web3 provider is available
if (window.ethereum) {
  console.log("Init web3");
  web3 = new Web3(window.ethereum);
}

// Function to connect MetaMask wallet
async function connectWallet() {
  try {
    // await window.ethereum.request({ method: "eth_requestAccounts" });

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    web3.eth.defaultAccount = accounts[0];
    console.log("Connected to wallet:", web3.eth.defaultAccount);
  } catch (error) {
    console.error("Error connecting to wallet:", error);
  }
}

// Function to disconnect MetaMask wallet
function disconnectWallet() {
  web3.eth.defaultAccount = null;
  console.log("Disconnected from wallet");
}

// ABI (Application Binary Interface) of the FundMe contract
const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contributor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Contribute",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    inputs: [],
    name: "USD_TO_WEI",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "categories",
    outputs: [
      {
        internalType: "uint256",
        name: "minDeposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxDeposit",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256",
      },
    ],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalContributions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256",
      },
    ],
    name: "usdToWei",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "weiAmount",
        type: "uint256",
      },
    ],
    name: "weiToUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Address of the deployed contract on the Polygon Mumbai Testnet
const address = "0xbf74d22c47fe13163a7d0ede1cda29849ac0b794";

// Instantiate contract object
const contract = new web3.eth.Contract(abi, address);

// Example function to contribute to the contract
async function contribute() {
  const category = document.getElementById("category").value;
  const amountInput = document.getElementById("contributeAmount").value;
  const usdAmount = parseInt(amountInput);
  const weiAmount = await contract.methods.usdToWei(usdAmount).call();
  await contract.methods
    .contribute(category, weiAmount)
    .send({ from: web3.eth.defaultAccount, value: weiAmount });
}

// Example function to withdraw from the contract (only accessible to the owner)
async function withdraw() {
  const amountInput = document.getElementById("withdrawAmount").value;
  const amount = parseInt(amountInput);
  await contract.methods
    .withdraw(amount)
    .send({ from: web3.eth.defaultAccount });
}

// Example function to get contract balance
async function getContractBalance() {
  const balance = await contract.methods.getContractBalance().call();
  console.log("Contract Balance:", balance);
}
