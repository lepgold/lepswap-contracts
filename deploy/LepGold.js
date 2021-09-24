module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const sushi = await deployments.get("LepToken")

  await deploy("LepGold", {
    from: deployer,
    args: [sushi.address],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["LepGold"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "LepToken"]
