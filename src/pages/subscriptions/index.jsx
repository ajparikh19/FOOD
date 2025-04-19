import React, { useEffect, useState } from "react";
import { useDocumentTitle } from "@uidotdev/usehooks";
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
import { subscriptionColumns } from "./subscriptionPlanModel.jsx";
import { toast } from "react-toastify";
import Loader from "../../components/atoms/loader/Loader.jsx";
import "../subscriptions/subscriptions.css";

export default function Subscriptions() {
  useDocumentTitle("Subscription Plans");
  const navigate = useNavigate();
  const subscriptionFilterOptions = [
    { value: "All", label: "All" },
    { value: "Name", label: "Name" },
    { value: "Price", label: "Price" },
    { value: "Duration", label: "Duration" },
    { value: "Status", label: "Status" },
  ];

  // State for search and filters
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "_id",
    sortOrder: "desc",
    filters: {},
  });

  // Fetch subscription data
  const {
    data: initialSubscriptions,
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
    endpoint: "subscription-plans",
    initialSortConfig: { key: "_id", direction: "desc" },
    initialRowsPerPage: 10,
    searchParams: { ...searchParams, refresh: searchParams.refresh || 0 },
    onSearchParamsChange: setSearchParams,
    responseMapper: (response) => ({
      data: response.data || [],
      totalItems: response.total || 0,
      totalPages: response.totalPages || 1,
      currentPage: response.page || 1,
      rowsPerPage: response.limit || 10,
    }),
  });

  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const subsWithSeqId = addSequentialIds(
      initialSubscriptions,
      currPage,
      rowsPerPage
    );
    setSubscriptions(subsWithSeqId);
  }, [initialSubscriptions, currPage, rowsPerPage]);

  const handleToggleStatus = async (id, currentStatus) => {
    await toggleStatus({
      id,
      currentStatus,
      moduleName: "Subscription Plan",
      entityList: subscriptions,
      setEntityList: setSubscriptions,
    });
  };

  const handleEdit = (id) => {
    navigate(routes.EditSubscription.replace(":id", id));
  };

  // const handleView = (id) => {
  //   if (!id) {
  //     console.error("No ID provided for view action");
  //     return;
  //   }
  //   navigate(routes.ViewSubscription.replace(":id", id));
  // };

  const handleSubscriptionDelete = async (id) => {
    try {
      setSubscriptions(prev => prev.filter(plan => plan._id !== id))
      await handleDelete(
        id,
        "subscription-plans",
        setSubscriptions,
        subscriptions,
        setSearchParams(prev => ({ ...prev, refresh: Date.now() }))
      );
    } catch (error) {
      toast.error("Failed to delete subscription plan");
      setSubscriptions(initialSubscriptions);
    }
  };

  const handleSearchSubmit = (searchValue) => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchValue,
      page: 1,
    }));
  };

  return (
    <div className="app-content main-content">
      <div className="container-fluid">
        <div className="my-3 d-flex align-items-center"></div>
        <div className="card custom-card">
          <div className="card-header justify-content-between">
            <div className="card-title">Subscription Plans</div>
            <Search
              addFilter={addFilter}
              filterOptions={subscriptionFilterOptions}
              searchKey={searchKey}
              setSearchKey={setSearchKey}
              onSubmit={handleSearchSubmit}
            />
            <div className="d-flex justify-content-end gap-2 align-items-center">
              <Export data={subscriptions} fileName="SubscriptionPlans" />
              <Button
                label="Add New Plan"
                icon="ri-add-line"
                to={routes.AddSubscription}
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
            {loading ? (
              <Loader />
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="subscription-card-grid">
                {subscriptions.map((plan) => (
                  <div className="subscription-card" key={plan._id}>
                    <div className="subscription-card-header">
                      <h5 className="mb-2">{plan.name}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge ${
                            plan.isActive ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                        {plan.trialDays > 0 && (
                          <span className="badge bg-warning text-dark">
                            {plan.trialDays}-day Trial
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="subscription-card-features">
                      <div className="subscription-card-price mb-3">
                        {plan.currency} {plan.price}
                        <span className="subscription-card-duration ms-2">
                          / {plan.durationDays} days
                        </span>
                      </div>

                      <ul className="list-unstyled">
                        {plan.features.map((feature, index) => (
                          <li key={index}>
                            <i className="ri-checkbox-circle-fill text-primary"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="subscription-card-actions">
                      <div className="d-flex justify-content-between gap-2">
                        {/* <Button
                          variant="primary"
                          className="btn-view"
                          size="sm"
                          onClick={() => handleView(plan._id)}
                          label="View"
                          style={{ minWidth: "70px" }}
                        >
                          
                          View
                        </Button> */}
                        <Button
                          variant="warning"
                          className="btn-edit"
                          size="sm"
                          onClick={() => handleEdit(plan._id)}
                          style={{ minWidth: "70px" }} 
                          label="Edit"
                        >
                          <i className="ri-pencil-line me-1"></i>
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          className="btn-delete"
                          size="sm"
                          onClick={() => handleSubscriptionDelete(plan._id)}
                          style={{ minWidth: "70px" }}
                          label="Delete"
                        >
                          <i className="ri-delete-bin-line me-1"></i>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
