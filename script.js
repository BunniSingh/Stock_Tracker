// import data from './static/data.js';
let dropdown = document.getElementById('topStockList');
let getStock = document.getElementById('getStock');
let searchInput = document.getElementById('searchInput');
let searchBtn = document.getElementById('searchBtn');
let stockDetails = document.getElementById('stockDetails');
let stockTableBody = document.getElementById('stockTableBody');

const ctx = document.getElementById('stockChart').getContext('2d');
let stockChart;

const apiKey = 'BUVA19JMXIH1XPL7';

async function getStockData(stockSymbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`);
    const data = await response.json();
    return data['Time Series (Daily)'];
}

function populateDropdown(){
    const trendingStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'BABA', 'INTC'];
    trendingStocks.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock;
        option.textContent = stock;
        dropdown.appendChild(option);
    })
}


function showStockDetailsOnUi(stockSymbol, stockData){
    const lastDate = Object.keys(stockData)[0];
    const latestData = stockData[lastDate];
    const price = latestData['4. close'];
    const volume = latestData['5. volume'];
    const change = (latestData['4. close'] - stockData[Object.keys(stockData)[1]]['4. close']).toFixed(2);
    stockDetails.innerHTML = `
        <h2>${stockSymbol}</h2>
        <p>Price: $${price}</p>
        <p>Change: ${change}</p>
        <p>Volume: ${volume}</p>
        <p>Date: ${lastDate}</p>
        `

    addDetailsIntoTable(stockSymbol, price , change , volume, lastDate);
}


function addDetailsIntoTable(stockSymbol, price, change, volume, lastDate) {
    const row = document.createElement('tr');
    row.innerHTML += `
        <td>${stockSymbol}</td>
        <td>${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
        <td>${lastDate}</td>
    `;
    stockTableBody.appendChild(row);   
}


// show stock with graph 
function displayStockGraph(stockData) {
    const labels = Object.keys(stockData).slice(0, 30).reverse();
    const data = labels.map(date => stockData[date]['4. close']);

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}



// Get Stock function via dropdown
getStock.addEventListener('click', async function(){
    const stockSymbol = dropdown.value;
    if(stockSymbol){
        const stockData =  await getStockData(stockSymbol);
        console.log(stockData);
        if(stockData){
            displayStockGraph(stockData);
            showStockDetailsOnUi(stockSymbol, stockData);
        }else{
          alert('No stock data found for this symbol');
        }
      }else{
          alert('Please enter a stock symbol');
      }
})


// Search Stock function 
searchBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const searchValue = searchInput.value.toUpperCase();
    if(searchValue){
      const stockData =  await getStockData(searchValue);
      if(stockData){
          displayStockGraph(stockData);
          showStockDetailsOnUi(searchValue, stockData);
      }else{
        alert('No stock data found for this symbol');
      }
    }else{
        alert('Please enter a stock symbol');
    }
 
})

populateDropdown();
