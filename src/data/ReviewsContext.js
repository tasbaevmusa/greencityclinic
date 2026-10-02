import React, { createContext, useContext } from "react";
import useContentCollection from "./useContentCollection";
export const TWO_GIS_REVIEWS_URL = "https://2gis.kz/almaty/firm/70000001084000652/tab/reviews";
const ReviewsContext = createContext(null);
export function ReviewsProvider({ children }) {
  const { items: reviews, save: saveReview, remove: deleteReview, ...state } = useContentCollection("reviews");
  return <ReviewsContext.Provider value={{ reviews, saveReview, deleteReview, ...state }}>{children}</ReviewsContext.Provider>;
}
export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used inside ReviewsProvider");
  return context;
}
