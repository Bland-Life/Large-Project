import React, { useState } from "react";
import "../css/WhereImGoing.css";

const WhereImGoing = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <div className="destinationContainer">
                <div className="destination">
                    1
                </div>
                <div className="destination">
                    2
                </div>
                <div className="destination">
                    3
                </div>
                <div className="destination">
                    4
                </div>
                <div className="destination">
                    5
                </div>
            </div>
            <button className="addDestination" onClick={openModal}>
                Add Destination
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>
                            &times;
                        </span>
                        <form>
                            <h2>Where I'm Going Form</h2>
                            <label>
                                Destination:
                                <input type="text" name="destination" />
                            </label>
                            <br />
                            <label>
                                Date:
                                <input type="date" name="date" />
                            </label>
                            <br />
                            <label>
                                Upload Image:
                                <input type="file" name="image" accept="image/*" />
                            </label>
                            <br />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhereImGoing;
