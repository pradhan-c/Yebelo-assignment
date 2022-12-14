//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSlabs {
    enum SlabNames {
        slab0,
        slab1,
        slab2,
        slab3,
        slab4
    }
    
    mapping(SlabNames => uint256) public slabValues;
    mapping(address => SlabNames) public tokenCurrentSlab;

    constructor(uint256[] memory _slabValues) {
        require(_slabValues.length == 5, "TokenSlabs/constructor: Contract");
        for (uint256 i = 0; i < _slabValues.length; ) {
            slabValues[SlabNames(i)] = _slabValues[i];
            unchecked {
                ++i;
            }
        }
    }

    function _changeSlab(address _erc20token) private {
        uint256 currentBalance = IERC20(_erc20token).balanceOf(address(this));
           if (currentBalance<=500 ){
             tokenCurrentSlab[_erc20token] = SlabNames(4);
        }
        else if (currentBalance > 500 && currentBalance <= 900){
            tokenCurrentSlab[_erc20token] = SlabNames(3);
        }
        else if (currentBalance > 900 && currentBalance <= 1200){
            tokenCurrentSlab[_erc20token] = SlabNames(2);
        }
        else if (currentBalance > 1200 && currentBalance <= 1400){
           tokenCurrentSlab[_erc20token] = SlabNames(1);
        }
        else if (currentBalance > 1400 && currentBalance <= 1500){
            tokenCurrentSlab[_erc20token] = SlabNames(0);
        }
    }

    function deposit(address _erc20token, uint256 value) public {
        IERC20 ERC20Contract = IERC20(_erc20token);
        require(
            ERC20Contract.allowance(msg.sender, address(this)) > value,
            "TokenSlabs/deposit/[ERC20]allowance: Not enough allowance, approve before spending"
        );
        ERC20Contract.transferFrom(msg.sender, address(this), value);
        _changeSlab(_erc20token);
    }
}