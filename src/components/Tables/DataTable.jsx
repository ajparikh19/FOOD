import React, { useState, useEffect } from "react";
import ToggleSwitch from "../atoms/ToggleSwitch/ToggleSwitch"; // Ensure this path is correct
import Dropdown from "../atoms/Dropdown/Dropdown";
import { useReactTable } from "@tanstack/react-table";
import Loader from "../atoms/loader/Loader";
import { formatDateInHyphen } from "../../constants/functions";

const GenericTable = ({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  onToggleAdminStatus,
  onToggleAppointment,
  onToggleRequired,
  onToggleBookable,
  onTogglePaid,
  onToggleSpecial,
  onToggleFestival,
  onToggleHalfHoliday,
  onToggleDoctor,
  rowsPerPage = 5,
  currentPage = 1,
  totalPages = 1,
  sortConfig,
  onPageChange,
  onRowsPerPageChange,
  loading,
  onSort,
  onAvaliable = false,
  onStatusChange,
  customRowRender,
  getRowActions,
  onPaynow,
  handleAddCompnay
}) => {
  const [localRowsPerPage, setLocalRowsPerPage] = useState(rowsPerPage);

  useEffect(() => {
    setLocalRowsPerPage(rowsPerPage);
  }, [rowsPerPage]);

  const items = [
    {
      label: "NEW OPD APPOINTMENT",
      color: "rgba(116, 192, 252, 0.33)",
      value: "New OPD Appointment",
    },
    { label: "EMERGENCY", color: "rgba(12, 11, 11, 0.25)", value: "emergency" },
    {
      label: "FOLLOW UP OPD APPOINTMENT",
      color: "rgba(255, 212, 59, 0.42)",
      value: "Follow Up OPD Appointment",
    },
    {
      label: "SURGERY POST-OP",
      color: "rgba(240, 128, 128, 0.62)",
      value: "Surgery Post Oprative Appointment",
    },
    {
      label: "SURGERY PRE-OP",
      color: "rgba(100, 240, 81, 0.48)",
      value: "Surgery Pre Oprative Appointment",
    },
    {
      label: "STITCHES REMOVAL",
      color: "rgba(189, 99, 253, 0.43)",
      value: "stitches removal",
    },
  ];

  const getCategoryColor = (category) => {
    const matchedItem = items?.find((item) => item?.value === category);
    return matchedItem ? matchedItem?.color : "transparent";
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = Number(e.target.value);
    setLocalRowsPerPage(newRowsPerPage);
    if (onRowsPerPageChange) onRowsPerPageChange(newRowsPerPage);
  };

  // console.log(`DATA`, data);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const table = useReactTable({
    columns,
    data,
    onEdit,
    onDelete,
    onToggleStatus,
    onToggleAdminStatus,
    rowsPerPage,
    currentPage,
    totalPages,
    sortConfig,
    onPageChange,
    onRowsPerPageChange,
    onSort,

    meta: {
      onToggleStatus,
      onToggleAdminStatus,
      onDelete,
      onEdit,
    },
  });

  const resolveAccessor = (item, accessor) => {
    if (!accessor) return undefined;
    return accessor.split(".").reduce((acc, key) => acc && acc[key], item);
  };

  const renderCellContent = (item, column) => {
    const toggleSwitches = {
      status: { onToggle: onToggleStatus, getValue: (val) => val },
      is_admin_user: { onToggle: onToggleAdminStatus, getValue: (val) => val },
      is_required: {
        onToggle: onToggleRequired,
        getValue: (val) => String(val),
      },
      is_appointmentble: {
        onToggle: onToggleAppointment,
        getValue: (val) => String(val),
      },
      is_bookable: {
        onToggle: onToggleBookable,
        getValue: (val) => String(val),
      },
      is_paid: { onToggle: onTogglePaid, getValue: (val) => String(val) },
      is_special: { onToggle: onToggleSpecial, getValue: (val) => String(val) },
      is_festival: {
        onToggle: onToggleFestival,
        getValue: (val) => String(val),
      },
      is_half_holiday: {
        onToggle: onToggleHalfHoliday,
        getValue: (val) => String(val),
      },
      is_doctor: { onToggle: onToggleDoctor, getValue: (val) => String(val) },
    };

    const accessor = column?.accessor;

    if (toggleSwitches[accessor]) {
      const { onToggle, getValue } = toggleSwitches[accessor];
      return (
        <ToggleSwitch
          status={getValue(item[accessor])}
          onToggle={(id) => onToggle(item._id, item[accessor])} // Use item._id
          id={item?._id} // Changed from item?.id
        />
      );
    }

    if (accessor.includes("date") || accessor === "dob") {
      return formatDateInHyphen(item[accessor]);
    }

    if (accessor === "seq_id") {
      return (
        <div
          className="d-flex justify-content-start gap-3 align-items-center"
        >
          <span>{item[accessor]}</span>
          {item?.appointment_from === "telephonic" ? (
            <i className="ri-phone-line"></i>
          ) : item?.appointment_from === "walking" ? (
            <i className="ri-walk-line"></i>
          ) : null}
        </div>
      );
    }

    if (
      accessor === "appointment_status" &&
      typeof item[accessor] === "object"
    ) {
      return item[accessor];
    }

    return resolveAccessor(item, accessor);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            {columns &&
              columns?.length > 0 &&
              columns?.map((column) => (
                <th
                  key={column?.accessor}
                  onClick={() => onSort(column?.accessor)}
                  style={{ cursor: "pointer" }}
                >
                  {column?.Header}
                  {sortConfig.key === column?.accessor && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
              ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns?.length + 1} className="text-center">
                <Loader />
              </td>
            </tr>
          ) : data && data?.length > 0 ? (
            data?.map((item) => {
              const rowData = customRowRender ? customRowRender(item) : item;
              return (
                <tr key={item?._id}>
                  {columns.map((column) => (
                    <td
                      key={column?.accessor}
                      style={{ backgroundColor: "transparent" }}
                    >
                      {renderCellContent(rowData, column)}
                    </td>
                  ))}

                  <td>
                    <Dropdown>
                      {getRowActions &&
                        getRowActions.length > 0 &&
                        getRowActions(item)?.map((action, index) => (
                          <li key={index}>
                            <button
                              className="dropdown-item"
                              onClick={action.onClick}
                            >
                              <i className={`${action.icon} me-2`}></i>{" "}
                              {action.label}
                            </button>
                          </li>
                        ))}
                      {onView && (
                        <li>
                          <button
                            className="dropdown-item text-primary"
                            onClick={() => onView(item?._id)}
                          >
                            <i className="ri-eye-line me-2"></i>View
                          </button>
                        </li>
                      )}
                      {onEdit && (
                        <li>
                          <button
                            className="dropdown-item text-warning"
                            onClick={() => onEdit(item?._id)}
                          >
                            <i className="ri-edit-line me-2"></i>Edit
                          </button>
                        </li>
                      )}
                      {onDelete && (
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => onDelete(item?._id)}
                          >
                            <i className="ri-delete-bin-line me-2"></i>Delete
                          </button>
                        </li>
                      )}
                      {handleAddCompnay  && (
                        <li>
                          <button
                            className="dropdown-item text-success"
                            onClick={() => handleAddCompnay(item)}
                          >
                            <i className="fa-solid fa-building me-2"></i>
                            Add Company
                          </button>
                        </li>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <label className="form-label me-2">Items per page:</label>
          <select
            className="form-control w-auto d-inline-block"
            value={localRowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[2, 5, 10, 15].map((rows) => (
              <option key={rows} value={rows}>
                {rows} items
              </option>
            ))}
          </select>
        </div>

        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default GenericTable;
