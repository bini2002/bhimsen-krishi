import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
    border: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
    borderBottom: "1px solid #000", // Add a border for better visibility
    paddingBottom: 5,
  },
  tableCol: {
    width: "50%",
    padding: 5,
    // Removing the border right since we are managing borders with the row
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
  },
  value: {
    fontSize: 12,
    textAlign: "right",
  },
});

// PDF Document component
const PDFDocument = ({ costSheet, commodityName }: any) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{costSheet.title}</Text>
      <Text style={styles.title}>{commodityName}</Text>

      {/* Current Expenditure Section */}
      <Text style={styles.label}>Current Expenditure</Text>
      <View style={styles.section}>
        {[
          { label: "Land Rent", value: costSheet.currentExpenditure.landRent },
          {
            label: "Labor Quantity",
            value: costSheet.currentExpenditure.laborQuantity,
          },
          {
            label: "Labor Wage Rate",
            value: costSheet.currentExpenditure.laborWageRate,
          },
          {
            label: "Permanent Manpower Quantity",
            value: costSheet.currentExpenditure.permanentManpowerQuantity,
          },
          {
            label: "Permanent Manpower Monthly Salary",
            value: costSheet.currentExpenditure.permanentManpowerMonthlySalary,
          },
          {
            label: "Wooden Support Quantity",
            value: costSheet.currentExpenditure.woodenSupportQuantity,
          },
          {
            label: "Wooden Support Cost",
            value: costSheet.currentExpenditure.woodenSupportCost,
          },
          {
            label: "Seed Quantity",
            value: costSheet.currentExpenditure.seedQuantity,
          },
          {
            label: "Seed Cost Price",
            value: costSheet.currentExpenditure.seedCostPrice,
          },
          {
            label: "Compost Manure Quantity",
            value: costSheet.currentExpenditure.compostManureQuantity,
          },
          {
            label: "Urea Quantity",
            value: costSheet.currentExpenditure.ureaQuantity,
          },
          {
            label: "Urea Market Price",
            value: costSheet.currentExpenditure.ureaMarketPrice,
          },
          {
            label: "DAP Quantity",
            value: costSheet.currentExpenditure.dapQuantity,
          },
          { label: "DAP Price", value: costSheet.currentExpenditure.dapPrice },
          {
            label: "Potash Quantity",
            value: costSheet.currentExpenditure.potashQuantity,
          },
          {
            label: "Potash Price",
            value: costSheet.currentExpenditure.potashPrice,
          },
          {
            label: "Micro Elements & Hormones Cost",
            value: costSheet.currentExpenditure.microElementsAndHormonesCost,
          },
          {
            label: "Crop Protection Chemicals Cost",
            value: costSheet.currentExpenditure.cropProtectionChemicalsCost,
          },
          {
            label: "Farm Operation & Management Cost",
            value: costSheet.currentExpenditure.farmOperationAndManagementCost,
          },
          {
            label: "Annual Miscellaneous Cost",
            value: costSheet.currentExpenditure.annualMiscellaneousCost,
          },
          {
            label: "Gradual Crop Cost",
            value: costSheet.currentExpenditure.gradualCropCost,
          },
        ].map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.tableCol}>
              <Text style={styles.label}>{item.label}</Text>
            </Text>
            <Text style={styles.tableCol}>
              <Text style={styles.value}>{item.value}</Text>
            </Text>
          </View>
        ))}
      </View>

      {/* Fixed Capital Section */}
      <Text style={styles.label}>Fixed Capital</Text>
      <View style={styles.section}>
        {[
          { label: "Tunnel Cost", value: costSheet.fixedCapital.tunnelCost },
          {
            label: "Equipment Cost",
            value: costSheet.fixedCapital.equipmentCost,
          },
          {
            label: "Machinery Cost",
            value: costSheet.fixedCapital.machineryCost,
          },
          {
            label: "Irrigation Set Cost",
            value: costSheet.fixedCapital.irrigationSetCost,
          },
          {
            label: "Transportation Cost",
            value: costSheet.fixedCapital.transportationCost,
          },
          {
            label: "Electricity & Pump Set Cost",
            value: costSheet.fixedCapital.electricityAndPumpSetCost,
          },
          {
            label: "Mulching Plastic Rolls",
            value: costSheet.fixedCapital.mulchingPlasticRolls,
          },
          {
            label: "Mulching Plastic Cost Per Roll",
            value: costSheet.fixedCapital.mulchingPlasticCostPerRoll,
          },
        ].map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.tableCol}>
              <Text style={styles.label}>{item.label}</Text>
            </Text>
            <Text style={styles.tableCol}>
              <Text style={styles.value}>{item.value}</Text>
            </Text>
          </View>
        ))}
      </View>

      {/* Current Capital Details Section */}
      <Text style={styles.label}>Current Capital Details</Text>
      <View style={styles.section}>
        {[
          {
            label: "Labor Period",
            value: costSheet.currentCapitalDetails.laborPeriod,
          },
          {
            label: "Technical Cost",
            value: costSheet.currentCapitalDetails.technicalCost,
          },
          {
            label: "Land Preparation Cost",
            value: costSheet.currentCapitalDetails.landPreparationCost,
          },
          {
            label: "Insurance Cost",
            value: costSheet.currentCapitalDetails.insuranceCost,
          },
          {
            label: "Capital Miscellaneous Cost",
            value: costSheet.currentCapitalDetails.capitalMiscellaneousCost,
          },
        ].map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.tableCol}>
              <Text style={styles.label}>{item.label}</Text>
            </Text>
            <Text style={styles.tableCol}>
              <Text style={styles.value}>{item.value}</Text>
            </Text>
          </View>
        ))}
      </View>

      {/* Production Details Section */}
      <Text style={styles.label}>Production Details</Text>
      <View style={styles.section}>
        {[
          {
            label: "Main Production",
            value: costSheet.productionDetails.mainProduction,
          },
          {
            label: "Selling Price",
            value: costSheet.productionDetails.sellingPrice,
          },
          {
            label: "Gradual Crop Production",
            value: costSheet.productionDetails.gradualCropProduction,
          },
          {
            label: "Gradual Crop Sale Price",
            value: costSheet.productionDetails.gradualCropSalePrice,
          },
        ].map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.tableCol}>
              <Text style={styles.label}>{item.label}</Text>
            </Text>
            <Text style={styles.tableCol}>
              <Text style={styles.value}>{item.value}</Text>
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
