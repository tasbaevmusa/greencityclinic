export const CLINIC_ZONE = "Asia/Almaty";
export const SLIDE_MS = 10000;
export const clinicDateKey = (value = new Date()) => {
  const parts = new Intl.DateTimeFormat("en", { timeZone: CLINIC_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(value);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
};
// Noon UTC keeps calendar arithmetic independent of the browser's timezone.
export const clinicWeekStart = (value = new Date()) => {
  const date = new Date(`${clinicDateKey(value)}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() || 7) + 1);
  return date;
};
export const clinicWeek = (value = new Date()) => {
  const monday = clinicWeekStart(value);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(date.getUTCDate() + index);
    return { date, key: clinicDateKey(date) };
  });
};
export const doctorPages = (doctors) => {
  if (!doctors.length) return [[]];
  const count = Math.max(Math.min(3, doctors.length), Math.ceil(doctors.length / 7));
  return Array.from({ length: count }, (_, index) => doctors.slice(Math.ceil(index * doctors.length / count), Math.ceil((index + 1) * doctors.length / count)));
};
export const weatherText = (code) => {
  if (code === 0) return "Ясно";
  if (code === 1) return "Малооблачно";
  if (code === 2) return "Облачно";
  if (code === 3) return "Пасмурно";
  if ([45, 48].includes(code)) return "Туман";
  if ([51, 53, 55, 56, 57].includes(code)) return "Морось";
  if ([61, 63, 65, 66, 67].includes(code)) return "Дождь";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Снег";
  if ([80, 81, 82].includes(code)) return "Ливень";
  if ([95, 96, 99].includes(code)) return "Гроза";
  return "Погода";
};
