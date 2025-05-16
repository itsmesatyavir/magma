# Monad Staking Scheduler

A simple Node.js script that automatically stakes 0.2 Monad to a smart contract on the Monad Testnet twice daily using a CRON scheduler.

---

## Features

- [✓] Auto-stakes every day at **15:00** and **22:00 WIB** (Asia/Jakarta timezone)  
- [✓] Retries failed transactions (up to 2 times)  
- [✓] Logs each staking attempt with status  
- [✓] Clean, bold terminal banner  
- [✓] Fully configurable with `.env` for sensitive keys  

---

## Requirements

- Node.js (v14 or higher)  
- An active wallet with testnet funds  
- `.env` file containing your private key  

---

## Setup

1. **Clone the repository or download the script**
```bash
git clone https://github.com/itsmesatyavir/magma.git
```

```bash
cd magma
``` 

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a `.env` file**
   ```env
   PRIVATE_KEY=your_private_key_here
   ```

5. **Start the script**
   ```bash
   node index.js
   ```

---

## Configuration

You can adjust staking time in `index.js` by editing the CRON schedule:
```js
cron.schedule('0 15 * * *', () => stakeMonad(), { timezone: "Asia/Jakarta" });
cron.schedule('0 22 * * *', () => stakeMonad(), { timezone: "Asia/Jakarta" });
```

---

## License

MIT

---

## Credits

- Author: **Itsmesatyavir**  
- Shared By: [t.me/airdropscriptfa](https://t.me/airdropscriptfa)  
- Maintained By: [t.me/forestarmy](https://t.me/forestarmy)
