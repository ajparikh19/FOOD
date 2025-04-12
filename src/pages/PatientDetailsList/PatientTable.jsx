import React, { useEffect, useState } from "react";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { patientColumns } from "./PatientModel.jsx"; // Add appropriate columns for patients
import routes from "../../constants/routesConstants.js";
import Button from "../../components/atoms/Button/Button.jsx";
import Export from "../../components/utils/exports";
import useFetchData from "../../hooks/useFetchData";
import toggleStatus from "../../hooks/toogleStatus";
import handleDelete from "../../hooks/handleDelete";
import { useNavigate } from "react-router-dom";
import { addSequentialIds } from "../../components/utils/tableUtils";
import Search from "../../components/search/Search.jsx";
import ActiveFiltersDisplay from "../../components/search/FilterDisplay.jsx";
import GenericTable from "../../components/Tables/DataTable.jsx";

export default function Patient() {
    useDocumentTitle("Patient");
    const navigate = useNavigate();
    const patientFilterOptions = ["All", "Name", "Status", "Age"];

    // Use the reusable fetch hook
    const {
        data: initialPatients,
        loading,
        currPage,
        rowsPerPage,
        totalPages,
        searchKey,
        setSearchKey,
        sortConfig,
        addFilter,
        removeFilter,
        activeFilters,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
    } = useFetchData({
        endpoint: "patient",
        initialSortConfig: { key: "id", direction: "desc" },
        initialRowsPerPage: 5,
    });

    const [patients, setPatients] = useState(initialPatients);

    useEffect(() => {
        setPatients(initialPatients);
    }, [initialPatients]);

    useEffect(() => {
        const patientsWithSeqId = addSequentialIds(initialPatients, currPage, rowsPerPage);
        setPatients(patientsWithSeqId);
    }, [initialPatients, currPage, rowsPerPage]);

    const handleToggleStatus = async (id, currentStatus) => {
        await toggleStatus({
            id,
            currentStatus,
            moduleName: "Patient",
            entityList: patients,
            setEntityList: setPatients,
        });
    };

    const handleEdit = (id) => {
        navigate(routes.EditPatient.replace(":id", id));
    };

    const handlePatientDelete = (id) => {
        handleDelete(id, "patient", setPatients, patients);
    };

    return (
        <div className="app-content main-content">
            <div className="container-fluid">
                <div className="my-3 d-flex align-items-center"></div>
                <div className="card custom-card">
                    <div className="card-header justify-content-between">
                        <div className="card-title">Patient Details</div>
                        <Search
                            addFilter={addFilter}
                            filterOptions={patientFilterOptions}
                            searchKey={searchKey}
                            setSearchKey={setSearchKey}
                        />
                        <div className="d-flex justify-content-end gap-2 align-items-center">
                            <Export data={patients} fileName="PatientData" />
                            {/* <Button
                                label="Add New Patient"
                                icon="ri-add-line"
                                to={routes.AddPatient}
                                variant="primary-light"
                                size="sm"
                            /> */}
                        </div>
                    </div>
                    <ActiveFiltersDisplay activeFilters={activeFilters} removeFilter={removeFilter} />
                    <div className="card-body p-2">
                        <GenericTable
                            columns={patientColumns} // Define the columns in PatientModel.js
                            data={patients}
                            onEdit={handleEdit}
                            onDelete={handlePatientDelete}
                            onToggleStatus={handleToggleStatus}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSort={handleSort}
                            currentPage={currPage}
                            rowsPerPage={rowsPerPage}
                            sortConfig={sortConfig}
                            totalPages={totalPages}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
