// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DirectAidProtocol is ERC20, Ownable {
    mapping(address => bool) public isMerchant;
    mapping(address => bool) public hasClaimed;
    
    event MerchantStatusUpdated(address indexed merchant, bool status);
    event AidClaimed(address indexed beneficiary, uint256 amount);

    constructor() ERC20("Crypto Food Voucher", "CFV") Ownable(msg.sender) {}

    // 1. 设置/取消 商家白名单
    function setMerchant(address _merchant, bool _status) external onlyOwner {
        isMerchant[_merchant] = _status;
        emit MerchantStatusUpdated(_merchant, _status);
    }

    // 2. 受助人领取粮票 (配合前端 World ID 验证成功后调用)
    function claimVoucher(address _beneficiary) external {
        require(!hasClaimed[_beneficiary], "Already claimed!");
        hasClaimed[_beneficiary] = true;
        _mint(_beneficiary, 100 * 10**decimals()); // 每次领取 100 粮票
        emit AidClaimed(_beneficiary, 100 * 10**decimals());
    }

    // 3. 核心限制：仅允许从“普通人”转给“白名单商家”
    function transfer(address to, uint256 value) public override returns (bool) {
        require(isMerchant[to] || msg.sender == owner(), "Vouchers can ONLY be transferred to verified merchants!");
        return super.transfer(to, value);
    }
}