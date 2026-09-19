import { ethers } from "hardhat";


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const DirectAid = await ethers.getContractFactory("DirectAidProtocol");
  const directAid = await DirectAid.deploy();

  await directAid.waitForDeployment();

  const contractAddress = await directAid.getAddress();
  console.log("\n==================================================");
  console.log("DirectAidProtocol deployed to:", contractAddress);
  console.log("==================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});