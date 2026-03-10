import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X, CheckCircle2 } from "lucide-react";
import BackgroundSlideshow from "./components/BackgroundSlideshow";
import { slides } from "./data/slides";
import logo from "./assets/slides/urrth_logo_transparent.png";
import logo2 from "./assets/slides/urrth-logo.jpeg";

const DEFAULT_MESSAGE =
  "Hello URRTH Team,\n\nI would like to enquire about your upcoming hotel, room availability, opening details, and event-related information. Please share more details.\n";

export default function App() {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: DEFAULT_MESSAGE,
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
    }
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hello URRTH, I would like to enquire about your upcoming hotel, room bookings, availability, and opening details. Please share more information."
  );

  const whatsappLink = `https://wa.me/919479282528?text=${whatsappMessage}`;

  const openEnquiryModal = () => {
    setShowEnquiryModal(true);
  };

  const closeEnquiryModal = () => {
    if (!isSubmitting) {
      setShowEnquiryModal(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      message: DEFAULT_MESSAGE,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowEnquiryModal(false);
        setShowSuccessModal(true);
        resetForm();
      } else {
        throw new Error(data.message || "Failed to send enquiry");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while sending your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="hero-page">
      <BackgroundSlideshow slides={slides} />
      <div className="hero-overlay" />

      <audio ref={audioRef} loop src="/coming-soon.mp3" />

      <section className="hero-center">
        <h1 className="coming-title">COMING SOON</h1>

        <img src={logo} alt="URRTH" className="hero-logo-image" />

        <p className="hero-description">
          A new destination for refined hospitality is arriving soon. URRTH is
          being thoughtfully crafted as a place where luxury stays, meaningful
          celebrations, and unforgettable experiences come together under one
          elegant setting.
        </p>

        <p className="hero-description-small">
          Featuring <strong>70+ premium rooms</strong>, curated ambience, and
          beautiful spaces designed for gatherings, celebrations, and memorable
          moments.
        </p>
      </section>

      <div className="right-floating-bar">
        <button
          type="button"
          className="enquiry-vertical-button"
          onClick={openEnquiryModal}
        >
          Enquiry
        </button>
      </div>

      <button
        type="button"
        className="sound-button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>

      <a
        className="whatsapp-button"
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <img src="/whatsapp.svg" alt="WhatsApp" className="whatsapp-icon" />
      </a>

      {showEnquiryModal && (
        <div className="enquiry-modal-overlay" onClick={closeEnquiryModal}>
          <div
            className="enquiry-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={closeEnquiryModal}
              aria-label="Close enquiry form"
            >
              <X size={22} />
            </button>

            <div className="enquiry-modal-content">
              <img src={logo2} alt="URRTH" className="enquiry-logo" />
              <p className="modal-eyebrow">URRTH Enquiry</p>
              <h2 className="modal-title">We’d love to hear from you</h2>
              <p className="modal-subtitle">
                Share your interest with us and our team will get back to you
                with the relevant details.
              </p>

              <form className="enquiry-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="7"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="send-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={closeSuccessModal}>
          <div
            className="success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} />
            </div>
            <p className="success-eyebrow">Message Delivered</p>
            <h3 className="success-title">Thank you for your enquiry</h3>
            <p className="success-text">
              Your message has been sent successfully to the URRTH team.
              We have also sent a confirmation email to your inbox. Our team
              will connect with you shortly.
            </p>

            <button
              type="button"
              className="success-button"
              onClick={closeSuccessModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}