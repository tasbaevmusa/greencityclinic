import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Location from "../Components/Location";

import Info from "../Components/Info";
import Reviews from "../Components/Reviews";
import News from "../Components/News";
import DoctorsSlider from "../Components/DoctorsSlider";
import Footer from "../Components/Footer";
import FAQ from "../Components/FAQ";
import ChiefDoctor from "../Components/ChiefDoctor";
import PopularServices from "../Components/PopularServices";

function Home() {
  return (
    <div className="home-section">
      <Navbar />
      <Hero />
      <Info />
      <DoctorsSlider />
      <ChiefDoctor />
      <PopularServices />
      <News />
      <Reviews />
      <FAQ />
      <Location />
      <Footer />
    </div>
  );
}

export default Home;
