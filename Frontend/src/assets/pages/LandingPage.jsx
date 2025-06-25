import React, { useState, useEffect } from "react";
import "../styles/LandingPage.css";

const facts = [
  {
    title: "Offside Rule",
    text: "A player is offside if they are nearer to the opponent's goal line than both the ball and the second-last opponent when the ball is played to them."
  },
  {
    title: "Yellow Card",
    text: "A yellow card is a caution given to a player by the referee for unsporting behavior, dissent, or repeated infringements."
  },
  {
    title: "Red Card",
    text: "A red card means a player is sent off the field and cannot be replaced, usually for serious foul play or violent conduct."
  },
  {
    title: "Fastest World Cup Goal",
    text: "The fastest goal in World Cup history was scored in just 11 seconds by Hakan Şükür of Turkey in 2002."
  },
  {
    title: "Throw-In Rule",
    text: "A throw-in is awarded when the whole ball passes over the touchline. Both feet must be on or behind the line, and the ball must be thrown with both hands from behind and over the head."
  },
  {
    title: "Most Goals in a Match",
    text: "The highest-scoring football match was AS Adema 149–0 SO l'Emyrne in Madagascar, 2002. All but three goals were own goals in protest!"
  },
  {
    title: "World's Oldest Club",
    text: "Sheffield FC, founded in 1857 in England, is recognized by FIFA as the world's oldest football club."
  },
  {
    title: "First World Cup",
    text: "The first FIFA World Cup was held in Uruguay in 1930, and the host nation won the tournament."
  },
  {
    title: "Largest Stadium",
    text: "Rungrado 1st of May Stadium in North Korea is the largest football stadium in the world, with a capacity of 114,000."
  },
  {
    title: "Most Red Cards in a Match",
    text: "A record 36 red cards were shown in a single match between Claypole and Victoriano Arenas in Argentina, 2011."
  }
];

const LandingPage = () => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % facts.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dark-landing-root">
      <div className="dark-landing-main">
        <section className="dark-hero">
          <h1 className="dark-hero-title animate-fadein">KickOff Central</h1>
          <div className="dark-hero-btns">
            <a href="#login" className="dark-hero-cta animate-scalein">Login</a>
            <a href="#signup" className="dark-hero-cta animate-scalein" style={{marginLeft: '1rem'}}>Signup</a>
          </div>
        </section>
        <section className="dark-slideshow">
          <div className="slideshow-card animate-slideleft" key={slide}>
            <h3>{facts[slide].title}</h3>
            <p>{facts[slide].text}</p>
          </div>
          <div className="slideshow-dots">
            {facts.map((_, idx) => (
              <span
                key={idx}
                className={"slideshow-dot" + (slide === idx ? " active" : "")}
                onClick={() => setSlide(idx)}
              />
            ))}
          </div>
        </section>
      </div>
      <footer className="dark-footer">
        <p>Made by Harsh Thakur</p>
        <p className="dark-tagline">Where Every Project is a Goal, and Every Team is United</p>
        <p style={{fontSize: '0.9rem', opacity: 0.5}}>&copy; {new Date().getFullYear()} KickOff Central</p>
      </footer>
    </div>
  );
};

export default LandingPage;