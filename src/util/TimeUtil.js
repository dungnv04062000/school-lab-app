import moment from "moment";

//25200s = 7hours
export const convertUTCtoDatetime = (value) => {
  return moment.unix(value).format("DD-MM-yyyy HH:mm");
};

export const convertUTCtoDate = (value) => {
  return moment.unix(value).format("DD-MM-yyyy");
};

export const convertTimestampToString = (totalSeconds) => {
  if (totalSeconds <= 0) return "";
  if (totalSeconds < 60) {
    return `${totalSeconds} giây`;
  }
  if (totalSeconds < 3600) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    if (minutes >= 1) {
      return `${minutes} phút`;
    }
    return `${minutes} phút ${seconds} giây`;
  }
  if (totalSeconds < 86400) {
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    // let seconds = totalSeconds % 60;
    return `${hours} giờ ${minutes} phút`;
  } else {
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    // let seconds = totalSeconds % 60;
    return `${days} ngày ${hours} giờ ${minutes} phút`;
  }
};
