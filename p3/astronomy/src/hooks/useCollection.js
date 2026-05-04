import { useState, useEffect } from "react";

const STORAGE_KEY = "astronomy_collection";

export default function useCollection() {
  const [collection, setCollection] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    } catch {}
  }, [collection]);

  const addItem = (item) => {
    setCollection((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeItem = (id) => {
    setCollection((prev) => prev.filter((i) => i.id !== id));
  };

  const isSaved = (id) => collection.some((i) => i.id === id);

  const updateNote = (id, note) => {
    setCollection((prev) =>
      prev.map((i) => (i.id === id ? { ...i, note } : i)),
    );
  };

  return { collection, addItem, removeItem, isSaved, updateNote };
}
