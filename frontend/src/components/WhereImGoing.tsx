import React, { useState, useEffect } from "react";
import "../css/WhereImGoing.css";
import { formatDate, getImageString, uploadImage } from "../utils/utils.tsx";

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
    const [date, setDate] = useState<string>("");
    const [image, setImage] = useState<File>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        var trips;
        const fetchData = async () => {
            trips = await getTrips();
          };
        
          fetchData();
          setCurrentTrips(trips);
        
      }, []); 

    async function formatData() : Promise<any>{
        const base64 = await getImageString(image);
        console.log(base64);
        var filename = await uploadImage(base64);
        var emptyPlans = createEmptyPlans();

        var trip = {
            destination:destination,
            date:date,
            plans:emptyPlans,
            image:filename
        }

        return trip;
    }

    function createEmptyPlans() : any {
        var plans = {
            Activities: {
                number: 0,
                activities:[]
            },
            Restaurants: {
                number: 0,
                restaurants: []
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

    async function sendData(data: any) {
        var jsTripData = JSON.stringify(data);
        
        const response = await fetch(`https://ohtheplacesyoullgo.space/api/addtrip/${userData.username}`, {
            method: "PUT",
            body: jsTripData,
            headers: { "Content-Type": "application/json" },
          });
    
          const res = JSON.parse(await response.text());

          if (res.status === "Success") {
            //window.location.reload();
          }
    }

    async function addTrip(event: React.FormEvent) : Promise<void> {
        console.log("Adding Trip");
        event.preventDefault()
        var formattedData = await formatData();
        var response = await sendData(formattedData);
        setIsModalOpen(false);
    }

    async function getTrips() : Promise<any> {
        const response = await fetch(`https://ohtheplacesyoullgo.space/api/gettrips/${username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          const res = JSON.parse(await response.text());

          if (res.status === "Success") {
            return res.trips;
          }
          return null;
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            console.log(event.target.files[0].name);
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
                                <form>
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
                                        onChange={handleImageChange}/>
                                    </label>
                                    <br />
                                    <button type="submit" onClick={addTrip}>Submit</button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="destinationContainer">
                        {currentTrips.map((trip) => (
                            <div className="destination" key={trip.destination}>
                                <h2 className="destinationTitle">{destination.title}</h2>
                                <div className="imagePlaceholder"></div>
                                <h3 className="destinationSubtitle">You've Planned:</h3>
                                <ul className="destinationList">
                                    {trip.plans.Activities && trip.plans.Activities.number > 0 && (
                                        <li>{trip.plans.Activities.number} {trip.plans.Activities.number === 1 ? 'Activity' : 'Activities'}</li>
                                    )}
                                    {trip.plans.Restaurants && trip.plans.Restaurants.number > 0 && (
                                        <li>{trip.plans.Restaurants.number} Restaurant{trip.plans.Restaurants.number >1 ? 's' : ''}</li>
                                    )}
                                    {trip.plans.Places && trip.plans.Places.number > 0 && (
                                        <li>{trip.plans.Places.number} Place{trip.plans.Places.number >1 ? 's' : ''}</li>
                                    )}
                                    {trip.plans.Hotels && trip.plans.Hotels.number > 0 && (
                                        <li>{trip.plans.Hotels.number} Hotel{trip.plans.Hotels.number >1 ? 's' : ''}</li>
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
