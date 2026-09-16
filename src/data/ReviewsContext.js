import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ReviewsContext = createContext(null);
const STORAGE_KEY = "naramed-reviews";

export const TWO_GIS_REVIEWS_URL = "https://2gis.kz/almaty/firm/70000001084000652/tab/reviews";

const defaultReviews = [
  { id: "2gis-1", name: "Евгений Ким", date: "9 июля 2026", rating: 5, message: "Хорошая клиника, особенно врач-нефролог Мукашова Айжан Еркінқызы: в свой выходной приняла и выписала направление.", source: "2ГИС" },
  { id: "2gis-2", name: "Асель Сундетова", date: "30 июня 2026", rating: 5, message: "Керемет сапа. Жақсы персонал.", source: "2ГИС" },
  { id: "2gis-3", name: "Alima Kulzhabayeva", date: "29 июня 2026", rating: 5, message: "Проходила УЗИ сердца. Хорошие, вежливые врачи. Спасибо им. Мне понравился медцентр.", source: "2ГИС" },
  { id: "2gis-4", name: "Гулбахар Сейтимбетова", date: "25 июня 2026", rating: 5, message: "Была в медцентре «Нарамед Green City». Пульмонолог Ыдырыс Ұлшай Батырханқызы очень образованная, всё проверила и объяснила. Спасибо большое ей.", source: "2ГИС" },
  { id: "2gis-5", name: "Banu Arslanova", date: "25 июня 2026", rating: 5, message: "Хорошая клиника, приняли вовремя, всё чётко объяснили.", source: "2ГИС" },
  { id: "2gis-6", name: "Barsha Tsoy", date: "22 июня 2026", rating: 5, message: "Хорошая клиника, эндокринолог Эльмира Хамитовна — топ. Анализы берут очень хорошо, без стресса и безболезненно, даже у ребёнка. Всегда чисто.", source: "2ГИС" }
];

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultReviews; }
    catch { return defaultReviews; }
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)), [reviews]);

  const value = useMemo(() => ({
    reviews,
    saveReview: (review) => setReviews((current) => current.some((item) => item.id === review.id)
      ? current.map((item) => item.id === review.id ? review : item)
      : [...current, { ...review, id: crypto.randomUUID() }]),
    deleteReview: (id) => setReviews((current) => current.filter((review) => review.id !== id))
  }), [reviews]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used inside ReviewsProvider");
  return context;
}
