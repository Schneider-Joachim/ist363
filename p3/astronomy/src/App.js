import React, { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import Collection from "./pages/Collection";
import SpaceFacts from "./pages/SpaceFacts";
import useCollection from "./hooks/useCollection";

const PAGES = ["home", "explorer", "collection", "facts"];

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const { collection, addItem, removeItem, isSaved, updateNote } = useCollection();

  const navigateTo = (page) => {
    if (PAGES.includes(page)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-void text-star font-body">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        collectionCount={collection.length}
      />

      {currentPage === "home" && (
        <Home
          onNavigate={navigateTo}
          onSaveItem={addItem}
          isSaved={isSaved}
        />
      )}

      {currentPage === "explorer" && (
        <Explorer
          onSaveItem={addItem}
          onRemoveItem={removeItem}
          isSaved={isSaved}
        />
      )}

      {currentPage === "collection" && (
        <Collection
          collection={collection}
          onRemove={removeItem}
          onNoteUpdate={updateNote}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === "facts" && <SpaceFacts />}
    </div>
  );
}
