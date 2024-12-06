import React, { useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";

// Rejestracja fontów Roboto
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/src/assets/font/Roboto-Regular.ttf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: "/src/assets/font/Roboto-Bold.ttf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "/src/assets/font/Roboto-Italic.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: "/src/assets/font/Roboto-BoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

// Style dokumentu PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Roboto" },
  section: { marginBottom: 10 }, // Dodaj styl `section`
  header: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: { fontFamily: "Roboto", fontWeight: "normal" },
  boldText: { fontFamily: "Roboto", fontWeight: "bold" },
  italicText: { fontFamily: "Roboto", fontStyle: "italic" },
  table: { display: "flex", width: "auto", marginTop: 10 },
  tableRow: { flexDirection: "row" },
  tableCol: { width: "25%", borderStyle: "solid", borderWidth: 1, padding: 5 },
  tableHeader: { fontWeight: "bold", backgroundColor: "#f0f0f0" },
  total: { marginTop: 10, fontWeight: "bold", textAlign: "right" },
});

// Komponent do tworzenia PDF
const InvoicePDF: React.FC<{ data: InvoiceData }> = ({ data }) => {
  const total = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    // PDF Document HTML Code
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice</Text>
        <View style={styles.section}>
          <Text>Invoice number: {data.invoiceNumber}</Text>
          <Text>Client: {data.customerName}</Text>
          <Text>Address: {data.customerAddress}</Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Product</Text>
            <Text style={styles.tableCol}>Price</Text>
            <Text style={styles.tableCol}>Amount</Text>
            <Text style={styles.tableCol}>Total price</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.product}</Text>
              <Text style={styles.tableCol}>{item.price} $</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>
                {item.price * item.quantity} $
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.total}>Total price is {total} $</Text>
      </Page>
    </Document>
  );
};

// Main app component
const InvoiceGenerator: React.FC = () => {
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: "2024/001",
    customerName: "Jake Noname",
    customerAddress: "st. Testowa 12, 00-000 Warsaw",
    items: [
      { product: "Product 1", price: 100, quantity: 1 },
      { product: "Product 2", price: 200, quantity: 2 },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedItems = [...formData.items];
      const key = name as keyof InvoiceItem;

      if (key === "price" || key === "quantity") {
        updatedItems[index][key] = Number(value) as never;
      } else {
        updatedItems[index][key] = value as never;
      }

      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: "", price: 0, quantity: 1 }],
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Fill invoice test datas</h2>
      <label>
        Document Number:
        <input
          type="text"
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={(e) => handleInputChange(e)}
        />
      </label>
      <br />
      <label>
        Client:
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={(e) => handleInputChange(e)}
        />
      </label>
      <br />
      <label>
        Adres:
        <input
          type="text"
          name="customerAddress"
          value={formData.customerAddress}
          onChange={(e) => handleInputChange(e)}
        />
      </label>
      <br />
      <h3>Positions:</h3>
      {formData.items.map((item, index) => (
        <div key={index}>
          <label>
            Product name:
            <input
              type="text"
              name="product"
              value={item.product}
              onChange={(e) => handleInputChange(e, index)}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => handleInputChange(e, index)}
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, index)}
            />
          </label>
        </div>
      ))}
      <button onClick={addItem} style={{ margin: "20px 0px" }}>
        Add new position
      </button>
      <br />
      <PDFDownloadLink
        document={<InvoicePDF data={formData} />}
        fileName={`invoice_${formData.invoiceNumber}.pdf`}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
          textDecoration: "none",
        }}
      >
        Download File
      </PDFDownloadLink>
    </div>
  );
};

export default InvoiceGenerator;
