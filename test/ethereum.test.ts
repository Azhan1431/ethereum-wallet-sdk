const bip39 = require("bip39");
const ethers = require('ethers');


describe('ethereum wallet test', () => {
    test('mpc public key to address', () => {
        const pubKeyPoint = [
            2, 211, 154, 205, 237, 94, 172, 44, 10, 252, 232, 165, 187, 22, 53, 235, 218, 108, 26, 42, 122, 130, 38, 45, 110, 233, 154, 55, 141, 135, 170, 96, 220
        ];
        const address = ethers.utils.computeAddress("0x" + Buffer.from(pubKeyPoint).toString("hex"));
        console.log("wallet address:", address);
        
        // 添加断言来验证地址格式
        expect(address).toMatch(/^0x[0-9A-Fa-f]{40}$/);
        // 可选：如果你知道期望的地址，可以直接比较
        // expect(address).toBe('0x预期的地址');
    });
});