import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Stats from "../components/landing/Stats";
import Events from "../components/landing/Events";
import Logos from "../components/landing/Clients";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import Hero from "../components/landing/Hero";
import Feature from "../components/Feature";
import DownloadApk from "@/components/landing/download-app";
import AdDialog from "@/components/landing/ads";
import Header from "@/components/Header";
const getNextAdIndex = (currentIndex, totalAds) => {
  return (currentIndex + 1) % totalAds;
};

export default function Home({
  testimonials,
  cities,
  settings,
  gallery,
  events,
  clients,
  imageCarousel,
  sponsorLogos,
  isAuthenticated,
  ads = [],
}) {
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const storedIndex = localStorage.getItem("adIndex");
    if (storedIndex) {
      setCurrentAdIndex(parseInt(storedIndex, 10));
    }
    setIsAdOpen(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);

  const handleAdClose = () => {
    setIsAdOpen(false);

    // Delay updating the ad index to avoid showing the next ad image before closing
    setTimeout(() => {
      const nextIndex = getNextAdIndex(currentAdIndex, ads.length);
      localStorage.setItem("adIndex", nextIndex);
      setCurrentAdIndex(nextIndex);
    }, 300); // Adjust the delay as needed (300ms here)
  };

  return (
    <div className="bg-white">
      <title>{settings.siteTitle}</title>
      <meta name="description" content={settings.seoDescription} />
      <meta name="keywords" content={settings.seoKeywords} />
      <meta name="title" content={settings.seoTitle} />
      <meta name="thumbnail" content={settings.seoThumbnail} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://corporatesportsclub.in/" />
      <meta property="og:title" content={settings.seoTitle} />
      <meta property="og:description" content={settings.seoDescription} />
      <meta property="og:image" content={settings.Thumbnail} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://corporatesportsclub.in/" />
      <meta property="twitter:title" content={settings.seoTitle} />
      <meta property="twitter:description" content={settings.seoDescription} />
      <meta property="twitter:image" content={settings.Thumbnail} />
      <Header settings={settings} cities={cities}/>
      <Toaster position="top-center" />
      <Hero cities={cities} settings={settings} imageCarousel={imageCarousel} />
      <Stats settings={settings} />
      <Events events={events} />
      <Feature />
      {/* <Gallery images={gallery} /> */}
      <Logos
        logos={clients}
        title={"Trusted by the world’s most innovative teams"}
      />
      <Logos
        logos={sponsorLogos}
        title={"Our valuable partners and sponsors"}
      />
      {testimonials && testimonials.length > 0 && (
        <Testimonials testimonials={testimonials} />
      )}
      <DownloadApk />
      <Footer settings={settings} />
      {ads.length > 0 && (
        <AdDialog
          ad={ads[currentAdIndex]}
          isOpen={isAdOpen}
          onClose={handleAdClose}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/landing`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );
    const testimonials = response.data.data.testimonials;
    const cities = response.data.data.cities;
    const settings = response.data.data.settings;
    const gallery = response.data.data.settings.gallery;
    const events = response.data.data.events;
    const clients = response.data.data.settings.clients;
    const imageCarousel = response.data.data.settings.imageCarousel;
    const sponsorLogos = response.data.data.settings.sponsorLogos || [];
    const ads = response.data.data.settings.ads;

    return {
      props: {
        testimonials,
        cities,
        settings,
        gallery,
        events,
        clients,
        imageCarousel,
        sponsorLogos,
        isAuthenticated: response.data.isAuthenticated,
        ads,
      },
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return {
      props: {
        testimonials: [],
      },
    };
  }
}
