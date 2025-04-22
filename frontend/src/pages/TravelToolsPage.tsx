import React, { useState, ChangeEvent } from "react";
import AccountNavBar from "../components/AccountNavBar";
import "../css/TravelTools.css";

interface TravelToolsProps {
  pageType?: string;
}

export default function TravelToolsPage({
  pageType = "default",
}: TravelToolsProps) {
  const [amount, setAmount] = useState("1.00");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [conversionRate] = useState(1423.9607);
  const [inverseRate] = useState(0.00070267);

  const destinations = [
    // { name: "General Vacation", icon: " " },
    // { name: "Thailand", icon: " " },
    // { name: "Alaska", icon: " " },
    // { name: "Zimbabwe", icon: "⚠️" },
    // { name: "Lake Tahoe", icon: "⚠️" },
    // { name: "Germany", icon: "⚠️" },
    // { name: "California", icon: "⚠️" },
    
    { name: "General Vacation"},
    { name: "Thailand"},
    { name: "Alaska"},
    { name: "Zimbabwe"},
    { name: "Lake Tahoe"},
    { name: "Germany"},
    { name: "California"},
  ];

  const flights = [
    { from: "LHR", to: "NYC", departure: "London", arrival: "New York" },
    { from: "LHR", to: "DXB", departure: "London", arrival: "Dubai" },
    { from: "LHR", to: "NYC", departure: "London", arrival: "New York" },
    { from: "LHR", to: "DXB", departure: "London", arrival: "Dubai" },
  ];

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const containerClass =
    pageType === "where-ive-been"
      ? "page-container no-scroll"
      : "page-container";

  return (
    <div className={containerClass}>
      <AccountNavBar />
      <div className="content-container">
        <h1 className="page-title">Travel Tools</h1>

        <div className="sections-wrapper">
          {/* Upcoming Flights */}
          <div className="section">
            <div className="section-title">Upcoming Flights</div>
            <div className="section-container">
              <div className="flights-container">
                {flights.map((flight, i) => (
                  <div key={i} className="flight-card">
                    <div className="flight-cities">
                      <div className="flight-city">
                        <img src="/api/placeholder/200/150" alt={flight.departure} />
                      </div>
                      <div className="flight-city">
                        <img src="/api/placeholder/200/150" alt={flight.arrival} />
                      </div>
                    </div>
                    <div className="flight-label">
                      <div className="flight-label-text">
                        {flight.from} → {flight.to}
                      </div>
                    </div>
                    <div className="flight-airplane">
                      <div className="airplane-body">
                        <div className="airplane-stripe" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Currency Converter */}
          <div className="section">
            <div className="section-title">Currency Converter</div>
            <div className="section-container">
              <div className="currency-container">
                <div className="currency-form">
                  <div className="form-group">
                    <label className="form-label">From</label>
                    <div className="form-select-container">
                      <select
                        className="form-select"
                        value={fromCurrency}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setFromCurrency(e.target.value)
                        }
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                      </select>
                      <div className="form-select-icon">
                        <span>🇺🇸</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">To</label>
                    <div className="form-select-container">
                      <select
                        className="form-select"
                        value={toCurrency}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setToCurrency(e.target.value)
                        }
                      >
                        <option value="KRW">KRW - South Korean Won</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                      </select>
                      <div className="form-select-icon">
                        <span>🇰🇷</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <div className="form-input-container">
                      <span className="form-input-prefix">$</span>
                      <input
                        type="text"
                        className="form-input"
                        value={amount}
                        onChange={handleAmountChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="currency-result">
                  <div className="conversion-display">
                    <div className="conversion-from">{amount} US Dollar =</div>
                    <div className="conversion-result">
                      <span className="conversion-result-number">
                        {(parseFloat(amount) * conversionRate).toFixed(4)}
                      </span>
                      <span className="conversion-result-currency">
                        {" "}
                        South Korean Won
                      </span>
                    </div>
                    <div className="conversion-rate">
                      1 KRW = {inverseRate} USD
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Packing Lists */}
          <div className="section">
            <div className="section-title">Packing Lists</div>
            <div className="section-container">
              <div className="packing-lists-grid">

                {destinations.map((d, i) => (
                  <div key={i} className="packing-list-card">
                    <div className="packing-list-name">{d.name}</div>
                    <div className="packing-list-icon">{d.icon}</div>

                
                  
                    
                    

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
