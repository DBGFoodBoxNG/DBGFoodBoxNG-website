export function paymentStatusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Paid";
    case "due_on_delivery":
      return "Pay on delivery";
    case "failed":
      return "Payment failed";
    default:
      return "Payment pending";
  }
}

export function orderStatusLabel(status: string): string {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Awaiting payment";
  }
}

export function paymentMethodLabel(method: string): string {
  return method === "paystack" ? "Paystack" : "Pay on delivery";
}

export function formatOrderDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
