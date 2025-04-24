// src/components/WhereImGoing.tsx
import React, { useState, useEffect } from "react";
import "../css/WhereImGoing.css";
import { getImageString, uploadImage } from "../utils/utils.tsx";

// ----- TypeScript interfaces -----
interface Trip {
  Destination: string;
  Date:        string;
  Image:       string;
}

interface UserData {
  name:         string;
  username:     string;
  email:        string;
  profileimage: string;
}

// ----- Component -----
const WhereImGoing: React.FC = () => {
  // 1) Read user_data out of localStorage synchronously
  const raw = localStorage.getItem("user_data");
  const ud  = raw ? JSON.parse(raw) : null;

  // 2) State hooks
  const [userData, setUserData]         = useState<UserData | null>(null);
  const [currentTrips, setCurrentTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [destination, setDestination]       = useState("");
  const [date, setDate]                     = useState("");
  const [image, setImage]                   = useState<File | null>(null);
  const [imagePreview, setImagePreview]     = useState("");

  // 3) On mount: stash userData
  useEffect(() => {
    if (ud) {
      setUserData({
        name:         ud.firstName,
        username:     ud.username,
        email:        ud.email,
        profileimage: ud.profileimage,
      });
    } else {
      console.warn("⚠️ No user_data in localStorage");
    }
  }, []);

  // 4) When userData arrives, fetch trips
  useEffect(() => {
    if (!userData) return;
    fetchTrips();
  }, [userData]);

  async function fetchTrips() {
    setIsLoading(true);
    setError(null);
    try {
      const trips = await getTrips(userData!.username);
      setCurrentTrips(trips);
    } catch (err: any) {
      console.error("fetchTrips error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }

  }

  // 5) GET /gettrips — treat 409 as “no trips”
  async function getTrips(user: string): Promise<Trip[]> {
    const url  = `https://ohtheplacesyoullgo.space/api/gettrips/${user}`;
    const resp = await fetch(url, {
      method:  "GET",
      headers: { "Content-Type": "application/json" },
    });

    // parse body safely
    const text = await resp.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      console.error("getTrips: invalid JSON:", text);
      throw new Error("Invalid JSON from getTrips()");

    }

    // 409 = “no trips yet” → return []
    if (resp.status === 409) {
      return [];
    }
    if (!resp.ok) {
      throw new Error(body.message || `getTrips failed (${resp.status})`);
    }
    if (body.status === "Success" && Array.isArray(body.trips)) {
      return body.trips;
    }
    throw new Error(body.message || "getTrips returned bad payload");
  }

  // 6) Build empty Plans if you ever need — placeholder for future
  function createEmptyPlans() {
    return {};
  }

  // 7) Format a new‐trip payload with UPPERCASE keys
  async function formatNewTripPayload(): Promise<Trip> {
    let filename = "";
    if (image) {
      const b64      = await getImageString(image);
      filename       = await uploadImage(b64);
    }
    return {
      Destination: destination,
      Date:        date,
      Image:       filename,
    };
  }

  // 8) Reset your Add form fields
  function resetAddForm() {
    setDestination("");
    setDate("");
    setImage(null);
    setImagePreview("");
  }

  // 9) SUBMIT new trip (optimistic update)
  async function addTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!userData) return;

    setIsLoading(true);
    setError(null);
    try {
      const payload = await formatNewTripPayload();

      const resp = await fetch(
        `https://ohtheplacesyoullgo.space/api/addtrip/${userData.username}`,
        {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      );
      const body = await resp.json();
      if (body.status !== "Success") {
        throw new Error(body.message || "addtrip failed");
      }

      // Optimistic UI: prepend the new trip
      setCurrentTrips(prev => [payload, ...prev]);

      // clear & close form
      resetAddForm();
      setIsAddModalOpen(false);

    } catch (err: any) {
      console.error("addTrip error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // 10) DELETE trip with UPPERCASE keys
  async function deleteTrip(dst: string, dt: string) {
    if (!userData) return;
    setIsLoading(true);
    setError(null);
  
    try {
      // lowercase keys that the API expects:
      const payload = {
        destination: dst,
        date:        dt
      };
      console.log("→ DELETE payload:", payload);
  
      const resp = await fetch(
        `https://ohtheplacesyoullgo.space/api/deletetrip/${userData.username}`,
        {
          method:  "DELETE",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      );
  
      // log raw response in case it still errors
      const text = await resp.text();
      console.log("← DELETE raw response:", text);
  
      const body = JSON.parse(text);
      if (resp.status !== 200 || body.status !== "Success") {
        throw new Error(body.error || body.message || `deletetrip failed (${resp.status})`);
      }
  
      // remove the trip from local state
      setCurrentTrips(prev =>
        prev.filter(t => !(t.Destination === dst && t.Date === dt))
      );
  
    } catch (err: any) {
      console.error("deleteTrip error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  

  // 11) File input → preview
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

  // 12) Make human-readable date
  function formatDateString(d: string) {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("en-US", {
      year:  "numeric",
      month: "long",
      day:   "numeric",
    });
  }

  // 13) RENDER …
  if (isLoading && currentTrips.length === 0) {
    return <div className="loading">Loading your trips…</div>;
  }

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      {/* ADD-TRIP BUTTON + MODAL */}
      <button className="buttton" onClick={() => setIsAddModalOpen(true)}>
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
                  style={{ maxWidth: "120px", margin: "0.5rem 0" }}
                />
              )}
              <button disabled={isLoading}>
                {isLoading ? "Submitting…" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TRIP LIST */}
      <div className="destinationContainer">
        {currentTrips.map(trip => (
          <div
            key={`${trip.Destination}—${trip.Date}`}
            className="destination"
          >
            <span
              className="close-button"
              onClick={() => deleteTrip(trip.Destination, trip.Date)}
            >
              &times;
            </span>
            <h2 className="destinationTitle">
              {trip.Destination}
            </h2>
            <p>{formatDateString(trip.Date)}</p>
            <div
              className="imagePlaceholder"
              style={{
                background: trip.Image
                  ? `#ccc url(${trip.Image}) center/cover no-repeat`
                  : "#ccc",
              }}
            />
            {/* you can re-insert your plans summary here when you’re ready */}
          </div>
        ))}
        {currentTrips.length === 0 && !isLoading && (
          <div className="no-trips">
            <p>You haven’t added any trips yet. Click + to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhereImGoing;