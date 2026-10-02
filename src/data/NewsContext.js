import React, { createContext, useContext } from "react";
import useContentCollection from "./useContentCollection";

const NewsContext = createContext(null);
export function NewsProvider({ children }) {
  const { items: news, save: saveNews, remove: deleteNews, ...state } = useContentCollection("news");
  return <NewsContext.Provider value={{ news, saveNews, deleteNews, ...state }}>{children}</NewsContext.Provider>;
}
export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error("useNews must be used inside NewsProvider");
  return context;
}
