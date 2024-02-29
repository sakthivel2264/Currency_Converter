import  { useState, useEffect } from "react";
import './App.css'
import CurrencyInput from 'react-currency-input-field';

function App() {
  const [rates, setRates] = useState();
  const [ratesFetched, setRatesFetched] = useState(false);
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [output, setOutput] = useState(0); // Initialize output with a default value

  const getRates = async () => {
    try {
      const response = await fetch("https://v6.exchangerate-api.com/v6/0576ba6ee109ebd1d0a30981/latest/USD");
      const data = await response.json();
      if (data.result === 'success') {
        setRates(data.conversion_rates);
        setRatesFetched(true);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  }

  useEffect(() => {
    getRates();
  }, []);

  const calculateOutput = async () => {
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/0576ba6ee109ebd1d0a30981/latest/${fromCurrency}`);
      const data = await response.json();
      if (data.result === 'success') {
        const fetchedRates = data.conversion_rates;
        const currencyRate = fetchedRates[toCurrency];
        const parsedAmount = parseFloat(amount);
        const outputValue = parsedAmount * currencyRate;
        setOutput(outputValue);
      } else {
        console.error("Error fetching conversion rates:", data.error);
      }
    } catch (error) {
      console.error("Error calculating output:", error);
    }
  }

  return (
    <div className="container">
      <h2>CURRENCY CONVERTER</h2>
      <div className="input-amount">
        <label>Amount:</label>
        <CurrencyInput
          value={amount}
          onValueChange={(amount) => setAmount(amount)}
          intlConfig={{ locale: "en-US", currency: fromCurrency }}
          allowDecimals={true}
          allowNegativeValue={false}/>
        <div className="input-from">
          <label>From:</label>
          <select id="from" onChange={(e) => setFromCurrency(e.target.value)} value={fromCurrency}>
            {ratesFetched ? (
              Object.keys(rates).map((currency, index) => (
                <option key={index} value={currency}>
                  {currency}
                </option>
              ))
            ) : (
              <option defaultValue>USD</option>
            )}
          </select>
        </div>
        <div className="input-to">
          <label>To:</label>
          <select id="to" onChange={(e) => setToCurrency(e.target.value)} value={toCurrency}>
            {ratesFetched ? (
              Object.keys(rates).map((currency, index) => (
                <option key={index} value={currency}>
                  {currency}
                </option>
              ))
            ) : (
              <option defaultValue>EUR</option>
            )}
          </select>
        </div>
        <button className="btn" onClick={calculateOutput}>Calculate</button>
        <div className="output">
          <label>Output: {output}</label>
        </div>
      </div>
    </div>
  );
}

export default App;
