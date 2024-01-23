const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const baseURL = 'https://api.dapplooker.com/chart/87596cde-e5df-4a5d-9e72-7592d4861513?api_key=4721550ec26a47cabbf1aa0609ab7de3&output_format=json';

// Array to store entities to exclude
const entitiesToExclude = ['From Address', 'To Address','user','log']; // Add the entities you want to exclude from the list

// Middleware to enable CORS
app.use(cors());

// const corsOptions = {
//     origin: 'http://127.0.0.1:5500',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,  // enable set cookie
//   };
  
//   app.use(cors(corsOptions));


// Middleware to parse JSON requests
app.use(express.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Function to transform the structure
function transformStructure(data) {
  // Assuming data is an array of transactions
  // Remove the following fields from each transaction and return recent 10 transactions
  const transformedData = data.slice(0, 10).map(entry => ({
    hash: entry[0],
    blockNumber: entry[1],
    gasPrice: entry[2],
    transactionCount: entry[3],
    // Add more fields as needed
  }));

  return transformedData;
}

// Function to calculate the average gas price
function calculateAverageGasPrice(data) {
  if (!data || !data.length) {
    return null; // Handle the case where data is empty or not available
  }

  // Extract gas prices from the data
  const gasPrices = data.map(entry => entry[2]); // Assuming gasPrice is at index 2

  // Calculate the average gas price
  const sumGasPrices = gasPrices.reduce((sum, price) => sum + price, 0);
  const averageGasPrice = sumGasPrices / gasPrices.length;

  // Return the calculated average gas price
  return averageGasPrice;
}

// Function to calculate the number of transactions per block
function calculateTransactionsPerBlock(data) {
  if (!data || !data.length) {
    return null; // Handle the case where data is empty or not available
  }

  // Assuming data is an array of transactions and each transaction has a transactionCount field
  const transactionsPerBlock = data.map(entry => entry[3]); // Assuming transactionCount is at index 3

  // Sum up the transaction counts to get the total transactions per block
  const totalTransactions = transactionsPerBlock.reduce((sum, count) => sum + count, 0);

  // Return the total transactions per block
  return totalTransactions;
}

// REST API implementations
app.get('/api/tables', async (req, res, next) => {
  try {
    const response = await axios.get(baseURL);
    const schema = response.data.__schema;

    const validTables = schema.types.filter(
      (type) =>
        type.entityDefinition.fields !== null &&
        type.entityDefinition.fields !== '' &&
        type.entityDefinition.fields !== undefined &&
        type.entityDefinition.fields.length > 0 &&
        !entitiesToExclude.includes(type.entityDefinition.name.toLowerCase()) &&
        !type.entityDefinition.name.startsWith('_')
    );

    res.json(validTables);
    console.log(validTables)
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/averageGasPrice', async (req, res, next) => {
  try {
    const response = await axios.get(baseURL);
    const data = response.data; // Assuming the response contains an array of data

    // Process the response to calculate the average gas price of the day
    const averageGasPrice = calculateAverageGasPrice(data);

    if (averageGasPrice !== null) {
      res.json({ averageGasPrice });
    } else {
      res.status(500).json({ error: 'Unable to calculate average gas price' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/transactionsPerBlock', async (req, res, next) => {
  try {
    const response = await axios.get(baseURL);
    const data = response.data; // Assuming the response contains an array of data

    // Process the response to calculate the number of transactions per block
    const transactionsPerBlock = calculateTransactionsPerBlock(data);

    if (transactionsPerBlock !== null) {
      res.json({ transactionsPerBlock });
    } else {
      res.status(500).json({ error: 'Unable to calculate transactions per block' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.put('/api/transformStructure', async (req, res, next) => {
  try {
    const response = await axios.get(baseURL);
    const data = response.data; // Assuming the response contains an array of data

    // Transform the structure using the defined function
    const transformedData = transformStructure(data);

    // Respond with the transformed data
    res.json({ transformedData });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/blockDetails', async (req, res, next) => {
  try {
    const response = await axios.get(baseURL);
    const data = response.data; // Assuming the response contains an array of data

    // Calculate average gas price of block
    const averageGasPrice = calculateAverageGasPrice(data);

    // Calculate number of transactions per block
    const transactionsPerBlock = calculateTransactionsPerBlock(data);

    // Respond with the block details
    res.json({ averageGasPrice, transactionsPerBlock });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/blockDetails/:blockNumber', async (req, res, next) => {
  try {
    const blockNumber = parseInt(req.params.blockNumber);

    if (isNaN(blockNumber) || blockNumber <= 0) {
      return res.status(400).json({ error: 'Invalid block number' });
    }

    const response = await axios.get(baseURL);
    const data = response.data; // Assuming the response contains an array of data

    // Calculate average gas price of block
    const averageGasPrice = calculateAverageGasPrice(data);

    // Calculate number of transactions per block
    const transactionsPerBlock = calculateTransactionsPerBlock(data);

    // Respond with the block details
    res.json({ timestamp: new Date(), averageGasPrice, transactionsPerBlock });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
