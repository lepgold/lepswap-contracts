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

  const factory = (await deployments.get("UniswapV2Factory"));

  const pairHash = '0x15cdd3e983960c60461dfb32e5fdb58b215f4d9316afccd61cf2c00a4404059e';


    const barAddress = (await deployments.get("LepGold")).address;
    const bentoAddress = (await deployments.get("TreasureChestV1")).address;
    const sushiAddress = (await deployments.get("LepToken")).address;
  // }
  // else {
  //   throw Error("No Kashi here!!");
  // }

 

  await deploy("LepGoldBank", {
    from: deployer,
    args: [factory.address, barAddress, bentoAddress, sushiAddress, wethAddress, pairHash],
    log: true,
    deterministicDeployment: false,
  });

  const lepGoldBank = await ethers.getContract("LepGoldBank")
  if (await lepGoldBank.owner() !== dev) {
    // Transfer ownership of TreasureChestV1 to dev
    console.log("Transfer ownership of LepGoldBank to dev")
    await (await lepGoldBank.transferOwnership(dev, true, true)).wait()
  }



};




module.exports.tags = ["LepGoldBank"];
module.exports.dependencies = ["UniswapV2Factory", "Mocks", "LepToken", "TreasureChestV1", "LepGold"];