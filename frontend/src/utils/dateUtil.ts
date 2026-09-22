const IST_OFFSET_MINUTES = 330;

export const istTimeToUTCDate = (date, time) => {
  const utcDate = new Date(`${date}T${time}:00.000Z`);

  utcDate.setUTCMinutes(
    utcDate.getUTCMinutes() - IST_OFFSET_MINUTES
  );

  return utcDate.toLocaleTimeString;
};

export const getISTDateParts = (date) => {
  const istDate = new Date(
    date.getTime() + IST_OFFSET_MINUTES * 60 * 1000
  );

  return {
    year: istDate.getUTCFullYear(),
    month: istDate.getUTCMonth(),
    day: istDate.getUTCDate(),
    hours: istDate.getUTCHours(),
    minutes: istDate.getUTCMinutes(),
  };
};