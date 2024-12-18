import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',

  },
  text: {
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  largerBoldText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f2f2f2',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
  addressSection: {
    marginBottom: 20,
    marginTop: 20,
  },
  orderDetailsSection: {
    marginBottom: 20,
  },
  totalSection: {
    marginTop: 30,
    textAlign: 'right',
  },
  totalDivider: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },
  inlineText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    marginBottom: 10,
  },
  splitTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  splitRow: {
    flexDirection: 'row',
  },
  splitColumn: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  splitCell: {
    margin: 5,
    fontSize: 10,
  },
});

const InvoicePDF = ({ registration, user }) => {
  const calculateTotals = () => {
    let subtotal = 0;
    if (Array.isArray(registration.orderDetails)) {
      subtotal = registration.orderDetails.reduce((total, item) => total + (item.fee * item.quantity), 0);
    } else if (registration.orderDetails && registration.orderDetails.fee) {
      subtotal = registration.orderDetails.fee * (registration.orderDetails.quantity || 1);
    }
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;
    return { subtotal, gst, grandTotal };
  };

  const { subtotal, gst, grandTotal } = calculateTotals();

  const hasClientDetails = registration.companyName || user?.address || registration.gstNumber;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Tax Invoice</Text>
          <View style={styles.divider} />
          <View style={styles.addressSection}>
            <Text style={styles.subHeader}>Recipient Details</Text>
            <Text style={styles.text}>Corporate Sports Club Private Limited</Text>
            <Text style={styles.text}>Address: No 166, 2nd Floor, D-Block, R.V. Nagar Main Road, Anna Nagar East, Chennai, TN, 600102</Text>
            <Text style={styles.text}>GSTIN: 33AAFCC3766M3ZC</Text>
            <Text style={styles.text}>State Code: 33</Text>
            <Text style={styles.text}>PAN Number: AAFCC3766M</Text>
          </View>
          <View style={styles.divider} />
          {hasClientDetails && (
            <View style={styles.addressSection}>
              <Text style={styles.subHeader}>Client Details</Text>
              {registration.companyName && <Text style={styles.text}>{registration.companyName}</Text>}
              {user?.address && <Text style={styles.text}>Address: {user?.address}</Text>}
              {registration.gstNumber && <Text style={styles.text}>GSTIN: {registration.gstNumber}</Text>}
              {registration.gstNumber && <Text style={styles.text}>State Code: {registration.gstNumber.substring(0, 2)}</Text>}
              <View style={styles.divider} />
            </View>
          )}
          <View style={styles.orderDetailsSection}>
            <Text style={styles.subHeader}>Order Details</Text>
            <Text style={styles.text}><Text style={styles.boldText}>Order Date:</Text> {new Date(registration.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.text}><Text style={styles.boldText}>Invoice Date:</Text> {new Date(registration.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.text}><Text style={styles.boldText}>Registration ID:</Text> {registration.id}</Text>
            <Text style={styles.text}><Text style={styles.boldText}>Event:</Text> {registration.event.name}</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>S.No</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>
                Amount<Image src="/rupee.png" style={{ width: 10, height: 10 }} />
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>
                Total<Image src="/rupee.png" style={{ width: 10, height: 10 }} />
              </Text>
            </View>
          </View>
          {Array.isArray(registration.orderDetails) ? (
            registration.orderDetails.map((orderDetail, index) => (
              <View style={styles.tableRow} key={orderDetail.id} wrap={false}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {orderDetail.sport?.name || 'N/A'} - {orderDetail.sportCategory?.name || 'N/A'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{orderDetail.quantity}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {orderDetail.fee}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {orderDetail.fee * orderDetail.quantity}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow} wrap={false}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>1</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {registration.event.name}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{registration.orderDetails.quantity || 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {registration.orderDetails.fee || 'N/A'}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {subtotal.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.totalSection}>
          <Text style={[styles.boldText, styles.totalText]}>
            Subtotal: {subtotal.toFixed(2)}
          </Text>
          <Text style={[styles.boldText, styles.totalText]}>
            GST (18%): {gst.toFixed(2)}
          </Text>
          <Text style={styles.largerBoldText}>
            Grand Total:<Image src="/rupee.png" style={{ width: 10, height: 10 }} />{grandTotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalDivider} />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
