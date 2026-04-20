import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [pioneers, setPioneers] = useState([
    {
      id: 1,
      name: "Elizabeth J. Feinler",
      age: 93,
      knownFor:
        "Helping develop early internet directories and naming systems.",
      image: "/lizpic.jpg",
      viewed: false,
    },
    {
      id: 2,
      name: "Tim Berners-Lee",
      age: 69,
      knownFor:
        "Inventor of the World Wide Web, the HTML markup language, the URL system, and HTTP.",
      image: "/timpic.jpg",
    },
    {
      id: 3,
      name: "Ray Tomlinson",
      age: 74,
      knownFor:
        "Known for implementing email and introducing the @ symbol in email addresses.",
      image: "/raypic.webp",
      viewed: false,
    },
  ]);

  const [selectedPioneer, setSelectedPioneer] = useState(null);

  function handleSelect(id) {
    const updatedPioneers = pioneers.map((pioneer) =>
      pioneer.id === id ? { ...pioneer, viewed: true } : pioneer,
    );

    setPioneers(updatedPioneers);

    const clickedPioneer = updatedPioneers.find((pioneer) => pioneer.id === id);
    setSelectedPioneer(clickedPioneer);
  }

  function handleReturnHome() {
    setSelectedPioneer(null);
  }

  return (
    <div className="container py-3">
      <h1 className="mb-4">Internet Pioneers Bios</h1>

      {selectedPioneer ? (
        <Pioneer pioneer={selectedPioneer} onReturn={handleReturnHome} />
      ) : (
        <Home pioneers={pioneers} onSelect={handleSelect} />
      )}
    </div>
  );
}

function Home({ pioneers, onSelect }) {
  return (
    <div className="row g-3">
      {pioneers.map((pioneer) => (
        <div className="col-md-4" key={pioneer.id}>
          <div className="card h-100 pioneer-card">
            <div className="position-relative">
              <img
                src={pioneer.image}
                alt={pioneer.name}
                className="card-img-top pioneer-image"
                onClick={() => onSelect(pioneer.id)}
              />
              {pioneer.viewed && (
                <span className="badge bg-danger viewed-badge">VIEWED</span>
              )}
            </div>

            <div className="card-body text-center">
              <h2 className="card-title pioneer-name">{pioneer.name}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pioneer({ pioneer, onReturn }) {
  return (
    <div className="details-box p-4 rounded">
      <h3 className="mb-3 border-bottom pb-2">{pioneer.name}</h3>

      <img
        src={pioneer.image}
        alt={pioneer.name}
        className="details-image mb-4"
      />

      <h4>Age:</h4>
      <p>{pioneer.age}</p>

      <h4>Known For:</h4>
      <p>{pioneer.knownFor}</p>

      <button className="btn btn-primary" onClick={onReturn}>
        Return to Directory
      </button>
    </div>
  );
}

export default App;
