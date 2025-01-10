// utils/formatDate.ts
import dayjs from 'dayjs';

type FormatOptions = {
  format?: string; // Optional custom format
};

export const formatDate = (date: string | Date | undefined, options?: FormatOptions): string => {
  // Default format: 'D MMMM, YYYY' (e.g., "10 July, 2024")
  const defaultFormat = 'D MMMM, YYYY';

  // Check if date is null, undefined, or an invalid string
  if (!date) {
    return 'Invalid date'; // or return an empty string, "N/A", etc.
  }

  // Convert date to Day.js object
  const dayjsDate = dayjs(date);

  // Use custom format if provided; otherwise, use default format
  return dayjsDate.isValid() ? dayjsDate.format(options?.format || defaultFormat) : 'Invalid date';
};