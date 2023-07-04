module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments

    const token = await deploy("Token", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 1,
    })
    log(
        "============================================================================================"
    )
}

module.exports.tags = ["all", "ethSwap"]
