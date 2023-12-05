

export const dateFormat = (date?: string): string => {
    if (date) {
      return new Date(date).toLocaleDateString();
    } else {
      // Handle the case where date is undefined (or provide a default value)
      return "N/A"; // You can customize this based on your requirements
    }
  };