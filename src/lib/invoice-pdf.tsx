import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import path from 'path';

// Локальный шрифт с кириллицей (Noto Sans)
const fontBase = path.join(process.cwd(), 'public', 'fonts');
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: path.join(fontBase, 'NotoSans-Regular.ttf') },
    { src: path.join(fontBase, 'NotoSans-Bold.ttf'), fontWeight: 'bold' },
  ],
});

const brandBlue = '#0f4fa8';
const textGray = '#374151';
const tableBorder = '#e5e7eb';

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: 'NotoSans', color: textGray },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  headerNumber: { fontSize: 12, marginTop: 4 },
  logoBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: tableBorder,
    borderRadius: 8,
    minWidth: 140,
  },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  metaCol: { flexBasis: '48%', padding: 10, backgroundColor: '#f9fafb', borderRadius: 8, borderWidth: 1, borderColor: tableBorder },
  metaLabel: { color: brandBlue, fontWeight: 'bold', fontSize: 9, textTransform: 'uppercase' },
  metaText: { fontSize: 10, marginTop: 2 },
  section: { marginBottom: 16 },
  partyRow: { flexDirection: 'row', gap: 16 },
  partyCard: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: tableBorder, backgroundColor: '#fff' },
  partyTitle: { fontWeight: 'bold', marginBottom: 6, color: brandBlue, fontSize: 11 },
  partyName: { fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  partyLine: { marginBottom: 2 },
  table: { marginTop: 10, borderWidth: 1, borderColor: tableBorder, borderRadius: 8, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderBottomWidth: 1, borderBottomColor: tableBorder, paddingVertical: 6, paddingHorizontal: 8 },
  th: { flex: 2, fontWeight: 'bold', fontSize: 9 },
  thNarrow: { width: 60, textAlign: 'right', fontWeight: 'bold', fontSize: 9 },
  thWide: { width: 74, textAlign: 'right', fontWeight: 'bold', fontSize: 9 },
  row: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: tableBorder },
  cell: { flex: 2, fontSize: 9 },
  cellNarrow: { width: 60, textAlign: 'right', fontSize: 9 },
  cellWide: { width: 74, textAlign: 'right', fontSize: 9 },
  totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  totalsBox: { width: 320, borderWidth: 1, borderColor: tableBorder, borderRadius: 8, overflow: 'hidden' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: tableBorder },
  totalLabel: { color: textGray },
  totalValue: { fontWeight: 'bold' },
  payable: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: '#f0f7ff', borderWidth: 1, borderColor: '#c7dbff' },
  payableLabel: { fontSize: 11, fontWeight: 'bold', color: brandBlue },
  payableText: { fontSize: 11, marginTop: 4 },
});

type InvoiceData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  saleDate?: string;
  paymentMethod?: string;
  sellerContacts?: string[];
  vatRate?: number;
  seller: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    vatNumber?: string;
    bankAccount?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  buyer: {
    name: string;
    companyName?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    vatNumber?: string;
    phone?: string;
  };
  items: { name: string; quantity: number; unitNet: number; totalNet: number; vat?: number; totalGross?: number }[];
  totalNet: number;
  totalVat: number;
  totalGross: number;
  currency: string;
};

export function InvoiceDocument(props: InvoiceData) {
  const fmt = (v: number) =>
    `${v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${props.currency}`;
  const vatRate = typeof props.vatRate === 'number' ? props.vatRate : props.totalNet ? Math.round((props.totalVat / props.totalNet) * 100) : 23;
  const paymentMethod = props.paymentMethod || 'Przelew';
  const saleDate = props.saleDate || props.issueDate;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Faktura</Text>
            <Text style={styles.headerNumber}>Numer {props.invoiceNumber}</Text>
          </View>
          <View style={styles.logoBox}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: brandBlue }}>DESIGNCORP</Text>
            <Text style={{ fontSize: 9 }}>Print</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Data wystawienia</Text>
            <Text style={styles.metaText}>{props.issueDate}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Data sprzedaży</Text>
            <Text style={styles.metaText}>{saleDate}</Text>
          </View>
          {props.dueDate && (
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Termin płatności</Text>
              <Text style={styles.metaText}>{props.dueDate}</Text>
            </View>
          )}
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Płatność</Text>
            <Text style={styles.metaText}>{paymentMethod}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.partyRow]}>
          <View style={styles.partyCard}>
            <Text style={styles.partyTitle}>Sprzedawca</Text>
            <Text style={styles.partyName}>{props.seller.name}</Text>
            <Text style={styles.partyLine}>{props.seller.address}</Text>
            <Text style={styles.partyLine}>
              {props.seller.postalCode} {props.seller.city}, {props.seller.country}
            </Text>
            {props.seller.vatNumber && <Text style={styles.partyLine}>NIP/VAT: {props.seller.vatNumber}</Text>}
            {props.seller.email && <Text style={styles.partyLine}>{props.seller.email}</Text>}
            {props.seller.phone && <Text style={styles.partyLine}>{props.seller.phone}</Text>}
            {props.seller.website && <Text style={styles.partyLine}>{props.seller.website}</Text>}
            {props.seller.bankAccount && <Text style={styles.partyLine}>Konto: {props.seller.bankAccount}</Text>}
            {props.sellerContacts?.map((line, idx) => (
              <Text key={idx} style={styles.partyLine}>
                {line}
              </Text>
            ))}
          </View>
          <View style={styles.partyCard}>
            <Text style={styles.partyTitle}>Nabywca</Text>
            <Text style={styles.partyName}>{props.buyer.companyName || props.buyer.name}</Text>
            <Text style={styles.partyLine}>{props.buyer.address}</Text>
            <Text style={styles.partyLine}>
              {props.buyer.postalCode} {props.buyer.city}, {props.buyer.country}
            </Text>
            {props.buyer.vatNumber && <Text style={styles.partyLine}>NIP/VAT: {props.buyer.vatNumber}</Text>}
            {props.buyer.phone && <Text style={styles.partyLine}>Tel: {props.buyer.phone}</Text>}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: 20 }]}>LP</Text>
            <Text style={styles.th}>Nazwa</Text>
            <Text style={styles.thNarrow}>Ilość</Text>
            <Text style={styles.thWide}>Cena netto</Text>
            <Text style={styles.thWide}>Wartość netto</Text>
            <Text style={styles.thNarrow}>VAT %</Text>
            <Text style={styles.thWide}>VAT</Text>
            <Text style={styles.thWide}>Brutto</Text>
          </View>
          {props.items.map((item, idx) => {
            const vatVal = item.vat ?? item.totalNet * (vatRate / 100);
            const totalGross = item.totalGross ?? item.totalNet + vatVal;
            return (
              <View key={idx} style={styles.row}>
                <Text style={[styles.cell, { width: 20 }]}>{idx + 1}</Text>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cellNarrow}>{item.quantity}</Text>
                <Text style={styles.cellWide}>{fmt(item.unitNet)}</Text>
                <Text style={styles.cellWide}>{fmt(item.totalNet)}</Text>
                <Text style={styles.cellNarrow}>{vatRate}%</Text>
                <Text style={styles.cellWide}>{fmt(vatVal)}</Text>
                <Text style={styles.cellWide}>{fmt(totalGross)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Wartość netto</Text>
              <Text style={styles.totalValue}>{fmt(props.totalNet)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Wartość VAT ({vatRate}%)</Text>
              <Text style={styles.totalValue}>{fmt(props.totalVat)}</Text>
            </View>
            <View style={[styles.totalRow, { backgroundColor: '#f9fafb' }]}>
              <Text style={[styles.totalLabel, { fontWeight: 'bold', color: brandBlue }]}>Wartość brutto</Text>
              <Text style={[styles.totalValue, { color: brandBlue }]}>{fmt(props.totalGross)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.payable}>
          <Text style={styles.payableLabel}>Do zapłaty: {fmt(props.totalGross)}</Text>
          <Text style={styles.payableText}>Słownie: {props.totalGross.toFixed(2)} {props.currency}</Text>
        </View>
      </Page>
    </Document>
  );
}
