const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_BOT_TOKEN' with your actual Telegram bot token
const bot = new TelegramBot('6459880979:AAGaImT_1wJyD_FLfkpy-MHIOKeZq9aDyEU', { polling: true });

// Handle start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Welcome to MevBot ERC! You can use the following commands:
  \n\n/Follous - Follow our telegram channel for added benefits\n/gasfees - Check Ethereum gas fees\n/scanner - Scan for first 10 buyers of an ERC-20 token`);
});

// Handle gas fee command
// bot.onText(/\/gasfee/, async (msg) => {
//   const chatId = msg.chat.id;
//   try {
//     const response = await axios.get('https://api.etherscan.io/api', {
//       params: { 
//         module: 'gastracker',
//         action: 'gasoracle',
//         apikey: 'RUEG4F6NFZ8BV7GJE7JSNYS23SS12WCUEQ', // Get your Etherscan API key
//       },
//     });
//     const gasPrice = response.data.result.ProposeGasPrice;
//     bot.sendMessage(chatId, `The  Current Ethereum gas price: ${gasPrice} Gwei`);
//   } catch (error) {
//     bot.sendMessage(chatId, 'Failed to fetch gas price. Please try again later.');
//   }
// });

// Handle gas fee command
bot.onText(/\/gasfee/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      // Get current Ethereum price in USD from a reliable source (e.g., CoinGecko)
      const ethPriceResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'ethereum',
            vs_currencies: 'usd',
          },
        }
      );
      const ethPriceInUSD = ethPriceResponse.data.ethereum.usd;
  
      // Get gas fee estimates for fast, average, and slow transactions from Etherscan
      const gasFeeResponse = await axios.get(
        'https://api.etherscan.io/api',
        {
          params: {
            module: 'gastracker',
            action: 'gasoracle',
            apikey: 'RUEG4F6NFZ8BV7GJE7JSNYS23SS12WCUEQ', // Get your Etherscan API key
          },
        }
      );
      const fastGasPrice = gasFeeResponse.data.result.FastGasPrice;
      const averageGasPrice = gasFeeResponse.data.result.ProposeGasPrice;
      const safeGasPrice = gasFeeResponse.data.result.SafeGasPrice;
  
      // Estimate transaction times in minutes based on gas fees
      const transactionTimes = {
        Fast: 2, // Fast transaction estimated in 2 minutes
        Average: 5, // Average transaction estimated in 5 minutes
        Slow: 15, // Slow transaction estimated in 15 minutes
      };

  
      // Build the response message
      const responseMessage = `Current Ethereum Price: $${ethPriceInUSD}\n\n
      Gas Fee Estimates:\nFast: ${fastGasPrice} Gwei ( less than ${transactionTimes.Fast} minutes)\nAverage: ${averageGasPrice} Gwei ( less than ${transactionTimes.Average} minutes)\nSlow: ${safeGasPrice} Gwei (up to ${transactionTimes.Slow} minutes)`;
  
      bot.sendMessage(chatId, responseMessage);
    } catch (error) {
      bot.sendMessage(chatId, 'Failed to fetch data. Please try again later.');
    }
  });

// Handle scanner command
bot.onText(/\/scanner/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Scanning for the first 10 buyers of an ERC-20 token...');
  // Implement the token scanning logic here and send results back to the user.
  // This may involve interacting with a blockchain API to fetch token transactions.
});