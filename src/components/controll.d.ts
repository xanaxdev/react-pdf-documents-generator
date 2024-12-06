interface InvoiceItem {
  product: string;
  price: number;
  quantity: number;
}

interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
}
