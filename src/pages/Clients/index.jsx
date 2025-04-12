import React, { useEffect, useState } from "react";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { clientColumns } from "./ClientModel.jsx"; // Define the appropriate columns for clients
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

export default function Clients() {
  useDocumentTitle("Clients");
  const navigate = useNavigate();
  const clientFilterOptions = ["All", "Name", "Status", "Company", "Email"];

  // State for search and filters
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "_id",
    sortOrder: "desc",
    filters: {},
  });

  // Fetch client data with pagination, search, and sorting
  const {
    data: initialClients,
    loading,
    currPage,
    rowsPerPage,
    totalPages,
    totalItems,
    searchKey,
    setSearchKey,
    sortConfig,
    addFilter,
    removeFilter,
    activeFilters,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
    handleSearch,
    error,
  } = useFetchData({
    endpoint: "client",
    initialSortConfig: { key: "_id", direction: "desc" },
    initialRowsPerPage: 10,
    searchParams,
    onSearchParamsChange: setSearchParams,
    responseMapper: (response) => ({
      data: response.data || [],
      totalItems: response.total || 0,
      totalPages: response.totalPages || 1,
      currentPage: response.page || 1,
      rowsPerPage: response.limit || 10,
    }),
  });

  if (error) {
    return (
      <p className="text-danger">Error loading clients: {error.message}</p>
    );
  }

  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (initialClients && initialClients.length > 0) {
      console.log("Received clients data:", initialClients); // Debug log
      setClients(initialClients);
    } else {
      console.log("No clients data received");
      setClients([]);
    }
  }, [initialClients]);

  useEffect(() => {
    const clientsWithSeqId = addSequentialIds(
      initialClients,
      currPage,
      rowsPerPage
    );
    setClients(clientsWithSeqId);
  }, [initialClients, currPage, rowsPerPage]);

  const handleToggleStatus = async (id, currentStatus) => {
    await toggleStatus({
      id,
      currentStatus,
      moduleName: "Client",
      entityList: clients,
      setEntityList: setClients,
    });
  };

  // const handleFilterSelect = (key) => {
  //   onFilterSelect(key.toLowerCase()); // Example: "Name" -> "name"
  // };

  const handleEdit = (id) => {
    navigate(routes.EditClient.replace(":id", id));
  };

  const handleView = (id) => {
    if (!id) {
      console.error("No ID provided for view action");
      return;
    }
    console.log("Viewing client ID:", id, "Type:", typeof id);
    navigate(routes.ViewClient.replace(":id", id));
  };

  const handleAddCompnay = (item) => {
    if (!item?._id) {
      console.error("No ID provided for view action");
      return;
    }
    console.log("Viewing client ID:", item?._id, "Type:", typeof item?._id);
    navigate(routes.AddCompany.replace(":clientId", item?._id));
  };

  const handleClientDelete = async (id) => {
    try {
      await handleDelete(id, "client", setClients, clients);
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const handleSearchSubmit = (searchValue) => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchValue,
      page: 1, // Reset to first page on new search
    }));
  };

  return (
    <div className="app-content main-content">
      <div className="container-fluid">
        <div className="my-3 d-flex align-items-center"></div>
        <div className="card custom-card">
          <div className="card-header justify-content-between">
            <div className="card-title">Client Details</div>
            <Search
              addFilter={addFilter}
              filterOptions={clientFilterOptions}
              searchKey={searchKey}
              setSearchKey={setSearchKey}
              onSubmit={handleSearchSubmit}
              onFilterSelect={(filterKey) => setSelectedFilter(filterKey)}
            />
            <div className="d-flex justify-content-end gap-2 align-items-center">
              <Export data={clients} fileName="ClientData" />
              <Button
                label="Add New Client"
                icon="ri-add-line"
                to={routes.AddClient}
                variant="primary-light"
                size="sm"
              />
            </div>
          </div>
          <ActiveFiltersDisplay
            activeFilters={activeFilters}
            removeFilter={removeFilter}
          />
          <div className="card-body p-2">
            <GenericTable
              columns={clientColumns} // Define the columns in ClientModel.js
              data={clients}
              onEdit={handleEdit}
              onDelete={(id) => {
                // Immediately remove from UI
                setClients((prev) => prev.filter((c) => c._id !== id));

                // Then call API
                handleClientDelete(id);
              }}
              onView={handleView}
              onToggleStatus={handleToggleStatus}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSort={handleSort}
              currentPage={currPage}
              rowsPerPage={rowsPerPage}
              sortConfig={sortConfig}
              totalPages={totalPages}
              loading={loading}
              handleAddCompnay={handleAddCompnay}
              totalItems={totalItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
