import React, { useState } from "react";
import "../css/WhereImGoing.css";

const WhereImGoing = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDest, setSelectedDest] = useState<null | { id: number; title: string }>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const destData = [
        {id: 1, title: 'Greece', img: null, 
            activities: [
                {title: 'ACT1', img: null, desc: 'Sightseeing'},
                {title: 'ACT2', img: null, desc: 'More Sightseeing'},
                {title: 'ACT3', img: null, desc: 'Museum'}
            ],
            restraunts: [
                {title: 'REST1', img: null, desc: 'Yummy food'},
                {title: 'REST2', img: null, desc: 'Food'}
            ],
            places: [
                {title: 'PLACE1', img: null, desc: 'place'},
                {title: 'PLACE2', img: null, desc: 'more place'}
            ],
            hotels: [
                {title: 'HOTEL1', img: null, desc: 'hotel'},
                {title: 'HOTEL2', img: null, desc: 'Five stars'}
            ]
        }
    ]

    const destClick = (id: number) => {
        const selectedDest = destData.find((destination) => destination.id === id);
        setSelectedDest(selectedDest);
    };

    return (
        <div>
            {selectedDest ? (
                <div className="destinationLayout">
                    <div className="plansContainer">
                        <div className="plans">
                            <div className="plansTitle">Activities</div>
                            <div className="cards">
                                <p>There is an Activity here</p>
                            </div>
                        </div>
                        <div className="plans">
                            <div className="plansTitle">Restraunts</div>
                        </div>
                        <div className="plans">
                            <div className="plansTitle">Places</div>
                        </div>
                        <div className="plans">
                            <div className="plansTitle">Hotels</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pageLayout">
                    <button className="addDestination" onClick={openModal}>
                        +
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

                    <div className="destinationContainer">
                        {destData.map((destination) => (
                            <div className="destination" key={destination.id} onClick={() => destClick(destination.id)}>
                                <h2 className="destinationTitle">{destination.title}</h2>
                                <div className="imagePlaceholder"></div>
                                <h3 className="destinationSubtitle">You've Planned:</h3>
                                <ul className="destinationList">
                                    {destination.activities && destination.activities.length > 0 && (
                                        <li>{destination.activities.length} {destination.activities.length === 1 ? 'Activity' : 'Activities'}</li>
                                    )}
                                    {destination.restraunts && destination.restraunts.length > 0 && (
                                        <li>{destination.restraunts.length} Restraunt{destination.restraunts.length >1 ? 's' : ''}</li>
                                    )}
                                    {destination.places && destination.places.length > 0 && (
                                        <li>{destination.places.length} Place{destination.places.length >1 ? 's' : ''}</li>
                                    )}
                                    {destination.hotels && destination.hotels.length > 0 && (
                                        <li>{destination.hotels.length} Hotel{destination.hotels.length >1 ? 's' : ''}</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>


    );
};

export default WhereImGoing;
