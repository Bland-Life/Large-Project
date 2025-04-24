import React, { useState, ChangeEvent, useEffect } from "react";
import "../css/TravelToolsFlights.css";
import "../css/TravelTools.css";



interface TravelToolsProps {
  pageType?: string;
}

// Define currency data structure
interface Currency {
  code: string;
  name: string;
  flag: string;
}

// Flight interface for the new interactive flights
interface Flight {
  id: number;
  departureCity: string;
  departureCode: string;
  departureTime: string;
  arrivalCity: string;
  arrivalCode: string;
  arrivalTime: string;
  boardingDate: string;
  imageUrl: string;
}

// For real implementation, you'd use an API for live rates
interface ConversionRates {
  [key: string]: {
    [key: string]: number;
  };
}

export default function TravelToolsPage({
  pageType = "default",
}: TravelToolsProps) {
  const [amount, setAmount] = useState("1.00");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [conversionRate, setConversionRate] = useState(1423.9607);
  const [inverseRate, setInverseRate] = useState(0.00070267);
  const [convertedAmount, setConvertedAmount] = useState(1423.9607);
  const [activeFlightId, setActiveFlightId] = useState<number | null>(null);

  // Interactive flights data
  const interactiveFlights: Flight[] = [
    {
      id: 1,
      departureCity: "Las Vegas",
      departureCode: "LAS",
      departureTime: "01:10 PM",
      arrivalCity: "Athens",
      arrivalCode: "ATH",
      arrivalTime: "06:10 PM",
      boardingDate: "March 1, 2026",
      imageUrl: "/images/Beach.jpg"
    },
    {
      id: 2,
      departureCity: "London",
      departureCode: "LHR",
      departureTime: "09:45 AM",
      arrivalCity: "New York",
      arrivalCode: "NYC",
      arrivalTime: "12:30 PM",
      boardingDate: "April 15, 2026",
      imageUrl: "/images/London.jpg"
    },
    {
      id: 3,
      departureCity: "Paris",
      departureCode: "CDG",
      departureTime: "02:20 PM",
      arrivalCity: "Tokyo",
      arrivalCode: "TYO",
      arrivalTime: "10:05 AM",
      boardingDate: "May 22, 2026",
      imageUrl: "/images/NewYork.jpg"
    },
    {
      id: 4,
      departureCity: "Dubai",
      departureCode: "DXB",
      departureTime: "11:30 PM",
      arrivalCity: "Sydney",
      arrivalCode: "SYD",
      arrivalTime: "07:15 PM",
      boardingDate: "June 10, 2026",
      imageUrl: "/images/Dubai.jpg"
    }
  ];

  // Currencies data
  const currencies: Currency[] = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  ];

  // Sample conversion rates (in a real app, you'd fetch these from an API)
  const rates: ConversionRates = {
    USD: { USD: 1, EUR: 0.91, GBP: 0.79, JPY: 153.24, KRW: 1423.96, CAD: 1.38, AUD: 1.52, CNY: 7.25 },
    EUR: { USD: 1.10, EUR: 1, GBP: 0.87, JPY: 168.64, KRW: 1566.98, CAD: 1.52, AUD: 1.67, CNY: 7.98 },
    GBP: { USD: 1.27, EUR: 1.15, GBP: 1, JPY: 194.19, KRW: 1804.76, CAD: 1.75, AUD: 1.93, CNY: 9.19 },
    JPY: { USD: 0.0065, EUR: 0.0059, GBP: 0.0052, JPY: 1, KRW: 9.29, CAD: 0.009, AUD: 0.0099, CNY: 0.047 },
    KRW: { USD: 0.00070, EUR: 0.00064, GBP: 0.00055, JPY: 0.11, KRW: 1, CAD: 0.00097, AUD: 0.0011, CNY: 0.0051 },
    CAD: { USD: 0.72, EUR: 0.66, GBP: 0.57, JPY: 111.04, KRW: 1032.58, CAD: 1, AUD: 1.10, CNY: 5.26 },
    AUD: { USD: 0.66, EUR: 0.60, GBP: 0.52, JPY: 100.95, KRW: 938.71, CAD: 0.91, AUD: 1, CNY: 4.78 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 21.13, KRW: 196.41, CAD: 0.19, AUD: 0.21, CNY: 1 },
  };

  // Packing list state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackingList, setSelectedPackingList] = useState<string | null>(
    null
  );
  const [packingItems, setPackingItems] = useState<string[]>([""]);
  const [isEditing, setIsEditing] = useState(false);
  const [destinations, setDestinations] = useState([
    { name: "General Vacation" },
  ]);
  const [isAddDestinationModalOpen, setIsAddDestinationModalOpen] =
    useState(false);
  const [newDestinationName, setNewDestinationName] = useState("");

  // Find currency by code
  const getCurrencyByCode = (code: string): Currency => {
    return currencies.find(currency => currency.code === code) || currencies[0];
  };

  // Toggle flight card active state
  const toggleFlightCard = (id: number) => {
    if (activeFlightId === id) {
      setActiveFlightId(null);
    } else {
      setActiveFlightId(id);
    }
  };

  // Update conversion rates when currencies change
  useEffect(() => {
    const from = fromCurrency;
    const to = toCurrency;
    const rate = rates[from][to];
    const inverse = rates[to][from];
    
    setConversionRate(rate);
    setInverseRate(inverse);
    calculateConversion(amount, rate);
  }, [fromCurrency, toCurrency]);

  // Calculate the converted amount
  const calculateConversion = (value: string, rate: number) => {
    const numValue = parseFloat(value) || 0;
    setConvertedAmount(numValue * rate);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    calculateConversion(value, conversionRate);
  };

  const handleFromCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  const handlePackingItemChange = (index: number, value: string) => {
    const updatedItems = [...packingItems];
    updatedItems[index] = value;
    setPackingItems(updatedItems);
  };

  const addPackingItem = () => {
    setPackingItems([...packingItems, ""]);
  };

  const removePackingItem = (index: number) => {
    const updatedItems = packingItems.filter((_, i) => i !== index);
    setPackingItems(updatedItems);
  };

  const openModal = (listName: string) => {
    setSelectedPackingList(listName);
    setIsModalOpen(true);
    setIsEditing(false); // Start in view mode
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackingList(null);
    setPackingItems([""]);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  const openAddDestinationModal = () => {
    setIsAddDestinationModalOpen(true);
  };

  const closeAddDestinationModal = () => {
    setIsAddDestinationModalOpen(false);
    setNewDestinationName("");
  };

  const addDestination = () => {
    if (newDestinationName.trim() !== "") {
      setDestinations([...destinations, { name: newDestinationName }]);
      closeAddDestinationModal();
    }
  };

  const containerClass =
    pageType === "where-ive-been"
      ? "page-container no-scroll"
      : "page-container";

  // Get current currencies
  const fromCurrencyObj = getCurrencyByCode(fromCurrency);
  const toCurrencyObj = getCurrencyByCode(toCurrency);

  // CSS styles for form elements
  const inputStyles = {
    containerStyle: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ccc',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    prefixStyle: {
      padding: '8px 12px',
      backgroundColor: '#f5f5f5',
      borderRight: '1px solid #ccc',
      minWidth: '60px',
      textAlign: 'center' as const
    },
    inputStyle: {
      flex: '1',
      border: 'none',
      padding: '8px 12px',
      outline: 'none'
    }
  };

  return (
    <div className={containerClass}>
      <div className="content-container">
        <div className="sections-wrapper">
          {/* Upcoming Flights Section */}
          <div className="section">
            <div className="section-container">
              <div className="section-title">Upcoming Flights</div>
              <div className="cards-wrap">
                {interactiveFlights.map((flight) => (
                  <div 
                    key={flight.id} 
                    className={`card ${activeFlightId === flight.id ? 'active' : ''}`}
                    onClick={() => toggleFlightCard(flight.id)}
                  >
                    <div className="card-img">
                      <img src={flight.imageUrl} alt={flight.departureCity} />
                    </div>
                    <div className="card-content">
                      <img src="/images/plane.png" className="plane" alt="Airplane" />
                      <div className="flight-details">
                        <div className="flight-info">
                          <span className="city">{flight.departureCity}</span>
                          <span className="city-code">{flight.departureCode}</span>
                          <span className="time">{flight.departureTime}</span>
                        </div>
                        <div className="flight-icon">
                          <img src="/images/planeIcon.png" alt="Flight icon" />
                        </div>
                        <div className="flight-info">
                          <span className="city">{flight.arrivalCity}</span>
                          <span className="city-code">{flight.arrivalCode}</span>
                          <span className="time">{flight.arrivalTime}</span>
                        </div>
                      </div>
                      <div className="dash-line"></div>
                      <div className="footer-content">
                        <div className="travel-date">
                          <span className="date-title">Boarding On:</span>
                          <span className="travel-day">{flight.boardingDate}</span>
                          <span className="extended">.</span>
                          <span className="extended">.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Currency Converter Section */}
          <div className="section">
            <div className="section-container">
              <div className="section-title">Currency Converter</div>
              <div className="currency-container">
                <div className="currency-form">
                  <div className="form-group">
                    <label className="form-label">From</label>
                    <div className="form-select-container">
                      <select
                        className="form-select"
                        value={fromCurrency}
                        onChange={handleFromCurrencyChange}
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <div className="form-select-icon">
                        <span>{fromCurrencyObj.flag}</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">To</label>
                    <div className="form-select-container">
                      <select
                        className="form-select"
                        value={toCurrency}
                        onChange={handleToCurrencyChange}
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <div className="form-select-icon">
                        <span>{toCurrencyObj.flag}</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <div style={inputStyles.containerStyle}>
                      <div style={inputStyles.prefixStyle}>{fromCurrencyObj.code}</div>
                      <input
                        type="text"
                        style={inputStyles.inputStyle}
                        value={amount}
                        onChange={handleAmountChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="currency-result">
                  <div className="conversion-display">
                    <div className="conversion-from">
                      {amount} {fromCurrencyObj.name} =
                    </div>
                    <div className="conversion-result">
                      <span className="conversion-result-number">
                        {convertedAmount.toFixed(4)}
                      </span>
                      <span className="conversion-result-currency">
                        {" "}
                        {toCurrencyObj.name}
                      </span>
                    </div>
                    <div className="conversion-rate">
                      1 {toCurrencyObj.code} = {inverseRate.toFixed(6)} {fromCurrencyObj.code}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Packing Lists Section */}
          <div className="section">
            <div className="section-container">
              <div className="section-title">Packing Lists</div>
              <div className="packing-lists-grid">
                {destinations.map((d, i) => (
                  <div
                    key={i}
                    className="packing-list-card"
                    onClick={() => openModal(d.name)}
                  >
                    <div className="packing-list-name">{d.name}</div>
                  </div>
                ))}
                <button
                  className="add-destination-button"
                  onClick={openAddDestinationModal}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packing List Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedPackingList} Packing List</h2>
            {isEditing ? (
              <>
                {packingItems.map((item, index) => (
                  <div key={index} className="packing-item">
                    <span>{index + 1}. </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handlePackingItemChange(index, e.target.value)
                      }
                      placeholder="Enter item"
                    />
                    <button onClick={() => removePackingItem(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button onClick={addPackingItem}>Add Item</button>
                <button onClick={stopEditing}>Save</button>
              </>
            ) : (
              <>
                <ul>
                  {packingItems.map((item, index) => (
                    <li key={index}>
                      {index + 1}. {item}
                    </li>
                  ))}
                </ul>
                <button onClick={startEditing}>Edit</button>
                <button onClick={closeModal}>Close</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      {isAddDestinationModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeAddDestinationModal}>
              &times;
            </span>
            <h2>Add New Destination</h2>
            <input
              type="text"
              value={newDestinationName}
              onChange={(e) => setNewDestinationName(e.target.value)}
              placeholder="Enter destination name"
            />
            <button onClick={addDestination}>Add</button>
            <button onClick={closeAddDestinationModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}