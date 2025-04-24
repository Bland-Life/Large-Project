// src/pages/JoinMePage.tsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/JoinMe.css";

interface Post {
  id: number;
  user: string;
  avatar: string;
  image: string;
  caption: string;
}

// dummy data you can swap out later
const dummyPosts: Post[] = [
  {
    id: 1,
    user: "Jane Doe",
    avatar: "https://via.placeholder.com/50",
    image: "https://via.placeholder.com/600x400",
    caption: "Exploring the mountains! Can’t wait for company 🏞️",
  },
  {
    id: 2,
    user: "John Smith",
    avatar: "https://via.placeholder.com/50",
    image: "https://via.placeholder.com/600x400",
    caption: "Beach trip planned for next week — DM me to join! 🌊☀️",
  },
  {
    id: 3,
    user: "TravelGuru",
    avatar: "https://via.placeholder.com/50",
    image: "https://via.placeholder.com/600x400",
    caption: "Road trip vibes 🚗💨 #JoinMe",
  },
];

const JoinMePage: React.FC = () => {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Join Me Feed</h2>
      <div className="row">
        {dummyPosts.map((post) => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header d-flex align-items-center">
                <img
                  src={post.avatar}
                  alt={`${post.user} avatar`}
                  className="rounded-circle mr-3"
                  style={{ width: 50, height: 50 }}
                />
                <strong className="ml-2">{post.user}</strong>
              </div>
              <img src={post.image} className="card-img-top" alt="Trip" />
              <div className="card-body">
                <p className="card-text">{post.caption}</p>
                <button className="btn btn-primary btn-sm">Join Trip</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinMePage;
