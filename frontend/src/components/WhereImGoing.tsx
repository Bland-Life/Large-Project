import React, { useState } from "react";
import "../css/WhereImGoing.css";
import { formatDate, getImageString } from "../utils/Utils";

const WhereImGoing = () => {
    let _ud: any = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDest, setSelectedDest] = useState<null | { id: number; title: string }>(null);
    const [currentTrips, setCurrentTrips] = useState(null);
    const [username, setUsername] = useState<string>("");
    const [tripData, setTripData] = useState(null);
    const [userData, setUserData] = useState({
            name: ud.firstName,
            username: ud.username,
            email: ud.email,
            profileimage: ud.profileimage,
        });
    const [destination, setDestination] = useState<string>("");
    const [date, setDate] = useState<Date>(null);
    const [image, setImage] = useState<File>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    function formatData() {
        var stringDate = formatDate(date);
        var imageString = getImageString(image);
        var emptyPlans = createEmptyPlans();

        var trip = {
            destination:destination,
            date:date,
            plans:emptyPlans,
            image:image
        }

        setTripData(trip);
    }

    function createEmptyPlans() : any {
        var plans = {
            Activities: {
                number: 0,
                activities:[]
            },
            Restaraunts: {
                number: 0,
                restaraunts: []
            },
            Places: {
                number: 0,
                places: []
            },
            Hotels: {
                number: 0,
                hotels: []
            }
        };

        return plans;
    }

    async function sendData() {
        var jsTripData = JSON.stringify(tripData);
        
        const response = await fetch(`https://ohtheplacesyoullgo.space/api/addtrip/${userData.username}`, {
            method: "PUT",
            body: jsTripData,
            headers: { "Content-Type": "application/json" },
          });
    
          const res = JSON.parse(await response.text());

          if (res.status === "Success") {
            window.location.reload();
          }
    }

    async function addTrip() : Promise<void> {
        formatData();
        sendData();
    }

    async function getTrips() : Promise<void> {
        const response = await fetch(`https://ohtheplacesyoullgo.space/api/gettrips/${username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          const res = JSON.parse(await response.text());

          if (res.status === "Success") {
            setCurrentTrips(res.trips);
          }
    }

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

    //Card carousel
    const Carousel = ({ data, category }: {data: any[], category: string}) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const handleNext = () => {
            setCurrentIndex((prevIndex: number) => (prevIndex + 1) % data.length);
        };

        const handlePrev = () => {
            setCurrentIndex((prevIndex: number) => (prevIndex - 1 + data.length) % data.length);
        };

        if (!data || data.length === 0) return null;

        const currentItem = data[currentIndex];

        return (
            <div className="plans">
                <div className="plansTitle">{category}</div>
                <div className="cards">
                    {currentItem.img ? (
                        <img src={currentItem.img} alt={currentItem.title || category}></img>
                    ) : (
                        <div className="imagePlaceholder"></div>
                    )}

                    <p>{currentItem.desc}</p>
                </div>

                <div className="controls">
                    <button onClick={handlePrev}>&lt;</button>
                    <button onClick={handleNext}>&gt;</button>
                </div>
            </div>
        );
    };

    return (
        <div>
            {selectedDest ? (
                <div className="destinationLayout">
                    <div className="plansContainer">
                        <Carousel category="Activities" data={selectedDest.activities}></Carousel>

                        <Carousel category="Restraunts" data={selectedDest.restraunts}></Carousel>

                        <Carousel category="Places" data={selectedDest.places}></Carousel>

                        <Carousel category="Hotels" data={selectedDest.hotels}></Carousel>
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
                                <form onSubmit={addTrip}>
                                    <h2>Where I'm Going Form</h2>
                                    <label>
                                        Destination:
                                        <input type="text" 
                                        name="destination" 
                                        value={destination} 
                                        onChange={(e) => setDestination(e.target.value)}/>
                                    </label>
                                    <br />
                                    <label>
                                        Date:
                                        <input type="date" 
                                        name="date" 
                                        value={date} 
                                        onChange={(e) => setDate(e.target.value)}/>
                                    </label>
                                    <br />
                                    <label>
                                        Upload Image:
                                        <input type="file" 
                                        name="image" 
                                        accept="image/*" 
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}/>
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
