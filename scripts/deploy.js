const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {

  const bankAccountContract = await hre.ethers.deployContract("BankAccount", []);

  await bankAccountContract.waitForDeployment();

  console.log("BankAccount Contract Address:", bankAccountContract.target);


  await sleep(30 * 1000); 
  
  await hre.run("verify:verify", {
    address: bankAccountContract.target,
    constructorArguments: [],
  });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });