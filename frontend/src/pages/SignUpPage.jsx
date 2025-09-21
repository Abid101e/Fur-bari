import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SignUpPage.css";
import petImage from "../assets/pet.jpg";
import catImage from "../assets/cat.jpg";
import dogImage from "../assets/dog.jpg";

function SignUpPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    { src: petImage, alt: "Pet Care" },
    { src: dogImage, alt: "Dog" },
    { src: catImage, alt: "Cat" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sign-in-page">
      <div className="auth-container">
        <div className="sign-in-left">
          <div className="slideshow-container">
            {images.map((image, index) => (
              <div
                key={index}
                className={`slide ${index === currentImage ? "active" : ""}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="slideshow-image"
                />
              </div>
            ))}
            <div className="slideshow-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentImage ? "active" : ""}`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="sign-in-right">
          <div className="sign-in-form-container">
            <div className="logo-container">
              <img
                src={logo}
                alt="Fur-bari logo"
                className="logo"
                onError={(e) => {
                  console.error("Logo failed to load");
                  e.target.style.display = "none";
                }}
              />
            </div>
            <h1>Create Account</h1>
            <p className="subtitle">
              Join Fur-bari and connect with pet lovers
            </p>
            <form className="sign-in-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" required /> I agree to the{" "}
                  <Link to="/terms">Terms of Service</Link> and{" "}
                  <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>
              <button type="submit" className="sign-in-button">
                Create Account
              </button>
              <p className="signup-prompt">
                Already have an account? <Link to="/signin">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
