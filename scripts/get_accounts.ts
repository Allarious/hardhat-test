import hre from 'hardhat';

async function getAccounts() {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
}

getAccounts().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})