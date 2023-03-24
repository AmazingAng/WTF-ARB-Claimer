// 签名脚本
import { ethers } from "ethers";
import {} from 'dotenv/config'

// ERC20Permit 合约地址
const tokenAddress = "0x912ce59144191c1204e64559fe8253a0e49e6548";

// 读取私钥数组
const privateKeys = process.env.PRIVATE_KEYS.split(",");
// 相应的 nonce 数组
const nonces = ["Nonce_Wallet_1", "Nonce_Wallet_2"]
  

// 授权接收者的地址
const spenderAddress = "Your_Spender_Addr";

// 授权数量
const value = ethers.constants.MaxUint256; 
console.log(value)
// 设置过期时间
const deadline = ethers.constants.MaxUint256;

async function signPermitMessage(wallet, nonce) {
  const domain = {
    name: "Arbitrum",
    version: "1",
    chainId: 42161, // Ethereum 主网的 Chain ID
    verifyingContract: tokenAddress,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const message = {
    owner: wallet.address,
    spender: spenderAddress,
    value: value.toString(),
    nonce: nonce,
    deadline: deadline,
  };

  const signature = await wallet._signTypedData(domain, types, message);

  return signature;
}

async function generatePermitSignatures() {
  const signatures = [];
  const vParams = [];
  const rParams = [];
  const sParams = [];
  
  for (let i = 0; i < privateKeys.length; i++) {
    const wallet = new ethers.Wallet(privateKeys[i]);
    const signature = await signPermitMessage(wallet, nonces[i]);
    const { v, r, s } = ethers.utils.splitSignature(signature);
    vParams.push(v);
    rParams.push(r);
    sParams.push(s);
    signatures.push({ signature, v, r, s });
  }
  return [signatures, vParams, rParams, sParams];
}

(async () => {
  const [signatures,vParams, rParams, sParams] = await generatePermitSignatures();
  console.log("Permit Signatures:", signatures);
})();
