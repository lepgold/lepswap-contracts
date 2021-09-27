module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const sushi = await ethers.getContract("LepToken")
  
  const { address } = await deploy("MasterLep", {
    from: deployer,
    args: [sushi.address, dev, "20000000000000000000", "11408853", "12013653"],
    log: true,
    deterministicDeployment: false
  })

  if (await sushi.owner() !== address) {
    // Transfer Sushi Ownership to Chef
    console.log("Transfer Sushi Ownership to Chef")
    await (await sushi.transferOwnership(address)).wait()
  }

  const masterChef = await ethers.getContract("MasterLep")
  if (await masterChef.owner() !== dev) {
    // Transfer ownership of MasterLep to dev
    console.log("Transfer ownership of MasterLep to dev")
    await (await masterChef.transferOwnership(dev)).wait()
  }
}

module.exports.tags = ["MasterLep"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "LepToken"]
