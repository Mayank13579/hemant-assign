// Base URL for API requests
const baseURL = 'https://api.dapplooker.com/chart/87596cde-e5df-4a5d-9e72-7592d4861513?api_key=4721550ec26a47cabbf1aa0609ab7de3&output_format=json';

// Function to make a GET request and display the result
async function makeRequest(url, method) {
  try {
    const response = await fetch(url, { method });
    const data = await response.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error(error);
    document.getElementById('output').innerText = 'Error: ' + error.message;
  }
}

// REST API functions
function getAllTables() {
  const url = 'http://localhost:3000/api/tables';
  makeRequest(url, 'GET');
}

function getAverageGasPrice() {
  const url = 'http://localhost:3000/api/averageGasPrice';
  makeRequest(url, 'GET');
}

function getTransactionsPerBlock() {
  const url = 'http://localhost:3000/api/transactionsPerBlock';
  makeRequest(url, 'GET');
}

function transformStructure() {
  const url = 'http://localhost:3000/api/transformStructure';
  makeRequest(url, 'PUT');
}

function getBlockDetails() {
  const url = 'http://localhost:3000/api/blockDetails';
  makeRequest(url, 'GET');
}

function getBlockDetailsByNumber() {
  const blockNumber = prompt('Enter block number:');
  if (blockNumber) {
    const url = `http://localhost:3000/api/blockDetails/${blockNumber}`;
    makeRequest(url, 'GET');
  }
}
