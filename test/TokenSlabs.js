const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers')
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect } = require('chai')
const { ethers } = require('hardhat')
const { Contract, ContractFactory, Signer } = require('ethers')

describe('TokenSlabs', function () {
  async function init() {
    const SLABVALUES = [100, 200, 300, 400, 500]
    const [owner, otherAccount] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory('TokenSlabs')
    const TokenSlabs = await contractFactory.deploy(SLABVALUES)
    const contractFactory2 = await ethers.getContractFactory('TestERC20')
    const TestERC20 = await contractFactory2.deploy()
    await TestERC20.mint(await owner.getAddress(), 1000)
    return [owner, otherAccount]
  }

  describe('Tests', function () {
    it('Deploys all relevant contracts', async function () {
      const [owner, otherAccount] = await loadFixture(init)
    })

    it('Checks if ERC20 is minted', async () => {
      const SLABVALUES = [100, 200, 300, 400, 500]
      const [owner, otherAccount] = await ethers.getSigners()
      const contractFactory = await ethers.getContractFactory('TokenSlabs')
      const TokenSlabs = await contractFactory.deploy(SLABVALUES)
      const contractFactory2 = await ethers.getContractFactory('TestERC20')
      const TestERC20 = await contractFactory2.deploy()
      await TestERC20.mint(await owner.getAddress(), 1000)

      expect(await TestERC20.balanceOf(await owner.getAddress())).to.be.equal(
        1000,
      )
    })

    it('Checks Current Slab', async () => {
      const SLABVALUES = [100, 200, 300, 400, 500]
      const [owner, otherAccount] = await ethers.getSigners()
      const contractFactory = await ethers.getContractFactory('TokenSlabs')
      const TokenSlabs = await contractFactory.deploy(SLABVALUES)
      const contractFactory2 = await ethers.getContractFactory('TestERC20')
      const TestERC20 = await contractFactory2.deploy()
      await TestERC20.mint(await owner.getAddress(), 1000)
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(
        0,
      )
    })

    it('Makes deposit to verify slab change', async () => {
      const SLABVALUES = [100, 200, 300, 400, 500]
      const [owner, otherAccount] = await ethers.getSigners()
      const contractFactory = await ethers.getContractFactory('TokenSlabs')
      const TokenSlabs = await contractFactory.deploy(SLABVALUES)
      const contractFactory2 = await ethers.getContractFactory('TestERC20')
      const TestERC20 = await contractFactory2.deploy()
      await TestERC20.mint(await owner.getAddress(), 1000)
      await TestERC20.approve(TokenSlabs.address, 1000)

      await TokenSlabs.deposit(TestERC20.address, 99)
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(
        4,
      )

      await TokenSlabs.deposit(TestERC20.address, 499)
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(
        3,
      )
    })
  })
})
