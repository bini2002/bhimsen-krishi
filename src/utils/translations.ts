// utils/translations.ts

export const nepaliNumbers = (num: number): string => {
    const nepaliDigits = [
      '०', '१', '२', '३', '४', '५', '६', '७', '८', '९',
    ];
    return num.toString().split('').map(digit => nepaliDigits[parseInt(digit, 10)]).join('');
  };
  
  export const nepaliDayNames = (index: number): string => {
    const dayNamesNepali = [
      'आइतबार', // Sunday
      'सोमबार', // Monday
      'मंगलबार', // Tuesday
      'बुधबार', // Wednesday
      'बिहिबार', // Thursday
      'शुक्रबार', // Friday
      'शनिबार', // Saturday
    ];
    return dayNamesNepali[index];
  };
  
  export const nepaliMonthNames = (monthIndex: number): string => {
    const monthNamesNepali = [
      'जनवरी', 'फेब्रुअरी', 'मार्च', 'एप्रिल', 
      'मे', 'जुन', 'जुलाइ', 'अगस्ट', 
      'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'
    ];
    return monthNamesNepali[monthIndex];
  };