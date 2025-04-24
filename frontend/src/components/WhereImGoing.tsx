import React, { useState, useEffect } from "react";
import "../css/WhereImGoing.css";
import { formatDate, getImageString, uploadImage } from "../utils/utils.tsx";

// Define TypeScript interfaces for better type safety
interface PlanItem {
  title: string;
  description: string;
  image: string;
  id?: string; // Adding optional id for tracking items
}

interface PlanCategory {
  number: number;
  [key: string]: any; // This will hold the arrays like 'activities', 'restaurants', etc.
}

interface Trip {
  Destination: string;
  Date: string;
  Image: string;
  Plans: {
    Activities: PlanCategory;
    Restaurants: PlanCategory;
    Places: PlanCategory;
    Hotels: PlanCategory;
  };
}

interface UserData {
  name: string;
  username: string;
  email: string;
  profileimage: string;
}

const WhereImGoing = () => {
    let _ud: any = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud);

    // State management
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTripEditModalOpen, setIsTripEditModalOpen] = useState(false);
    const [selectedDest, setSelectedDest] = useState<Trip | null>(null);
    const [editingCategory, setEditingCategory] = useState("");
    const [currentTrips, setCurrentTrips] = useState<Trip[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

    // Form states
    const [category, setCategory] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    // Modal control functions
    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => {
        setIsAddModalOpen(false);
        resetAddForm();
    };

    const openEditModal = (cat: string, item?: PlanItem, index?: number) => {
        setCategory(cat);
        setEditingCategory(cat);
        
        if (item && index !== undefined) {
            // We're editing an existing item
            setIsEditing(true);
            setCurrentItemIndex(index);
            setTitle(item.title);
            setDescription(item.description);
            setImagePreview(item.image || "");
        } else {
            // We're adding a new item
            setIsEditing(false);
            setCurrentItemIndex(null);
            resetEditForm();
            setCategory(cat);
        }
        
        setIsEditModalOpen(true);
    };
    
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        resetEditForm();
    };

    const openTripEditModal = () => {
        if (selectedDest) {
            setDestination(selectedDest.Destination);
            setDate(selectedDest.Date);
            setImagePreview(selectedDest.Image || "");
        }
        setIsTripEditModalOpen(true);
    };

    const closeTripEditModal = () => {
        setIsTripEditModalOpen(false);
    };

    // Form reset functions
    const resetAddForm = () => {
        setDestination("");
        setDate("");
        setImage(null);
        setImagePreview("");
    };

    const resetEditForm = () => {
        setTitle("");
        setDescription("");
        setImage(null);
        setImagePreview("");
        setCategory("");
    };

    useEffect(() => {
        // fetch or set user data
        setTimeout(() => {
            if (ud) {
                setUserData({
                    name: ud.firstName,
                    username: ud.username,
                    email: ud.email,
                    profileimage: ud.profileimage,
                });
            }
        }, 1000);
    }, []);
      
    useEffect(() => {
        if (userData) {
            console.log(userData.username);
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const trips = await getTrips(userData.username);
                    setCurrentTrips(trips);
                } catch (err) {
                    console.error("Error fetching trips:", err);
                    setError("Failed to load trips. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };
        
            fetchData();
        }
    }, [userData]); 

    const formatDateString = (dateString) => {
        if (!dateString) return '';
        
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) {
            // If date is invalid, just return the original string
            return dateString;
          }
          
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (e) {
          // If there's any error, return the original string
          return dateString;
        }
      };

    async function formatData(): Promise<any> {
        try {
            let filename = "";
            if (image) {
                const base64 = await getImageString(image);
                filename = await uploadImage(base64);
            }
            
            const emptyPlans = createEmptyPlans();

            return {
                destination: destination,
                date: date,
                plans: emptyPlans,
                image: filename
            };
        } catch (err) {
            console.error("Error formatting data:", err);
            throw new Error("Failed to prepare trip data");
        }
    }

    function createEmptyPlans(): any {
        return {
            Activities: {
                number: 0,
                activities: []
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
    }

    async function deleteData(data: { destination: string, date: string }) {
        try {
            const jsTripData = JSON.stringify(data);

            const response = await fetch(`https://ohtheplacesyoullgo.space/api/deletetrip/${userData.username}`, {
                method: "DELETE",
                body: jsTripData,
                headers: { "Content-Type": "application/json"}
            });

            const text = await response.text();
            console.log("RAW:", text);
            const res = JSON.parse(await response.text());

            if (res.status !== "Success"){
                throw new Error(res.message || "Failed to delete trip");
            }

            return res;
        } catch (err){
            console.error("Error sending data:", err);
            setError("Failed to delete trip. Please try again.");
            throw err;
        }
    }

    async function sendData(data: any) {
        if (!userData) return;
        
        try {
            const jsTripData = JSON.stringify(data);
            
            const response = await fetch(`https://ohtheplacesyoullgo.space/api/addtrip/${userData.username}`, {
                method: "PUT",
                body: jsTripData,
                headers: { "Content-Type": "application/json" },
            });
        
            const res = JSON.parse(await response.text());

            if (res.status !== "Success") {
                throw new Error(res.message || "Failed to add trip");
            }
            
            return res;
        } catch (err) {
            console.error("Error sending data:", err);
            setError("Failed to add trip. Please try again.");
            throw err;
        }
    }
    
    async function editData(categoryName: string, item: PlanItem, isNewItem: boolean, itemIndex?: number) {
        if (!selectedDest || !userData) {
            return;
        }

        try {
            const oldTrip = selectedDest;
            const oldPlans = oldTrip.Plans;

            const newPlans = { ...oldPlans };
            const categoryKey = categoryName.toLowerCase(); // Convert "Activity" to "activities"
            
            // Make sure the category exists in the plans
            if (!newPlans[categoryName]) {
                throw new Error(`Category ${categoryName} not found in plans`);
            }
            
            if (isNewItem) {
                // Adding a new item
                newPlans[categoryName] = {
                    ...newPlans[categoryName],
                    number: newPlans[categoryName].number + 1,
                    [categoryKey]: [...(newPlans[categoryName][categoryKey] || []), item]
                };
            } else if (itemIndex !== undefined) {
                // Editing an existing item
                const items = [...newPlans[categoryName][categoryKey]];
                items[itemIndex] = item;
                
                newPlans[categoryName] = {
                    ...newPlans[categoryName],
                    [categoryKey]: items
                };
            }

            const edit = {
                destination: oldTrip.Destination,
                date: oldTrip.Date,
                newdate: oldTrip.Date,
                newplans: newPlans,
                newimage: oldTrip.Image
            };

            const response = await fetch(`https://ohtheplacesyoullgo.space/api/edittrip/${userData.username}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(edit)
            });

            const res = await response.json();

            if (res.status !== "Success") {
                throw new Error(res.message || "Failed to edit trip");
            }

            // Refresh trips and select the updated destination
            const trips = await getTrips(userData.username);
            setCurrentTrips(trips);
            
            // Find and select the updated destination
            const updatedDest = trips.find(t => 
                t.Destination === oldTrip.Destination && t.Date === oldTrip.Date
            );
            setSelectedDest(updatedDest || null);
            
            return res;
        } catch (err) {
            console.error("Error editing trip:", err);
            setError("Failed to update trip. Please try again.");
            throw err;
        }
    }

    async function updateTripDetails() {
        if (!selectedDest || !userData) return;
        
        try {
            setIsLoading(true);
            
            let imageUrl = selectedDest.Image;
            if (image) {
                const base64 = await getImageString(image);
                imageUrl = await uploadImage(base64);
            }
            
            const edit = {
                destination: selectedDest.Destination,
                date: selectedDest.Date,
                newdate: date,
                newplans: selectedDest.Plans,
                newimage: imageUrl,
                newdestination: destination
            };

            const response = await fetch(`https://ohtheplacesyoullgo.space/api/edittrip/${userData.username}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(edit)
            });

            const res = await response.json();

            if (res.status !== "Success") {
                throw new Error(res.message || "Failed to update trip details");
            }

            // Refresh trips and select the updated destination
            const trips = await getTrips(userData.username);
            setCurrentTrips(trips);
            
            // Find and select the updated destination with potentially new name
            const updatedDest = trips.find(t => 
                (t.Destination === destination || t.Destination === selectedDest.Destination) && 
                (t.Date === date || t.Date === selectedDest.Date)
            );
            
            setSelectedDest(updatedDest || null);
            closeTripEditModal();
        } catch (err) {
            console.error("Error updating trip details:", err);
            setError("Failed to update trip details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleEditFormSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            console.log("Editing Trip for category:", category);
            
            // Prepare the item to add or edit
            let imageUrl = imagePreview;
            if (image) {
                const base64 = await getImageString(image);
                imageUrl = await uploadImage(base64);
            }
            
            const item: PlanItem = {
                title: title,
                description: description,
                image: imageUrl
            };
    
            await editData(category, item, !isEditing, isEditing ? currentItemIndex! : undefined);
            closeEditModal();
        } catch (err) {
            console.error("Error in editTrip:", err);
            setError("Failed to edit trip. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleTripEditSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        await updateTripDetails();
    }

    async function deleteTrip(destination: string, date): Promise<void> {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Deleting Trip");
            const formattedData = { destination, date };
            await deleteData(formattedData);
            
            if (userData) {
                const trips = await getTrips(userData.username);
                setCurrentTrips(trips);
            }
        } catch(err) {
            console.error("Error in deleteTrip:", err);
            setError("Failed to delete trip. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function addTrip(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            console.log("Adding Trip");
            const formattedData = await formatData();
            await sendData(formattedData);
            closeAddModal();
            
            // Refresh the trips list
            if (userData) {
                const trips = await getTrips(userData.username);
                setCurrentTrips(trips);
            }
        } catch (err) {
            console.error("Error in addTrip:", err);
            setError("Failed to add trip. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function getTrips(user: string): Promise<Trip[]> {
        try {
            const response = await fetch(`https://ohtheplacesyoullgo.space/api/gettrips/${user}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
        
            const res = JSON.parse(await response.text());

            if (res.status === "Success") {
                return res.trips;
            }
            
            throw new Error(res.message || "Failed to get trips");
        } catch (err) {
            console.error("Error getting trips:", err);
            setError("Failed to load trips. Please try again.");
            throw err;
        }
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            
            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    setImagePreview(e.target.result);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const destClick = (destination: string) => {
        if (!currentTrips) return;
        
        const selectedDest = currentTrips.find((trip: Trip) => trip.Destination === destination);
        setSelectedDest(selectedDest || null);
        console.log(selectedDest);
    };

    // Card carousel component
    const Carousel = ({ data, category, openEditModal }: { 
        data: PlanCategory, 
        category: string,
        openEditModal: (cat: string, item?: PlanItem, index?: number) => void 
    }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
    
        // Get the appropriate array based on category
        const categoryKey = category.toLowerCase() === "restaurants" ? "restaurants" :
                            category.toLowerCase() === "activities" ? "activities" :
                            category.toLowerCase() === "places" ? "places" :
                            category.toLowerCase() === "hotels" ? "hotels" : "";
        
        const items = data[categoryKey] || [];
        const carousel = [...items, { isAddNew: true }];
        const total = items.length + 1;
    
        const prevIndex = (currentIndex - 1 + total) % total;
        const nextIndex = (currentIndex + 1) % total;
        const handleNext = () => {setCurrentIndex(nextIndex)};
        const handlePrev = () => {setCurrentIndex(prevIndex)};

        const visible = [carousel[prevIndex], carousel[currentIndex], carousel[nextIndex]];
    
        return (
            <div className="plans">
                <div className="plansTitle">{category}</div>
    
                <div className="controls">
                    <button onClick={handlePrev}>&lt;</button>
                    <button onClick={handleNext}>&gt;</button>
                </div>
    
                <div className="carousel">
                    {visible.map((item, idx) => {
                        const position = idx === 0 ? "prev" : idx === 1 ? "active" : "next";
                        const actualIndex = idx === 0 ? prevIndex : idx === 1 ? currentIndex : nextIndex;
                    
                        const handleCardClick = () => {
                            // Only handle clicks on the active card (middle one)
                            if (idx !== 1) return;
                            
                            if (item.isAddNew) {
                                console.log("Adding New");
                                openEditModal(category);
                            } else {
                                console.log("Editing");
                                const itemIndex = actualIndex < items.length ? actualIndex : null;
                                openEditModal(category, item, itemIndex);
                            }
                        };
                    
                        return (
                            <div
                                className={`cards ${position}`}
                                key={idx}
                                onClick={handleCardClick}
                                style={{ cursor: idx === 1 ? 'pointer' : 'default' }}
                            >
                                {item.isAddNew ? (
                                    <>
                                        <div className="imagePlaceholder"></div>
                                        <p>Add New</p>
                                    </>
                                ) : (
                                    <>
                                        <h4>{item.title}</h4>
                                        <div
                                            className="imagePlaceholder"
                                            style={{
                                                background: item.image
                                                    ? `#ccc url(${item.image}) center/160% no-repeat`
                                                    : `#ccc`,
                                            }}
                                        />
                                        <p>{item.description}</p>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Show loading state
    if (isLoading && !currentTrips) {
        return <div className="loading">Loading your trips...</div>;
    }

    return (
        <div>
            {error && <div className="error-banner">{error}</div>}
            
            {selectedDest ? (
                <div className="destinationLayout">
                    <div className="tripHeader">
                        <div className="buttton" onClick={() => setSelectedDest(null)}>
                            &lt;
                        </div>
                        <br />
                        <br />
                        
                        <div className="tripDetails">
                            <div className="tripInfo">
                                <button 
                                    className="buttton" 
                                    onClick={openTripEditModal}
                                >🖉
                                </button>

                                <h2>{selectedDest.Destination}</h2>
                                <p>{formatDateString(selectedDest.Date)}</p>
                            </div>
                            
                            {selectedDest.Image && (
                                <div 
                                    className="tripImage"
                                    style={{
                                        background: `#ccc url(${selectedDest.Image}) center/cover no-repeat`,
                                        width: "150px",
                                        height: "100px",
                                        borderRadius: "5px"
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    
                    <div className="plansContainer">
                        <Carousel category="Activities" data={selectedDest.Plans.Activities} openEditModal={openEditModal} ></Carousel>
                        <Carousel category="Restaurants" data={selectedDest.Plans.Restaurants} openEditModal={openEditModal} ></Carousel>
                        <Carousel category="Places" data={selectedDest.Plans.Places} openEditModal={openEditModal} ></Carousel>
                        <Carousel category="Hotels" data={selectedDest.Plans.Hotels} openEditModal={openEditModal} ></Carousel>

                        {isEditModalOpen && category === editingCategory && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close-button" onClick={closeEditModal}>
                                        &times;
                                    </span>
                                    <form onSubmit={handleEditFormSubmit}>
                                        <h2>{isEditing ? `Edit ${category}` : `Add ${category}`}</h2>
                                        <label>
                                            Title:
                                            <input 
                                                type="text" 
                                                name="title" 
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label>
                                            Description:
                                            <input 
                                                type="text" 
                                                name="description" 
                                                value={description} 
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </label>
                                        <br />
                                        <label>
                                            Upload Image:
                                            <input 
                                                type="file" 
                                                name="image" 
                                                accept="image/*" 
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        {imagePreview && (
                                            <div className="image-preview">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    style={{ maxWidth: "100%", maxHeight: "150px" }} 
                                                />
                                            </div>
                                        )}
                                        <br />
                                        <button 
                                            type="submit" 
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Submitting...' : isEditing ? 'Update' : 'Add'}
                                        </button>
                                        {error && <p className="error-message">{error}</p>}
                                    </form>
                                </div>
                            </div>
                        )}

                        {isTripEditModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close-button" onClick={closeTripEditModal}>
                                        &times;
                                    </span>
                                    <form onSubmit={handleTripEditSubmit}>
                                        <h2>Edit Trip Details</h2>
                                        <label>
                                            Destination:
                                            <input 
                                                type="text" 
                                                name="destination" 
                                                value={destination} 
                                                onChange={(e) => setDestination(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label>
                                            Date:
                                            <input 
                                                type="date" 
                                                name="date" 
                                                value={date} 
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label>
                                            Upload Image:
                                            <input 
                                                type="file" 
                                                name="image" 
                                                accept="image/*" 
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        {imagePreview && (
                                            <div className="image-preview">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    style={{ maxWidth: "100%", maxHeight: "150px" }} 
                                                />
                                            </div>
                                        )}
                                        <br />
                                        <button 
                                            type="submit" 
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Updating...' : 'Update Trip'}
                                        </button>
                                        {error && <p className="error-message">{error}</p>}
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="pageLayout">
                    <button className="buttton" onClick={openAddModal}>
                        +
                    </button>

                    {isAddModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close-button" onClick={closeAddModal}>
                                    &times;
                                </span>
                                <form onSubmit={addTrip}>
                                    <h2>Where I'm Going Form</h2>
                                    <label>
                                        Destination:
                                        <input 
                                            type="text" 
                                            name="destination" 
                                            value={destination} 
                                            onChange={(e) => setDestination(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Date:
                                        <input 
                                            type="date" 
                                            name="date" 
                                            value={date} 
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Upload Image:
                                        <input 
                                            type="file" 
                                            name="image" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                style={{ maxWidth: "100%", maxHeight: "150px" }} 
                                            />
                                        </div>
                                    )}
                                    <br />
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                    {error && <p className="error-message">{error}</p>}
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="destinationContainer">
                        {currentTrips && currentTrips.length > 0 ? (
                            currentTrips.map((trip) => (
                                <div className="destination" key={trip.Destination} onClick={() => {
                                        console.log("CLICKED", trip.Destination);
                                        destClick(trip.Destination);
                                    }
                                }>
                                    <span className="close-button" onClick={() => deleteTrip(trip.destination, trip.date)}>
                                        &times;
                                    </span>

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
                                        {trip.Plans.Activities && trip.Plans.Activities.number > 0 ? (
                                            <li>{trip.Plans.Activities.number} {trip.Plans.Activities.number === 1 ? 'Activity' : 'Activities'}</li>
                                        ) : (
                                            <li>&nbsp;</li>
                                        )}
                                        {trip.Plans.Restaurants && trip.Plans.Restaurants.number > 0 ? (
                                            <li>{trip.Plans.Restaurants.number} Restaurant{trip.Plans.Restaurants.number > 1 ? 's' : ''}</li>
                                        ) : (
                                            <li>&nbsp;</li>
                                        )}
                                        {trip.Plans.Places && trip.Plans.Places.number > 0 ? (
                                            <li>{trip.Plans.Places.number} Place{trip.Plans.Places.number > 1 ? 's' : ''}</li>
                                        ) : (
                                            <li>&nbsp;</li>
                                        )}
                                        {trip.Plans.Hotels && trip.Plans.Hotels.number > 0 ? (
                                            <li>{trip.Plans.Hotels.number} Hotel{trip.Plans.Hotels.number > 1 ? 's' : ''}</li>
                                        ) : (
                                            <li>&nbsp;</li>
                                        )}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <div className="no-trips">
                                <p>You haven't added any trips yet. Click the + button to get started!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhereImGoing;