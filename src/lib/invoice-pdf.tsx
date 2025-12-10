import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica' },
  header: { fontSize: 16, marginBottom: 12, fontWeight: 700 },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: '#555' },
  tableHeader: { flexDirection: 'row', borderBottom: '1pt solid #ddd', paddingBottom: 4, marginBottom: 4 },
  th: { flex: 2, fontWeight: 700 },
  thQty: { width: 50, textAlign: 'right', fontWeight: 700 },
  thPrice: { width: 70, textAlign: 'right', fontWeight: 700 },
  cell: { flex: 2 },
  cellQty: { width: 50, textAlign: 'right' },
  cellPrice: { width: 70, textAlign: 'right' },
  totals: { marginTop: 8, alignSelf: 'flex-end', width: 200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
});

type InvoiceData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  seller: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    vatNumber?: string;
  };
  buyer: {
    name: string;
    companyName?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    vatNumber?: string;
  };
  items: { name: string; quantity: number; unitNet: number; totalNet: number }[];
  totalNet: number;
  totalVat: number;
  totalGross: number;
  currency: string;
};

export function InvoiceDocument(props: InvoiceData) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Счёт-фактура {props.invoiceNumber}</Text>
          <Text>Дата выставления: {props.issueDate}</Text>
          {props.dueDate && <Text>Оплатить до: {props.dueDate}</Text>}
        </View>

        <View style={[styles.section, { flexDirection: 'row', gap: 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 700, marginBottom: 4 }}>Продавец</Text>
            <Text>{props.seller.name}</Text>
            <Text>{props.seller.address}</Text>
            <Text>
              {props.seller.postalCode} {props.seller.city}, {props.seller.country}
            </Text>
            {props.seller.vatNumber && <Text>NIP/VAT: {props.seller.vatNumber}</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 700, marginBottom: 4 }}>Покупатель</Text>
            <Text>{props.buyer.companyName || props.buyer.name}</Text>
            <Text>{props.buyer.address}</Text>
            <Text>
              {props.buyer.postalCode} {props.buyer.city}, {props.buyer.country}
            </Text>
            {props.buyer.vatNumber && <Text>NIP/VAT: {props.buyer.vatNumber}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Товар/услуга</Text>
            <Text style={styles.thQty}>Кол-во</Text>
            <Text style={styles.thPrice}>Цена</Text>
            <Text style={styles.thPrice}>Сумма</Text>
          </View>
          {props.items.map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cellQty}>{item.quantity}</Text>
              <Text style={styles.cellPrice}>{item.unitNet.toFixed(2)} {props.currency}</Text>
              <Text style={styles.cellPrice}>{item.totalNet.toFixed(2)} {props.currency}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Сумма (Netto)</Text>
            <Text>{props.totalNet.toFixed(2)} {props.currency}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>VAT</Text>
            <Text>{props.totalVat.toFixed(2)} {props.currency}</Text>
          </View>
          <View style={[styles.totalRow, { fontWeight: 700 }]}>
            <Text>Итого</Text>
            <Text>{props.totalGross.toFixed(2)} {props.currency}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
