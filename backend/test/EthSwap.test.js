const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { default: Web3 } = require("web3")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("EthSwap Testing", async () => {
          let deployer, token, ethSwap, player
          beforeEach(async () => {
              const accounts = await ethers.getSigners()

              deployer = accounts[0]
              player = accounts[1]

              await deployments.fixture(["all"])
              token = await ethers.getContract("Token", deployer)
              ethSwap = await ethers.getContract("EthSwap", deployer)

              await token.transfer(ethSwap.address, "1000000000000000000000000") // *** 1M tokens ***
          })

          describe("Testing...", () => {
              it("It has a name", async () => {
                  const name = await ethSwap.getName()
                  assert.equal(name, "AP_Swap")
              })

              it("It has balance", async () => {
                  const balance = await token.balanceOf(ethSwap.address)
                  assert.equal(balance.toString(), "1000000000000000000000000")
              })
          })

          //   ***issue***
          describe("buyToken testing", () => {
              //   it("Allows user to purchase token from APSwap", async () => {
              //       await ethSwap.buyToken({ value: "1000000000000000000" })
              //       //   let buyerBalance_i = await token.balanceOf(deployer)
              //       //   assert.equal(buyerBalance_i.toString(), "100")

              //       let ethSwapBalance = await token.balanceOf(ethSwap.address)
              //       assert.equal(ethSwapBalance.toString(), "999900")

              //       ethSwapBalance = await address(ethSwap).balance
              //   })

              it("emits an event after token is purchased", async () => {
                  await expect(ethSwap.buyToken({ value: "1000000000000000000" })).to.emit(
                      ethSwap,
                      "TokenPurchased"
                  )
              })

              it("it reversts if amount purchased is more than contract balance", async () => {
                  await expect(
                      ethSwap.buyToken({ value: "1000000000000000000" }) // *** tag
                  ).to.be.revertedWith("EthSwap__NotEnoughtTokens")
              })
              //9999997286273574580891
              //1000000000000000000000000
          })

          describe("SellToken testing...", () => {
              it("Allow user to sell tokens to ethSwap for a fixed prize", async () => {
                  await token.approve(ethSwap.address, "1000000000000000000", { from: player })
                  ethSwap.sellToken("1000000000000000000", { from: player })

                  let playerBalance = await token.balanceOf(player)
                  assert.equal(playerBalance.toString(), "0000000000000000000")

                  let ethSwapBalance = await token.balanceOf(ethSwap.address)
                  assert.equal(ethSwapBalance.toString(), "1000000000000000000000000")

                  ethSwapBalance = await ethers.getBalance(ethSwap.address)
                  assert.equal(ethSwapBalance.toString(), "0000000000000000000")
              })

              it("emits an event after token is sold", async () => {
                  await expect(
                      ethSwap.sellToken("1000000000000000000").to.emit(ethSwap, "TokenSold")
                  )
              })

              it("reverts if ethAmount >= contract balance", async () => {
                  await expect(ethSwap.sellToken("100000000000000000000")).to.be.revertedWith(
                      "EthSwap__NotEnoughtBalance"
                  )
              })
          })

          describe("Testing Token", () => {
              it("It has a name", async () => {
                  const name = await token.name()
                  assert.equal(name, "AP Token")
              })

              it("It has a Symbol", async () => {
                  const symbol = await token.symbol()
                  assert.equal(symbol, "APT")
              })
          })
      })
