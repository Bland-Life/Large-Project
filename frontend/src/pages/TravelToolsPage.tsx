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

  const flights = [
    { from: "LHR", to: "NYC", departure: "London", arrival: "New York" },
    { from: "LHR", to: "DXB", departure: "London", arrival: "Dubai" },
    { from: "LHR", to: "NYC", departure: "London", arrival: "New York" },
    { from: "LHR", to: "DXB", departure: "London", arrival: "Dubai" },
  ];

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
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

  return (
    <div className={containerClass}>
      <AccountNavBar />
      <div className="content-container">
        <div className="sections-wrapper">
          {/* Upcoming Flights Section */}
          <div className="section">
            <div className="section-container">
              <div className="section-title">Upcoming Flights</div>
              <div className="flights-container">
                {flights.map((flight, i) => (
                  <div key={i} className="flight-card">
                    <div className="flight-cities">
                      <div className="flight-city">
                        <img
                          src={`/images/${flight.departure.replace(/\s/g, "")}.jpg`}
                          alt={flight.departure}
                        />
                      </div>
                      <div className="flight-city">
                        <img
                          src={`/images/${flight.arrival.replace(/\s/g, "")}.jpg`}
                          alt={flight.arrival}
                        />
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
                    <span>{index + 1}. </span> {/* Display the item number */}
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
                      {index + 1}. {item} {/* Display the item number */}
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
