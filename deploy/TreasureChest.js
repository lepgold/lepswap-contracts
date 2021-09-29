const { WETH } = require("@sushiswap/sdk");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;

  const { deployer, dev } = await getNamedAccounts();

  const chainId = await getChainId();

  let wethAddress;

  if (chainId === "31337") {
    wethAddress = (await deployments.get("WETH9Mock")).address;
  } else if (chainId in WETH) {
    wethAddress = WETH[chainId].address;
  } else {
    throw Error("No WNATIVE!");
  }

  const factoryAddress = (await deployments.get("UniswapV2Factory")).address;

  await deploy("TreasureChestV1", {
    from: deployer,
    args: [wethAddress],
    log: true,
    deterministicDeployment: false,
  });

  const treasureChest = await ethers.getContract("TreasureChestV1")
  if (await treasureChest.owner() !== dev) {
    // Transfer ownership of TreasureChestV1 to dev
    console.log("Transfer ownership of TreasureChestV1 to dev")
    await (await treasureChest.transferOwnership(dev, true, true)).wait()
  }



};




module.exports.tags = ["TreasureChestV1", "BentoBox"];
module.exports.dependencies = ["UniswapV2Factory", "Mocks"];