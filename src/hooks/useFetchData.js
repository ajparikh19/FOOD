import { useState, useEffect } from "react";
import useDebounce from "./debounce";
import API from "../http/api";

const useFetchData = ({
  endpoint,
  initialSortConfig = { key: "created_at", direction: "desc" },
  initialRowsPerPage = 5,
  initialPage = 1,
}) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currPage, setCurrPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const debouncedSearchKey = useDebounce(searchKey, 500);
  const [totalItems, setTotalItems] = useState(0);
  const [dates, setDates] = useState({
    date_type:"day",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    start: new Date().toISOString().split("T")[0], // Default to today's date
    end: new Date().toISOString().split("T")[0] // Default to today's date
  });
  

  const refreshData = async () => {
    const response = await API.get(endpoint, { params: buildQueryParams() });
    setData(response.data);
  };

  

  // Build query parameters based on activeFilters and searchKey
  const buildQueryParams = () => {
    const params = {
      sortBy: sortConfig.key,
      order: sortConfig.direction,
      page: currPage,
      limit: rowsPerPage,
    };

    // Add the search parameter based on selectedFilter and debouncedSearchKey
    if (debouncedSearchKey) {
      const key = selectedFilter ? `search[${selectedFilter}]` : "search[name]";
      params[key] = debouncedSearchKey;
    }

    if (status && status.length > 0) {
      params.search = params.search || {}; // Ensure the search object exists
      params.search.appointment_from = status.join(","); // Join status into a comma-separated string
      params.page = 1; // Reset page to 1
    }
    
    if (selectedCategory && selectedCategory.length > 0) {
      params.search = params.search || {}; // Ensure the search object exists
      params.search.appointment_category = selectedCategory.join(","); // Join category into a comma-separated string
      params.page = 1; // Reset page to 1
    }
    

    if (dates) {
      if (dates.date_type === "custom") {
        params.start_date = dates.start;
        params.end_date = dates.end;
      } else {
        params.date = dates.date;
      }
      params.date_type = dates.date_type;
    }
    

    // Add active filters as query parameters
    activeFilters.forEach((filter) => {
      const [key, value] = filter.split(" : ");
      params[`search[${key}]`] = value;
    });

    return params;
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await API.get(endpoint, { params: buildQueryParams() });

        if (Array.isArray(response.data)) {
          setData(response.data);
          // setTotalPages(Math.ceil(response.total_items / rowsPerPage));
          setTotalPages(Math.ceil(response.total / rowsPerPage));
          setTotalItems(response.total);
        } else {
          console.error("Unexpected response structure:", response.data);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currPage, rowsPerPage, debouncedSearchKey, sortConfig, endpoint, activeFilters,status,dates ,selectedCategory]);

  // Add a filter
  const addFilter = (filterEntry) => {
    setActiveFilters((prevFilters) => {
      const existingFilterIndex = prevFilters.findIndex((filter) =>
        filter.startsWith(`${filterEntry.split(" : ")[0]} :`)
      );

      if (existingFilterIndex !== -1) {
        const existingFilter = prevFilters[existingFilterIndex];
        const [filterKey, filterValues] = existingFilter.split(" : ");
        const newFilterValues = `${filterValues}, ${filterEntry.split(" : ")[1]}`;
        const updatedFilter = `${filterKey} : ${newFilterValues}`;

        return [
          ...prevFilters.slice(0, existingFilterIndex),
          updatedFilter,
          ...prevFilters.slice(existingFilterIndex + 1),
        ];
      }

      return [...prevFilters, filterEntry];
    });
  };

  // Remove a filter
  const removeFilter = (filterToRemove) => {
    setActiveFilters((prevFilters) =>
      prevFilters.filter((filter) => filter !== filterToRemove)
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrPage(page);
    }
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    // fetchData(rows, currPage);
    setCurrPage(1); // Reset to first page when changing rows per page
  };

  const handleSort = (accessor) => {
    if (accessor === 'seq_id') return;
    setSortConfig((prevConfig) => ({
      key: accessor,
      direction: prevConfig.key === accessor && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  return {
    data,
    refreshData,
    loading,
    currPage,
    rowsPerPage,
    totalPages,
    searchKey,
    setSearchKey,
    sortConfig,
    setSortConfig,
    activeFilters,
    addFilter,
    removeFilter,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
    setActiveFilters,
    setSelectedFilter,
    setLoading,
    setTotalPages ,
    status,
    setStatus,
    dates ,
    setDates,
    setSelectedCategory ,
    totalItems,
  };
};

export default useFetchData;
