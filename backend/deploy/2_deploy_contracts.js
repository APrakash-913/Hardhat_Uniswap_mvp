const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments

    let token = await ethers.getContract("Token")

    const ethSwap = await deploy("EthSwap", {
        from: deployer,
        log: true,
        args: [token.address],
        waitConfirmations: 1,
    })
    log(
        "============================================================================================"
    )
}

module.exports.tags = ["all", "ethSwap"]
