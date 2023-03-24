# Arb-Claimer


抢先领取 Arb 的合约和脚本，用这套代码从黑客手里抢了 30,000+ $ARB。核心代码均已开源，主要是 Solidity 智能合约和 Ethers.js 脚本，你可以在 [WTF Solidity](https://github.com/AmazingAng/WTF-Solidity) 和 [WTF Ethers](https://github.com/WTFAcademy/WTF-Ethers) 教程中学习它们。

## Arbi 抢空投要点


1. 节点：必须要自己搭 Arbitrum 全节点，用公开的rpc会卡，限制请求次数/速度。节点大概需要 1.4 T硬盘，推荐用 SSD（读写多）。

2. [批量转 ETH + claim 脚本](./scripts/claimAirdropSend.js)

3. [批量归集合约](./contracts/PermitTokenCollector.sol)，需要理解 ERC20Permit 和 EIP712 签名。

4. 脚本[批量生成 permit 签名](./scripts/permitSig.js)，并调用批量归集合约（自己实现吧）

## 帮私钥泄露的粉丝从黑客手中抢到的ARB
![WechatIMG405](https://user-images.githubusercontent.com/14728591/227466073-9dafa56a-8d17-4101-9f1a-e7bd2e980b6e.jpeg)
