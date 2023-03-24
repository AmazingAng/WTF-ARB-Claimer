// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GetETHBlocknumber{
    function getETHBlocknumber() external view returns(uint){
        return block.number;
    }
}
