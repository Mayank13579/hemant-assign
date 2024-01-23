document.addEventListener('DOMContentLoaded', () => {
    // Base URL for API requests
    const baseURL = 'http://localhost:3000/api';
  
    // Function to make a GET request and display the result
    async function makeRequest(endpoint, method) {
      try {

        const response = await fetch(`${baseURL}/${endpoint}`, { method });
        const data = await response.json();

        document.getElementById('output').innerText = JSON.stringify(data, null, 2);
      } catch (error) {
        console.error(error);
        document.getElementById('output').innerText = 'Error: ' + error.message;
      }
    }
  
    // Example: Get all tables
    document.getElementById('getAllTables').addEventListener('click', () => {
      makeRequest('tables', 'GET');
    });
  
    // Example: Get average gas price
    document.getElementById('getAverageGasPrice').addEventListener('click', () => {
      makeRequest('averageGasPrice', 'GET');
    });
  
    // Example: Get transactions per block
    document.getElementById('getTransactionsPerBlock').addEventListener('click', () => {
      makeRequest('transactionsPerBlock', 'GET');
    });
  
    // Example: Transform structure
    document.getElementById('transformStructure').addEventListener('click', () => {
      makeRequest('transformStructure', 'PUT');
    });
  
    // Example: Get block details
    document.getElementById('getBlockDetails').addEventListener('click', () => {
      makeRequest('blockDetails', 'GET');
    });
  
    // Example: Get block details by number
    document.getElementById('getBlockDetailsByNumber').addEventListener('click', () => {
      const blockNumber = prompt('Enter block number:');
      if (blockNumber) {
        makeRequest(`blockDetails/${blockNumber}`, 'GET');
      }
    });
  });
  