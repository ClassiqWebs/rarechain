document.addEventListener("DOMContentLoaded", () => {
  const cryptoGrid = document.getElementById("crypto-grid");

  async function fetchCryptoData() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
      );
      const data = await response.json();
      displayCryptoData(data);
    } catch (error) {
      console.error("Error fetching cryptocurrency data:", error);
    }
  }

  function displayCryptoData(data) {
    cryptoGrid.innerHTML = "";
    data.forEach((crypto) => {
      const listItem = document.createElement("div");
      listItem.classList.add("crypto-item");

      const priceChange = crypto.price_change_percentage_24h;
      if (priceChange > 0) {
        listItem.classList.add("positive");
      } else if (priceChange < 0) {
        listItem.classList.add("negative");
      } else {
        listItem.classList.add("neutral");
      }

      listItem.innerHTML = `
                <div class="crypto-name">${
                  crypto.name
                } (${crypto.symbol.toUpperCase()})</div>
                <div class="crypto-price">$${crypto.current_price.toLocaleString()}</div>
                <div class="crypto-change">${priceChange.toFixed(2)}%</div>
            `;

      cryptoGrid.appendChild(listItem);
    });
  }

  fetchCryptoData();
  setInterval(fetchCryptoData, 60000); // Update every 60 seconds
});
