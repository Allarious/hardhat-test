import { HardhatUserConfig, task, types } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers"

const config: HardhatUserConfig = {
  solidity: { 
    compilers: [
        {
          version: "0.8.9"
        },
        {
          version: "0.5.5"
        }
      ]
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address)
  }
})

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const balance = await hre.ethers.provider.getBalance(taskArgs.account);

    console.log(hre.ethers.utils.formatEther(balance), "ETH");
  });

// task("hello", "Prints a greeting'")
//   .addOptionalParam("greeting", "The greeting to print", "Hello, World!")
//   .setAction(async ({ greeting }) => console.log(greeting));

task("hello", "Prints hello mutiple times.")
  .addOptionalParam("times", "how many times hello is printed", 1, types.int)
  .setAction(async ({ times }) => {
    for(let i = 0; i < times; i++){
      console.log("Hello")
    }
  })


export default config;
