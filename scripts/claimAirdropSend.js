import { ethers } from "ethers";
import {} from 'dotenv/config'

// 配置提供者
const provider = new ethers.providers.JsonRpcProvider("Your_RPC_URL");

// 从 .env 文件中读取主钱包和批量钱包的私钥
const mainWalletPrivateKey = process.env.MAIN_WALLET_PRIVATE_KEY;
const batchWalletsPrivateKeys = process.env.PRIVATE_KEYS.split(",");

// 配置空投合约和 ERC20 代币合约的地址和 ABI
const airdropContractAddress = "0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9";
const erc20TokenContractAddress = "0x912CE59144191C1204E64559FE8253a0e49E6548";
const getETHBlocknumberAddress = "0xE8d4cA5e9713c595Ec1975FC955923DF1439CD8a";

const getETHBlocknumberABI= [
    "function getETHBlocknumber() external view returns(uint)"
]
const airdropContractABI = [
    "function claim() public",
];

const erc20TokenContractABI = [
    "function balanceOf(address) view returns (uint)",
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// 目标区块高度
const targetBlockNumber = 16890400;

// 用于转账的金额（根据需要自行调整）
const transferAmount = ethers.utils.parseEther("0.005");

// 主钱包实例
const mainWallet = new ethers.Wallet(mainWalletPrivateKey, provider);

async function waitForBlockAndClaimAirdropAndSendTokens() {
    const airdropContract = new ethers.Contract(
        getETHBlocknumberAddress,
        getETHBlocknumberABI,
        provider
      );

  while (true) {
    const currentBlockNumber = await airdropContract.getETHBlocknumber();
    console.log("Current block number:", currentBlockNumber.toString());

    if (currentBlockNumber >= targetBlockNumber) {
      const tasks = batchWalletsPrivateKeys.map(async (privateKey) => {
        const batchWallet = new ethers.Wallet(privateKey, provider);
        const airdropContract = new ethers.Contract(
          airdropContractAddress,
          airdropContractABI,
          batchWallet
        );
        const erc20TokenContract = new ethers.Contract(
          erc20TokenContractAddress,
          erc20TokenContractABI,
          batchWallet
        );
    
        // 1. 从主钱包发送 0.001 ETH 到目标钱包
        const tx = {
          to: batchWallet.address,
          value: transferAmount,
        };
        try {
          const txResponse = await mainWallet.sendTransaction(tx);
          console.log("Transaction hash:", txResponse.hash);
        } catch (error) {
          console.error(`Error sending transaction to ${batchWallet.address}:`, error.message);
        }
    
        // 2. 目标钱包调用空投合约的 claim() 函数领取空投
        try {
          const claimTxResponse = await airdropContract.claim();
          console.log("Claim transaction hash:", claimTxResponse.hash);
        } catch (error) {
          console.error(`Error claiming airdrop for wallet ${batchWallet.address}:`, error.message);
        }
    
        // 3. 将空投的 ERC20 代币发送给主钱包
        try {
          const balance = await erc20TokenContract.balanceOf(batchWallet.address);
          const transferTxResponse = await erc20TokenContract.transfer(mainWallet.address, balance);
          console.log("Transfer transaction hash:", transferTxResponse.hash);
        } catch (error) {
          console.error(`Error transferring tokens to main wallet from ${batchWallet.address}:`, error.message);
        }
      });
    
      // 等待所有任务完成
      await Promise.all(tasks);
      console.log("All tasks have been processed.");
    
      // 任务完成，退出循环
      break;
    } else {
      // 等待 0.1 秒后继续检查区块高度
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

waitForBlockAndClaimAirdropAndSendTokens();


