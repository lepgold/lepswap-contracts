const { WETH } = require("@sushiswap/sdk")

module.exports = async function ({ ethers: { getNamedSigner }, getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  const factory = await ethers.getContract("UniswapV2Factory")
  const bar = await ethers.getContract("LepGold")
  const sushi = await ethers.getContract("LepToken")
  
  let wethAddress;
  
  if (chainId === '31337') {
    wethAddress = (await deployments.get("WETH9Mock")).address
  } else if (chainId in WETH) {
    wethAddress = WETH[chainId].address
  } else {
    throw Error("No WETH!")
  }

  await deploy("GoldMakingLep", {
    from: deployer,
    args: [factory.address, bar.address, sushi.address, wethAddress],
    log: true,
    deterministicDeployment: false
  })

  const maker = await ethers.getContract("GoldMakingLep")
  if (await maker.owner() !== dev) {
    console.log("Setting maker owner")
    await (await maker.transferOwnership(dev, true, false)).wait()
  }
}

module.exports.tags = ["GoldMakingLep"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "LepGold", "LepToken"]