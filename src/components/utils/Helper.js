export const formatDateInHyphen = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  export const getSlotHour = (slot) => {
    const match = slot.match(/^(\d{1,2}):\d{2}(AM|PM)/);
  
    if (!match) return "";
  
    let [_, hour, period] = match;
  
    return `${hour.padStart(2, "0")}:00 ${period}`;
  };
  