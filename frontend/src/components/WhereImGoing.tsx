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
                    <h2 className="destinationTitle">Destination</h2>
                    <div className="imagePlaceholder"></div>
                    <h3 className="destinationSubtitle">Activities</h3>
                    <ul className="destinationList">
                        <li>Activity 1</li>
                        <li>Activity 2</li>
                        <li>Activity 3</li>
                        <li>Activity 4</li>
                    </ul>
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
