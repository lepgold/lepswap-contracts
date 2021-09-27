const UNISWAP_FACTORY = new Map()
UNISWAP_FACTORY.set("56", "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73")
UNISWAP_FACTORY.set("3", "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73")


module.exports = async function ({ getNamedAccounts, getChainId, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  if (UNISWAP_FACTORY.has(chainId)) {
    //  throw Error("No Uniswap Router")


    const uniswapRouterAddress = UNISWAP_FACTORY.get(chainId)

    const sushiswapRouterAddress = (await deployments.get("UniswapV2Factory")).address

    const chefAddress = (await deployments.get("MasterLep")).address


    await deploy("Migrator", {
      from: deployer,
      args: [chefAddress, uniswapRouterAddress, sushiswapRouterAddress, 11408853],
      log: true,
      deterministicDeployment: false
    })
  }
}

module.exports.tags = ["Migrator"]
module.exports.dependencies = ["UniswapV2Factory", "MasterLep"]
