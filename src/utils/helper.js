export const toSentenceCase = (str) =>
  str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());


export const displayAccountNumber = (number) => {
  const str = String(number);
  const last4 = str.slice(-4);
  const masked = 'x'.repeat(str.length - 4);
  return `${masked}${last4}`;

};
