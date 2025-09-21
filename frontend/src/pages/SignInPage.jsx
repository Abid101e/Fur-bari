import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SignInPage.css";
import petImage from "../assets/pet.jpg";
import catImage from "../assets/cat.jpg";
import dogImage from "../assets/dog.jpg";

function SignInPage() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    { src: petImage, alt: "Pet Care" },
    { src: dogImage, alt: "Dog" },
    { src: catImage, alt: "Cat" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="sign-in-page">
      <div className="auth-container">
        {/* Slideshow Section */}
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

        {/* Sign-in Form Section */}
        <div className="sign-in-right">
          <div className="sign-in-form-container">
            <h1>Welcome Back!</h1>
            <p className="subtitle">Sign in to continue to Fur-bari</p>

            <form className="sign-in-form">
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
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="sign-in-button">
                Sign In
              </button>

              <p className="signup-prompt">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
