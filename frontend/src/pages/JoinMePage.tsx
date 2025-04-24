// src/pages/JoinMePage.tsx
import React from "react";
import "../css/JoinMe.css";

interface Post {
  id: number;
  user: string;
  avatar: string;
  image: string;
  caption: string;
}

const dummyPosts: Post[] = [
  {
    id: 1,
    user: "Jane Doe",
    avatar: "/images/avatar-1.png",      // ← no “joinme” folder
    image:  "/images/post-1.jpg",        // ← matches post-1.jpg
    caption: "Exploring the mountains! Can’t wait for company 🏞️",
  },
  {
    id: 2,
    user: "John Smith",
    avatar: "/images/avatar-2.png",
    image:  "/images/post-2.jpg",
    caption: "Beach trip planned for next week — DM me to join! 🌊☀️",
  },
  {
    id: 3,
    user: "TravelGuru",
    avatar: "/images/avatar-3.png",
    image:  "/images/post-1.jpg",        // ← or add a post-3.jpg if you have one
    caption: "Road trip vibes 🚗💨 #JoinMe",
  },
];



const JoinMePage: React.FC = () => (
  <div className="joinme-page">
    <h2 className="feed-title">Join Me Feed</h2>
    <div className="feed">
      {dummyPosts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <img
              src={post.avatar}
              alt={`${post.user} avatar`}
              className="avatar"
            />
            <span className="username">{post.user}</span>
          </div>
          <img
            src={post.image}
            alt="Trip preview"
            className="post-image"
          />
          <div className="post-body">
            <p className="caption">
              <strong>{post.user}</strong> {post.caption}
            </p>
            <button className="join-btn">Join Trip</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default JoinMePage;
