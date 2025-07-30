import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "react-modal";
import { QRCodeCanvas } from "qrcode.react";

Modal.setAppElement("#root");

const EXPIRY_OPTIONS = [
  { label: "6 Hours", value: "Nmg=" },
  { label: "24 Hours", value: "MjRo" },
  { label: "3 Days", value: "M2Q=" },
  { label: "5 Days", value: "NWQ=" },
  { label: "10 Days", value: "MTBk" },
  { label: "1 Month", value: "MW0=" },
  { label: "3 Months", value: "M20=" },
  { label: "6 Months", value: "Nm0=" },
  { label: "1 Year", value: "MXk=" }
];

function App() {
  const [originalLink, setOriginalLink] = useState("");
  const [expiry, setExpiry] = useState(EXPIRY_OPTIONS[2].value);
  const [shortened, setShortened] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const examples = ["https://x.com", "https://test.com", "https://nasa.com"];

    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 1500;

    const handleTyping = () => {
      const currentExample = examples[currentExampleIndex];

      if (!isDeleting && charIndex < currentExample.length) {
        setPlaceholder((prev) => prev + currentExample[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholder((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentExample.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentExampleIndex]);

  function handleShorten(e: React.FormEvent) {
    e.preventDefault();
    if (!originalLink.trim()) {
      setSnackbarMessage("Please enter a valid URL.");
      setSnackbarOpen(true);
      return;
    }

    fetch("/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: originalLink,
        expiry: expiry,
        captcha: 'none',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShortened(window.location.origin + "/" + data.short_url);
        setSnackbarMessage("Link shortened successfully!");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackbarMessage("Failed to shorten the link. Please try again.");
        setSnackbarOpen(true);
      });
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800">
      {/* Header */}
      <header className="w-full flex items-center h-16 py-4 px-6 md:px-12 backdrop-blur-2xl bg-white/80 shadow-sm sticky top-0 z-30">
        <div className="h-20 flex items-center" onClick={() => (window.location.href = '/')}>
          <img
            src="/src/image.svg"
            alt="Shortenly Logo"
            className="h-full select-none"
          />
        </div>
        <nav className="ml-auto flex gap-8 text-base font-semibold">
          <a
            className="text-blue-700 hover:text-blue-500 transition-colors"
            href="#faq"
            aria-label="Go to FAQ section"
          >
            FAQ
          </a>

          <a
            className="text-blue-700 hover:text-blue-500 transition-colors"
            href="#terms"
            aria-label="Go to TOS page"
          >
            Terms of Service
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">

        {!shortened && (
          <div className="w-full max-w-lg rounded-3xl shadow-xl bg-white/70 backdrop-blur-md p-8 ring-1 ring-blue-100 mt-16 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-700 tracking-tight leading-tight">
              Shorten your link instantly
            </h1>
            <p className="text-center text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Paste your long URL below, choose an expiry time, and get a neat,
              shareable short link in seconds.{" "}
              <a
                href="#report"
                className="text-blue-600 hover:underline font-semibold"
                aria-label="Go to report section"
              >
                Report a URL
              </a>
            </p>

            <form
              onSubmit={handleShorten}
              className="flex flex-col gap-5"
              aria-label="Link shortening form"
            >
              <div className="relative flex items-center">
                <input
                  required
                  type="url"
                  placeholder={placeholder || "Paste your original link here..."}
                  value={originalLink}
                  onChange={(e) => setOriginalLink(e.target.value)}
                  className="border-2 border-blue-200 focus:border-blue-400 outline-none py-3 px-5 rounded-2xl text-lg transition-all shadow-sm backdrop-blur placeholder:text-gray-400 flex-1"
                  aria-label="Original URL input"
                />
                <select
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 border-0 border-blue-200 focus:border-blue-400 outline-none py-2 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold cursor-pointer shadow-sm"
                  aria-label="Select expiry time for short link"
                >
                  {EXPIRY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-lg shadow-md active:scale-[0.97] transition-transform duration-150 focus:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 mt-2"
                aria-label="Shorten link button"
              >
                Shorten
              </button>
            </form>
          </div>
        )}
        
        {shortened && (
          <div className="w-full max-w-lg rounded-3xl shadow-xl bg-white/70 backdrop-blur-md p-8 ring-1 ring-blue-100 mt-16 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-700 tracking-tight leading-tight">
              Your shortened link is ready
            </h1>
            <p className="text-center text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              You can now share this link with anyone. It will redirect to your
              original link until the expiry time you selected.
            </p>

            <div
              className="relative flex items-center justify-between border-2 border-dashed border-blue-400 rounded-2xl py-4 px-6 text-lg font-extrabold text-blue-700 bg-blue-50 shadow-sm hover:bg-blue-100 cursor-pointer transition-colors overflow-hidden"
              onClick={() => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(shortened).catch((err) => {
                    console.error("Failed to copy: ", err);
                    setSnackbarMessage("Failed to copy to clipboard.");
                    setSnackbarOpen(true);
                  });
                } else {
                  const textArea = document.createElement("textarea");
                  textArea.value = shortened;
                  document.body.appendChild(textArea);
                  textArea.select();
                  try {
                    document.execCommand("copy");
                    setSnackbarMessage("Link copied to clipboard!");
                    setSnackbarOpen(true);
                  } catch (err) {
                    console.error("Fallback: Failed to copy: ", err);
                    setSnackbarMessage("Failed to copy to clipboard.");
                    setSnackbarOpen(true);
                  }
                  document.body.removeChild(textArea);
                }
              }}
              title="Click to copy"
            >
              <span className="truncate font-extrabold text-blue-700 relative animate-glow">
                {shortened}
              </span>
              
              <div onClick={openModal} title="Show QR Code" className="cursor-pointer">
                <svg
                  className="w-6 h-6 ml-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 12H12V17M3.01 12H3M8.01 17H8M12.01 21H12M21.01 12H21M3 17H4.5M15.5 12H17.5M3 21H8M12 2V8M17.6 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V17.6C21 17.0399 21 16.7599 20.891 16.546C20.7951 16.3578 20.6422 16.2049 20.454 16.109C20.2401 16 19.9601 16 19.4 16H17.6C17.0399 16 16.7599 16 16.546 16.109C16.3578 16.2049 16.2049 16.3578 16.109 16.546C16 16.7599 16 17.0399 16 17.6V19.4C16 19.9601 16 20.2401 16.109 20.454C16.2049 20.6422 16.3578 20.7951 16.546 20.891C16.7599 21 17.0399 21 17.6 21ZM17.6 8H19.4C19.9601 8 20.2401 8 20.454 7.89101C20.6422 7.79513 20.7951 7.64215 20.891 7.45399C21 7.24008 21 6.96005 21 6.4V4.6C21 4.03995 21 3.75992 20.891 3.54601C20.7951 3.35785 20.6422 3.20487 20.454 3.10899C20.2401 3 19.9601 3 19.4 3H17.6C17.0399 3 16.7599 3 16.546 3.10899C16.3578 3.20487 16.2049 3.35785 16.109 3.54601C16 3.75992 16 4.03995 16 4.6V6.4C16 6.96005 16 7.24008 16.109 7.45399C16.2049 7.64215 16.3578 7.79513 16.546 7.89101C16.7599 8 17.0399 8 17.6 8ZM4.6 8H6.4C6.96005 8 7.24008 8 7.45399 7.89101C7.64215 7.79513 7.79513 7.64215 7.89101 7.45399C8 7.24008 8 6.96005 8 6.4V4.6C8 4.03995 8 3.75992 7.89101 3.54601C7.79513 3.35785 7.64215 3.20487 7.45399 3.10899C7.24008 3 6.96005 3 6.4 3H4.6C4.03995 3 3.75992 3 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3 3.75992 3 4.03995 3 4.6V6.4C3 6.96005 3 7.24008 3.10899 7.45399C3.20487 7.64215 3.35785 7.79513 3.54601 7.89101C3.75992 8 4.03995 8 4.6 8Z" />
                </svg>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-lg shadow-md active:scale-[0.97] transition-transform duration-150 focus:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Shorten again button"
                onClick={() => (window.location.href = '/')}
              >
                Shorten Again
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          contentLabel="QR Code Modal"
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm mx-auto flex flex-col items-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
        >
          {shortened && (
            <QRCodeCanvas
              value={shortened}
              size={180}
              bgColor="#ffffff"
              fgColor="#3b82f6"
              level="H"
              className="shadow-lg rounded-lg"
            />
          )}
          <button
            onClick={closeModal}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-semibold shadow-md transition-all"
          >
            Close
          </button>
        </Modal>

        {/* Info Section */}
        <section className="w-full max-w-3xl mt-20 bg-white/80 rounded-3xl p-10 shadow-lg flex flex-col gap-8 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold text-blue-700 mb-3 text-center">
            What are shortened links?
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
            Link shortening transforms a long, unwieldy URL into a compact,
            easy-to-share short link. It's perfect for sharing on social media,
            texts, or anywhere space is limited. Plus, you can set expiration
            dates for extra control and security.
          </p>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full max-w-3xl mt-16 mb-12 flex flex-col gap-6 bg-white/90 rounded-3xl p-10 shadow-lg animate-fade-in-up"
          aria-label="Frequently Asked Questions"
        >
          <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-700 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <details className="rounded-lg border border-blue-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
            <summary className="font-medium cursor-pointer select-none text-blue-700 text-lg">
              Is this service free?
            </summary>
            <div className="mt-2 text-gray-700 leading-relaxed">
              Yes, this is a completely free service. You can shorten as many links as you want
            </div>
          </details>
          <details className="rounded-lg border border-blue-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
            <summary className="font-medium cursor-pointer select-none text-blue-700 text-lg">
              Can I customize the short link?
            </summary>
            <div className="mt-2 text-gray-700 leading-relaxed">
              You can choose diffrent avaliable domains for your short link
            </div>
          </details>
          <details className="rounded-lg border border-blue-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
            <summary className="font-medium cursor-pointer select-none text-blue-700 text-lg">
              How does expiry work?
            </summary>
            <div className="mt-2 text-gray-700 leading-relaxed">
              Once the expiry time is reached, your short link will be disabled
              and will no longer redirect to the original URL.
            </div>
          </details>
        </section>

        <section id="terms" className="w-full max-w-3xl mb-12 flex flex-col gap-6 bg-white/90 rounded-3xl p-10 shadow-lg animate-fade-in-up">
          <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-700 tracking-tight leading-tight">
            Terms of Service and Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
            By using this service, you agree to our Terms of Service and Privacy Policy outlined below.
          </p>

          {/* Terms of Service */}
          <details className="rounded-lg border border-blue-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
            <summary className="font-medium cursor-pointer select-none text-blue-700 text-lg">
              Terms of Service
            </summary>
            <div className="mt-2 text-gray-700 leading-relaxed">
              <h3 className="text-xl font-bold mb-2">1. Service Description</h3>
              <p>
                Shortyy provides a free link-shortening service that allows users to create shortened URLs. Users can set expiry dates for their links, after which the links and associated data are permanently deleted.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">2. User Responsibilities</h3>
              <p>
                - Users are solely responsible for the content of the links they shorten.<br />
                - Users must not use the service to shorten links that:
                <ul className="list-disc list-inside">
                  <li>Contain illegal, harmful, or malicious content.</li>
                  <li>Violate any applicable laws or regulations.</li>
                </ul>
                Shortyy reserves the right to take action, including disabling links, if they are reported or found to violate these terms.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">3. Moderation</h3>
              <p>
                While Shortyy does not actively monitor all links, we may review and take action on links reported by users or flagged by our system.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">4. Data Retention</h3>
              <p>
                Shortened links and associated data are retained only until the expiry date set by the user. After expiry, all data related to the link is permanently deleted.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">5. Disclaimer of Liability</h3>
              <p>
                Shortyy is not responsible for the content of the links shortened by users. Users access and use shortened links at their own risk.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">6. Governing Law</h3>
              <p>
                These terms are governed by the laws of Algeria. Any disputes arising from the use of our service will be resolved under Algerian jurisdiction.
              </p>
            </div>
          </details>

          {/* Privacy Policy */}
          <details className="rounded-lg border border-blue-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
            <summary className="font-medium cursor-pointer select-none text-blue-700 text-lg">
              Privacy Policy
            </summary>
            <div className="mt-2 text-gray-700 leading-relaxed">
              <h3 className="text-xl font-bold mb-2">1. Data We Collect</h3>
              <p>
                - **IP Addresses**: Collected for logging and analytics purposes.<br />
                - **Browser Information**: Used for analytics to improve our service.<br />
                - **Shortened Links**: Stored until the expiry date set by the user.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">2. How We Use Your Data</h3>
              <p>
                - To provide and improve our service.<br />
                - To analyze usage patterns through Google Analytics.<br />
                - To ensure compliance with our Terms of Service.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">3. Data Retention</h3>
              <p>
                Data related to shortened links is retained only until the expiry date. After expiry, all data is permanently deleted.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">4. Cookies</h3>
              <p>
                We use cookies to:
                <ul className="list-disc list-inside">
                  <li>Track usage patterns through Google Analytics.</li>
                  <li>Enhance the user experience.</li>
                </ul>
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">5. Third-Party Services</h3>
              <p>
                We use Google Analytics to collect anonymized usage data. For more information, please refer to <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Google's Privacy Policy</a>.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">6. Sharing of Data</h3>
              <p>
                We do not share your data with third parties except:
                <ul className="list-disc list-inside">
                  <li>When required by law.</li>
                  <li>To investigate and address violations of our Terms of Service.</li>
                </ul>
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">7. Security</h3>
              <p>
                We take reasonable measures to protect your data. However, no method of transmission over the internet is 100% secure.
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">8. Governing Law</h3>
              <p>
                This policy is governed by the laws of Algeria.
              </p>
            </div>
          </details>
        </section>

        <section
          id="report"
          className="w-full max-w-3xl mt-16 mb-12 flex flex-col gap-6 bg-white/90 rounded-3xl p-10 shadow-lg animate-fade-in-up"
          aria-label="Report a URL"
        >
          <h2 className="text-4xl font-extrabold text-center mb-4 text-red-600 tracking-tight leading-tight">
            Report a URL
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
            If you believe a shortened URL violates our Terms of Service, you can report it here.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const urlInput = (e.target as HTMLFormElement).elements.namedItem(
                "url"
              ) as HTMLInputElement;
              const url = urlInput.value.trim();

              if (!url) {
                setSnackbarMessage("Please enter a valid URL to report.");
                setSnackbarOpen(true);
                return;
              }

              const queryParams = new URLSearchParams({
                url: url,
                token: "none",
              });

              fetch(`/report?${queryParams.toString()}`, {
                method: "GET",
              })
                .then((response) => {
                  if (response.ok) {
                    setSnackbarMessage("URL reported successfully!");
                  } else {
                    setSnackbarMessage("Failed to report the URL. Please try again.");
                  }
                  setSnackbarOpen(true);
                    setTimeout(() => {
                    window.location.href = '/';
                    }, 3000);
                })
                .catch((error) => {
                  console.error("Error:", error);
                  setSnackbarMessage("Failed to report the URL. Please try again.");
                  setSnackbarOpen(true);
                });
            }}
            className="flex flex-col gap-5"
            aria-label="Report URL form"
          >
            <div className="relative flex items-center">
              <input
                required
                type="url"
                name="url"
                placeholder="Enter the shortened URL to report..."
                className="border-2 border-red-200 focus:border-red-400 outline-none py-3 px-5 rounded-2xl text-lg transition-all shadow-sm backdrop-blur placeholder:text-gray-400 flex-1"
                aria-label="Shortened URL input"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold text-lg shadow-md active:scale-[0.97] transition-transform duration-150 focus:outline-red-400 focus-visible:ring-2 focus-visible:ring-red-500 mt-2 flex items-center justify-center gap-2"
              aria-label="Report URL button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L12 12m0 0l-6.364-6.364M12 12v6"
                />
              </svg>
              Report URL
            </button>
          </form>
        </section>
      </main>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage === "Link shortened successfully!" ? "success" : "info"} // Change severity based on the message
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Footer */}
      <footer className="w-full flex justify-center items-center py-6 mt-auto bg-transparent text-gray-500 animate-fade-in-up select-none">
        <span>
          Made with{" "}
          <span
            className="text-blue-500"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ♥
          </span>{" "}
          for the web — {new Date().getFullYear()} |{" "}
          <a
            href="mailto:info@shortyy.click"
            className="text-blue-600 hover:underline"
            aria-label="Contact us via email"
          >
            Contact Us
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
