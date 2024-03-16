const hre = require("hardhat");

async function main() {
  //STACKING
  const tokenStaking = await hre.ethers.deployContract("TokenStaking");

  await tokenStaking.waitForDeployment();

  console.log(` STACKING: ${tokenStaking.target}`);
  //TOKEN
  const rarechain = await hre.ethers.deployContract("Rarechain");

  await rarechain.waitForDeployment();

  console.log(` Rarechain: ${rarechain.target}`);
  console.log(` Token: ${tokenStaking.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
