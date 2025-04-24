import React, { useState, useEffect } from "react";
import "../css/WhereImGoing.css";
import { formatDate, getImageString, uploadImage } from "../utils/utils.tsx";

const WhereImGoing = () => {
    let _ud: any = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDest, setSelectedDest] = useState<any>(null)
    const [currentTrips, setCurrentTrips] = useState(null);
    const [username, setUsername] = useState<string>("");
    const [tripData, setTripData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [destination, setDestination] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [image, setImage] = useState<File>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        // fetch or set data
        setTimeout(() => {
            setUserData({
                name: ud.firstName,
                username: ud.username,
                email: ud.email,
                profileimage: ud.profileimage,
            });
        }, 1000);
      }, []);
      
    useEffect(() => {
        if (userData) {
            console.log(userData.username)
            var trips;
            const fetchData = async () => {
            trips = await getTrips(userData.username);
            setCurrentTrips(trips);
          };
        
          fetchData();
        }
        
      }, [userData]); 

    async function formatData() : Promise<any>{
        const base64 = await getImageString(image);
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
        var trips = await getTrips(userData.username);
        setCurrentTrips(trips);
    }

    async function getTrips(user: string) : Promise<any> {
        const response = await fetch(`https://ohtheplacesyoullgo.space/api/gettrips/${user}`, {
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
        }
    }

    console.log("DATA");

    const destClick = (destination: string) => {
        const selectedDest = currentTrips.find((trip) => trip.Destination === destination);
        setSelectedDest(selectedDest);
        console.log(selectedDest);
    };

    //Card carousel
    const Carousel = ({ data, category }: {data: { number: number, items: any[] }, category: string}) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const items = data?.items || [];
        if (!items.length){
            return (
                <div>
                    <div className="plansTitle">{category}</div>
                    <div className="plans">
                        <div className="cards">
                            <div className="imagePlaceholder"></div>
                            <p>Add New</p>
                        </div>
                    </div>
                </div>
            )
        }

        const handleNext = () => {
            setCurrentIndex((prevIndex: number) => (prevIndex + 1) % data.length);
        };

        const handlePrev = () => {
            setCurrentIndex((prevIndex: number) => (prevIndex - 1 + data.length) % data.length);
        };

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
                        <Carousel category="Activities" data={selectedDest.Plans.Activities}></Carousel>

                        <Carousel category="Restraunts" data={selectedDest.Plans.Restaurants}></Carousel>

                        <Carousel category="Places" data={selectedDest.Plans.Places}></Carousel>

                        <Carousel category="Hotels" data={selectedDest.Plans.Hotels}></Carousel>
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
                        {currentTrips && currentTrips.map((trip) => (
                            <div className="destination" key={trip.Destination} onClick={() => {
                                    console.log("CLICKED", trip.Destination);
                                    destClick(trip.Destination)}
                                }>
                                <h2 className="destinationTitle">{trip.Destination}</h2>
                                <div className="imagePlaceholder"
                                    style={{
                                        background: trip.Image
                                            ? `#ccc url(${trip.Image}) center/160% no-repeat`
                                            : `#ccc`,
                                    }}>
                                </div>

                                <h3 className="destinationSubtitle">You've Planned:</h3>
                                <ul className="destinationList">
                                    {trip.Plans.Activities && trip.Plans.Activities.number > 0 && (
                                        <li>{trip.Plans.Activities.number} {trip.Plans.Activities.number === 1 ? 'Activity' : 'Activities'}</li>
                                    )}
                                    {trip.Plans.Restaurants && trip.Plans.Restaurants.number > 0 && (
                                        <li>{trip.Plans.Restaurants.number} Restaurant{trip.Plans.Restaurants.number >1 ? 's' : ''}</li>
                                    )}
                                    {trip.Plans.Places && trip.Plans.Places.number > 0 && (
                                        <li>{trip.Plans.Places.number} Place{trip.Plans.Places.number >1 ? 's' : ''}</li>
                                    )}
                                    {trip.Plans.Hotels && trip.Plans.Hotels.number > 0 && (
                                        <li>{trip.Plans.Hotels.number} Hotel{trip.Plans.Hotels.number >1 ? 's' : ''}</li>
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
