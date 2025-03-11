const bip39 = require("bip39");
const ethers = require('ethers');
import {
    createEthAddress,
    ethSign,
    importEthAddress,
    publicKeyToAddress,
    signOpMainnetTransaction,
    numberToHex
} from "../src/index";

describe('ethereum wallet test', () => {
    // 测试从公钥计算地址
    test('mpc public key to address', () => {
        const pubKeyPoint = [
            2, 211, 154, 205, 237, 94, 172, 44, 10, 252, 232, 165, 187, 22, 53, 235, 218, 108, 26, 42, 122, 130, 38, 45, 110, 233, 154, 55, 141, 135, 170, 96, 220
        ];
        const address = ethers.utils.computeAddress("0x" + Buffer.from(pubKeyPoint).toString("hex"));
        console.log("wallet address:", address);
        // 添加断言确认地址格式正确
        expect(address).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });

    // 测试 publicKeyToAddress 函数
    test('publicKeyToAddress', () => {
        const pubKey = "0x02d39acdee5eac2c0afce8a5bb1635ebda6c1a2a7a82262d6ee99a378d87aa60dc";
        const address = publicKeyToAddress(pubKey);
        console.log("address from public key:", address);
        expect(address).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });

    // 测试从种子创建地址
    test('createAddress', () => {
        const mnemonic = "champion junior low analyst plug jump entire barrel slight swim hidden remove";
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const accountJson = createEthAddress(seed.toString("hex"), "0");
        const account = JSON.parse(accountJson);
        console.log("created account:", account);
        
        // 断言检查返回的地址格式
        expect(account.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
        // 确认私钥和公钥也存在
        expect(account.privateKey).toBeTruthy();
        expect(account.publicKey).toBeTruthy();
    });

    // 测试导入私钥
    test('importAddress', () => {
        const privateKey = "1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727";
        const walletJson = importEthAddress(privateKey);
        const wallet = JSON.parse(walletJson);
        console.log("imported wallet:", wallet);
        
        expect(wallet.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
        expect(wallet.privateKey).toEqual(privateKey);
    });

    // 测试数值转16进制
    test('numberToHex', () => {
        expect(numberToHex(255)).toBe("0xff");
        expect(numberToHex("1000000000000000000")).toBe("0xde0b6b3a7640000");
    });

    // 测试EIP-1559交易签名
    // 方法1: 修改测试，删除from参数，让钱包自动派生地址
    test('sign EIP1559 transaction', async () => {
        const params = {
            privateKey: "1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727",
            nonce: 0,
            // 删除 from 参数
            to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
            gasLimit: 21000,
            amount: "0.01",
            decimal: 18,
            chainId: 1,
            maxFeePerGas: "30000000000",
            maxPriorityFeePerGas: "1500000000"
        };
    
        const signedTx = await signOpMainnetTransaction(params);
        console.log("signed EIP1559 tx:", signedTx);
        expect(signedTx).toMatch(/^0x/);
    });

    // 测试标准ETH交易签名
    test('sign standard ETH transaction', () => {
        const params = {
            privateKey: "1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727",
            nonce: 0,
            from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
            gasLimit: 21000,
            gasPrice: "20000000000",
            amount: "0.01",
            decimal: 18,
            chainId: 1
        };
        
        const signedTx = ethSign(params);
        console.log("signed standard tx:", signedTx);
        expect(signedTx).toMatch(/^0x/);
        expect(signedTx.length).toBeGreaterThan(2);
    });

    // 测试ERC20代币交易签名
    test('sign ERC20 token transaction', async () => {
        const params = {
            privateKey: "1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727",
            nonce: 1,
            //from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
            gasLimit: 100000,
            gasPrice: "20000000000",
            amount: "10",
            decimal: 18,
            chainId: 1,
            tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            tokenId: "0x00"
        };
        
        const signedTx = await signOpMainnetTransaction(params);
        console.log("signed ERC20 tx:", signedTx);
        expect(signedTx).toMatch(/^0x/);
    });

    // 测试NFT交易签名
    test('sign NFT transaction', async () => {
        const params = {
            privateKey: "1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727",
            nonce: 2,
            //from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
            gasLimit: 150000,
            gasPrice: "25000000000",
            amount: "0",
            decimal: 18,
            chainId: 1,
            tokenAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
            tokenId: "123"
        };
        
        const signedTx = await signOpMainnetTransaction(params);
        console.log("signed NFT tx:", signedTx);
        expect(signedTx).toMatch(/^0x/);
    });
});