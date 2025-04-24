// src/components/WhereImGoing.tsx

import React, { useState, useEffect } from "react";
import "../css/WhereImGoing.css";
import { getImageString, uploadImage } from "../utils/utils.tsx";

// --- Your TS interfaces ---
interface PlanItem {
  title: string;
  description: string;
  image: string;
  id?: string;
}
interface PlanCategory {
  number: number;
  [key: string]: any;
}
interface Trip {
  Destination: string;
  Date:        string;
  Image:       string;
  Plans: {
    Activities:   PlanCategory;
    Restaurants:  PlanCategory;
    Places:       PlanCategory;
    Hotels:       PlanCategory;
  };
}
interface UserData {
  name:         string;
  username:     string;
  email:        string;
  profileimage: string;
}

const WhereImGoing = () => {
  // --- parse user_data once, synchronously ---
  const raw = localStorage.getItem("user_data");
  const ud   = raw ? JSON.parse(raw) : null;

  // --- state hooks ---
  const [userData, setUserData]         = useState<UserData | null>(null);
  const [currentTrips, setCurrentTrips] = useState<Trip[] | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [destination, setDestination]       = useState("");
  const [date, setDate]                     = useState("");
  const [image, setImage]                   = useState<File | null>(null);
  const [imagePreview, setImagePreview]     = useState("");

  // --- on mount: stash userData immediately ---
  useEffect(() => {
    if (ud) {
      setUserData({
        name:         ud.firstName,
        username:     ud.username,
        email:        ud.email,
        profileimage: ud.profileimage,
      });
    } else {
      console.warn("⚠️  no user_data found in localStorage");
    }
  }, []);

  // --- whenever we get a valid user, fetch trips ---
  useEffect(() => {
    if (!userData) return;

    const fetchTrips = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const trips = await getTrips(userData.username);
        console.log("✅ fetched trips:", trips);
        setCurrentTrips(trips);
      } catch (err: any) {
        console.error("❌ getTrips error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [userData]);

  // --- helper to build empty Plans object ---
  function createEmptyPlans() {
    return {
      Activities:   { number: 0, activities: [] },
      Restaurants:  { number: 0, restaurants: [] },
      Places:       { number: 0, places: [] },
      Hotels:       { number: 0, hotels: [] },
    };
  }

  // --- read file input and preview it ---
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // --- format add-trip payload with UPPERCASE keys ---
  async function formatNewTripPayload() {
    let filename = "";
    if (image) {
      const b64      = await getImageString(image);
      filename       = await uploadImage(b64);
    }
    return {
      Destination: destination,
      Date:        date,
      Plans:       createEmptyPlans(),
      Image:       filename,
    };
  }

  // --- call your addtrip endpoint ---
  async function addTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!userData) return;

    setIsLoading(true);
    setError(null);
    try {
      const payload = await formatNewTripPayload();
      console.log("PUT addtrip payload:", payload);

      const resp = await fetch(
        `https://ohtheplacesyoullgo.space/api/addtrip/${userData.username}`,
        {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      );
      const body = await resp.json();
      console.log("addtrip response:", body);

      if (body.status !== "Success") {
        throw new Error(body.message || "addtrip failed");
      }

      setIsAddModalOpen(false);

      // refresh
      const trips = await getTrips(userData.username);
      setCurrentTrips(trips);

    } catch (err: any) {
      console.error("addTrip error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // --- deleteTrip with uppercase keys ---
  async function deleteTrip(dst: string, dt: string) {
    if (!userData) return;
    setIsLoading(true);
    setError(null);

    try {
      const payload = { Destination: dst, Date: dt };
      console.log("DELETE deletetrip payload:", payload);

      const resp = await fetch(
        `https://ohtheplacesyoullgo.space/api/deletetrip/${userData.username}`,
        {
          method:  "DELETE",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      );
      const body = await resp.json();
      console.log("deletetrip response:", body);

      if (body.status !== "Success") {
        throw new Error(body.message || "deletetrip failed");
      }

      // refresh
      const trips = await getTrips(userData.username);
      setCurrentTrips(trips);
    } catch (err: any) {
      console.error("deleteTrip error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getTrips(user: string): Promise<Trip[]> {
    const url = `https://ohtheplacesyoullgo.space/api/gettrips/${user}`;
    console.log("GET trips URL:", url);

    // fire off the request
    const resp = await fetch(url, {
      method:  "GET",
      headers: { "Content-Type": "application/json" },
    });

    // grab the raw text so we can log it on error or parse it
    const text = await resp.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch (parseErr) {
      console.error("⚠️ getTrips: invalid JSON:", text);
      throw new Error("Invalid JSON returned from getTrips()");
    }

    // if the server says “409 Conflict” -> no trips yet
    if (resp.status === 409) {
      console.info("ℹ️ getTrips: no trips found for", user);
      return [];
    }

    // any other non-2xx code is a real error
    if (!resp.ok) {
      console.error("⚠️ getTrips: HTTP", resp.status, body);
      throw new Error(body.message || `getTrips failed with status ${resp.status}`);
    }

    // finally, normal success path
    if (body.status === "Success" && Array.isArray(body.trips)) {
      return body.trips;
    }

    // fallback if shape isn’t what we expect
    throw new Error(body.message || "getTrips returned an unexpected payload");
  }

  // --- rendering ---
  if (isLoading && !currentTrips) {
    return <div>Loading your trips…</div>;
  }

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      {/* DETAIL / CAROUSEL view omitted for brevity */}
      {!currentTrips || currentTrips.length === 0 ? (
        <div className="pageLayout">
          <button
            className="buttton"
            onClick={() => setIsAddModalOpen(true)}
          >
            +
          </button>

          {isAddModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close-button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  &times;
                </span>
                <form onSubmit={addTrip}>
                  <h2>Where I’m Going</h2>
                  <label>
                    Destination:
                    <input
                      required
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                    />
                  </label>
                  <label>
                    Date:
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Image:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "120px",
                        margin: "0.5rem 0",
                      }}
                    />
                  )}
                  <button disabled={isLoading}>
                    {isLoading ? "Submitting…" : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="destinationContainer">
            {currentTrips?.map(trip => (
              <div
                key={`${trip.Destination}—${trip.Date}`}
                className="destination"
              >
                <span
                  className="close-button"
                  onClick={() =>
                    deleteTrip(trip.Destination, trip.Date)
                  }
                >
                  &times;
                </span>

                <h2 className="destinationTitle">
                  {trip.Destination}
                </h2>
                <div
                  className="imagePlaceholder"
                  style={{
                    background: trip.Image
                      ? `#ccc url(${trip.Image}) center/160% no-repeat`
                      : `#ccc`,
                  }}
                />
                <p>You haven’t added any trips yet. Click + to get started!</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>{/* …your existing detail+carousel… */}</div>
      )}
    </div>
  );
};

export default WhereImGoing;
