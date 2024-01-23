const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const baseURL = 'https://api.dapplooker.com/chart/87596cde-e5df-4a5d-9e72-7592d4861513?api_key=4721550ec26a47cabbf1aa0609ab7de3&output_format=json';

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

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
    // Implement logic to get the data you want to transform
    // For example, you might retrieve data from a database or an external API

    // Placeholder data for demonstration purposes
    const originalData = [
      { originalField: 'value1' },
      { originalField: 'value2' },
      // ... more data
    ];

    // Transform the structure using the defined function
    const transformedData = transformStructure(originalData);

    // Respond with the transformed data
    res.json({ transformedData });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/blockDetails', async (req, res, next) => {
  try {
    // Call the function to get block details
    const blockDetails = await getBlockDetailsFromAPI();

    // Respond with the block details
    res.json({ blockDetails });
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

    // Call the function to get timestamp and number of transactions
    const blockDetails = await getBlockDetailsFromAPI(blockNumber);

    // Respond with the block details
    res.json(blockDetails);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Function to transform the structure (placeholder, replace with actual implementation)
function transformStructure(data) {
  // Implement your logic to transform the structure here
  // ...

  // For demonstration purposes, let's assume data transformation results in transformedData
  const transformedData = data.map(entry => ({ transformedField: entry.originalField }));

  return transformedData;
}

// Function to calculate the average gas price
function calculateAverageGasPrice(data) {
  if (!data || !data.length) {
    return null; // Handle the case where data is empty or not available
  }

  // Extract gas prices from the data
  const gasPrices = data.map(entry => entry.gasPrice);

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

  // Assuming the response contains an array of data with transaction counts
  const transactionsPerBlock = data.map(entry => entry.transactionCount);

  // Sum up the transaction counts to get the total transactions per block
  const totalTransactions = transactionsPerBlock.reduce((sum, count) => sum + count, 0);

  // Return the total transactions per block
  return totalTransactions;
}

// Function to get block details from API
async function getBlockDetailsFromAPI() {
  try {
    // Make an API request to get block details
    const response = await axios.get('https://api.example.com/blockDetails');
    const blockDetails = response.data; // Assuming the API response contains block details

    return { blockDetails };
  } catch (error) {
    throw error; // Propagate the error to be caught by the calling route
  }
}

// Function to get block details for a given block number from API
async function getBlockDetailsFromAPI(blockNumber) {
  try {
    // Make an API request to get block details for the given block number
    const response = await axios.get(`https://api.example.com/blockDetails/${blockNumber}`);
    const { timestamp, transactions } = response.data; // Assuming the API response contains timestamp and transactions

    return { timestamp, transactions };
  } catch (error) {
    throw error; // Propagate the error to be caught by the calling route
  }
}

// Array to store entities to exclude
const entitiesToExclude = ['entity1', 'entity2'];  // Add the entities you want to exclude from the list

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
