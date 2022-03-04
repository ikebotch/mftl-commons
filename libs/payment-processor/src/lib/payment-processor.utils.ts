export const convertAmountToFintech = (amount: number) =>
  Number((Number((amount ?? 0).toFixed(2)) * 100).toFixed(0));

  export const convertAmountFromFintech = (amount: number) =>
 Number((Number((amount ?? 0)) / 100).toFixed(2));
