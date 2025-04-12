
import React from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Export = ({ data, fileName }) => {
  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${fileName} Data`, 14, 16);

    // Generate table headers dynamically from keys
    const headers = Object.keys(data[0] || {});
    const tableData = data.map((row) => headers.map((key) => row[key]));

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="dropdown">
      <i
        id="exportDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        className="ri-file-download-line fs-3 ptr"
      ></i>
      <ul className="dropdown-menu" aria-labelledby="exportDropdown">
        <li>
          <button className="dropdown-item" onClick={handleExcelExport}>
            Export to Excel
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handlePDFExport}>
            Export to PDF
          </button>
        </li>
      </ul>
    </div>
  );
};

Export.propTypes = {
  data: PropTypes.array.isRequired, // Data to be exported
  fileName: PropTypes.string.isRequired, // File name for export
};

export default Export;
