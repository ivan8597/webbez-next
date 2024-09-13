// import moment from "moment-timezone";
// export const getStandardDate = (date: string, currentTimeZone: string) => {
//   return moment(date).tz(currentTimeZone).format("DD.MM.yyyy HH:mm:ss");
//  //преобразование даты часового пояса во время в текущем часовом поясе

// };
export const getFormattedDate = (timestamp: string) => {//формат даты день месяц год часы минуты секунды
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};