import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import ClinicGallery from "../Components/ClinicGallery";
import Location from "../Components/Location";

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
      <div className="home-band home-band-green"><Hero /></div>
      <div className="home-band home-band-white"><ClinicGallery /></div>
      <div className="home-band home-band-green"><DoctorsSlider /></div>
      <div className="home-band home-band-white"><ChiefDoctor /></div>
      <div className="home-band home-band-green"><PopularServices /></div>
      <div className="home-band home-band-white"><News /></div>
      <div className="home-band home-band-green"><Reviews /></div>
      <div className="home-band home-band-white"><FAQ /></div>
      <div className="home-band home-band-green"><Location /></div>
      <Footer />
    </div>
  );
}

export default Home;
