import API from "../http/api";
import { toast } from "react-toastify"; // Importing toast from react-toastify

const apiRequestHandler = async ({
  endpoint,
  method = "GET",
  payload = null,
  queryParams = null,
  headers = {}, // Accept headers from caller
  successMessage = "Operation successful",
  navigateTo = null,
  navigate = null,
}) => {
  let response = null;
  let error = null;

  try {
    const queryString = queryParams
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "";

    const url = `${endpoint}${queryString}`;

    const config = {
      headers, // Pass custom headers
    };

    switch (method) {
      case "POST":
        response = await API.post(url, payload, config);
        break;
      case "PUT":
        response = await API.put(url, payload, config);
        break;
      case "GET":
        response = await API.get(url, config);
        break;
      case "DELETE":
        response = await API.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    if (response.status === 200 || response.status === 201) {
      toast.success(response?.data?.message || successMessage);
      if (navigate && navigateTo) {
        navigate(navigateTo);
      }
      return { success: successMessage, response };
    } else if (response.status === 422) {
      error =
        response?.data?.message ||
        "Validation error occurred. Please check your input.";
      toast.error(error);
    }
  } catch (err) {
    console.error("API request error:", err);
    error =
      err?.response?.data?.message ||
      "An unexpected error occurred. Please try again.";
    toast.error(error);
  }

  return { error, response };
};

export default apiRequestHandler;


/**
 * Fetches entity details by ID from a given endpoint.
 * @param {string} endpoint - API endpoint to fetch the entity details.
 * @param {string} id - The ID of the entity to fetch.
 * @returns {Promise<{data: object|null, error: string|null}>}
 */


export const fetchEntityDetails = async (endpoint, id ) => {
  try {
    // If id is passed, use it in the URL; otherwise, use the endpoint as is.
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response = await API.get(url);
    return { data: response?.data, error: null };
  } catch (error) {
    console.error(`Failed to fetch details for ${endpoint}:`, error);
    return { data: null, error: `Failed to fetch data for ${endpoint}` };
  }
};

 