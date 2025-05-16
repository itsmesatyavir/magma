const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.bold.greenBright('=============================='));
console.log(chalk.bold.cyanBright('          FORESTARMY'));
console.log(chalk.bold.whiteBright('Author        - ') + chalk.bold.yellowBright('Itsmesatyavir'));
console.log(chalk.bold.whiteBright('Shared By     - ') + chalk.bold.yellowBright('t.me/airdropscriptfa'));
console.log(chalk.bold.whiteBright('Maintained By - ') + chalk.bold.yellowBright('t.me/forestarmy'));
console.log(chalk.bold.greenBright('==============================\n'));

const RPC_URL = 'https://testnet-rpc.monad.xyz';
const CONTRACT_ADDRESS = '0x2c9C959516e9AAEdB2C748224a41249202ca8BE7';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const STAKE_SELECTOR = '0xd5575982';

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const logFile = path.join(__dirname, 'stake_log.json');

// Load log or create empty
let logData = {};
if (fs.existsSync(logFile)) {
  logData = JSON.parse(fs.readFileSync(logFile));
}

function saveLog() {
  fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10); // e.g., '2025-05-16'
}

function getTimeLeftUntilNextStake() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msLeft = tomorrow - now;
  const hours = Math.floor(msLeft / (1000 * 60 * 60));
  const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

async function stakeMonad() {
  const today = getTodayDate();
  if (!logData[today]) logData[today] = [];

  if (logData[today].length >= 2) {
    console.log(chalk.red(`[!] You have already staked 2 times today. Try again in ${getTimeLeftUntilNextStake()}.`));
    return;
  }

  try {
    const stakeAmount = ethers.utils.parseEther('0.2');
    const gasPrice = await provider.getGasPrice();
    const nonce = await provider.getTransactionCount(wallet.address, 'pending');

    const stakeTx = {
      to: CONTRACT_ADDRESS,
      data: STAKE_SELECTOR,
      value: stakeAmount,
      gasLimit: 800000,
      gasPrice,
      nonce
    };

    const txResponse = await wallet.sendTransaction(stakeTx);
    const timeStamp = new Date().toLocaleString();
    console.log(`[${timeStamp}] [TX] Stake hash:`, txResponse.hash);
    await txResponse.wait();
    console.log(`[${timeStamp}] [✓] Successfully staked 0.2 Monad.`);

    logData[today].push({ time: timeStamp, tx: txResponse.hash });
    saveLog();
  } catch (err) {
    console.error(`[x] Staking failed:`, err.message);
  }
}

// Run instantly on start
stakeMonad();

// Optional: Setup cron to check every 12 hours
const cron = require('node-cron');
cron.schedule('0 */12 * * *', () => stakeMonad());

console.log("[!] Scheduler active. Staking will be attempted every 12 hours (based on system time).");
