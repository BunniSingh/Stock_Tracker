import data from './static/data.js';
console.log(data);
let dropdown = document.getElementById('topStockList');
let searchInput = document.getElementById('searchInput');
let getStock = document.getElementById('getStock');
let searchBtn = document.getElementById('searchBtn');

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


getStock.addEventListener('click', function(){
    const stockSymbol = dropdown.value;
    getStockData(stockSymbol).then(data => {
        const stockData = data['Time Series (Daily)'];
        displayStockGraph(stockData);
    })
})






populateDropdown();
