export function fmtNgn(n: number): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₦${Math.round(n).toLocaleString()}`;
  }
}

export function fmtNumber(n: number): string {
  try {
    return new Intl.NumberFormat("en-NG").format(n);
  } catch {
    return n.toLocaleString();
  }
}

export function fmtDate(ms: number): string {
  try {
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toDateString();
  }
}
