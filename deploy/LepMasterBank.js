const { WETH } = require("@sushiswap/sdk");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;

  const { deployer, dev } = await getNamedAccounts();

  const chainId = await getChainId();

 
    const bentoAddress = (await deployments.get("TreasureChestV1")).address;
  // }
  // else {
  //   throw Error("No Kashi here!!");
  // }

 

  await deploy("LepPairMediumRiskV1", {
    from: deployer,
    args: [bentoAddress],
    log: true,
    deterministicDeployment: false,
  });

  const lepPairMediumRiskV1 = await ethers.getContract("LepPairMediumRiskV1")
  if (await lepPairMediumRiskV1.owner() !== dev) {
    // Transfer ownership of TreasureChestV1 to dev
    console.log("Transfer ownership of lepPairMediumRiskV1 to dev")
    await (await lepPairMediumRiskV1.transferOwnership(dev, true, true)).wait()
  }



};




module.exports.tags = ["LepMasterBank"];
module.exports.dependencies = ["TreasureChestV1"];