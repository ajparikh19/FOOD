import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// import API from "../../../http/api";
import { ToastContainer, toast } from "react-toastify";
import {
  validateRequired,
  validateEmail,
  validatePhone,
} from "../../components/utils/validation";
import apiRequestHandler, {
  fetchEntityDetails,
} from "../../hooks/apiRequestHandler";
import GenericForm from "../../components/Organisms/AddForm";
import API from "../../http/api";
import Loader from "../../components/atoms/loader/Loader";
import routes from "../../constants/routesConstants";

export default function AddCompany() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Check if we're in edit mode by looking at the URL path
  const isEditMode = location.pathname.includes("/edit/");
  const companyId = isEditMode ? params.id : null;
  const clientId = !isEditMode ? params.clientId : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Single state object to manage all form fields
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gstNumber: "24ABCDE1234F1Z5",
    logo: "",
    documents: [],
  });

  // Fetch imaplan details for editing
  useEffect(() => {
    if (companyId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          //  const { data, error } = await fetchEntityDetails("implants", { id: companyId });
          const { data, error } = await fetchEntityDetails(
            "companies",
            companyId
          );
          // const { data, error } = await API.get(`/client/${id}`);

          if (error) {
            setError(error);
          } else if (data) {
            setFormData({
              name: data.name || "",
              address: data.address || "",
              gstNumber: data.gstNumber || "",
              logo: null,
              documents: [],
            });

            if (data.logo) setPhotoPreview(data.logo);
          }
        } catch (error) {
          toast.error("failed to fetch client data ");
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [companyId]);

  // Handle change for form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file change for photo upload
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPhotoPreview(reader.result);
  //       setFormData((prev) => ({
  //         ...prev,
  //         photoUrl: reader.result,
  //         photo: file,
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "logo" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
      setFormData((prev) => ({ ...prev, logo: files[0] }));
    } else if (name === "documents") {
      setFormData((prev) => ({ ...prev, documents: files }));
    }
  };

  const formFields = [
    {
      label: "Name",
      type: "text",
      name: "name",
      placeholder: "Enter Name",
      value: formData.fullName,
      required: !companyId,
      validation: (v) => (companyId ? true : validateRequired(v, "Name")),
    },
    {
      label: "Address",
      type: "textarea",
      name: "address",
      placeholder: "Enter Address",
      value: formData.address,
    },

    {
      label: "GST Number",
      type: "text",
      name: "gstNumber",
      placeholder: "Enter GST Number",
      value: formData.gstNumber,
      required: !companyId,
      validation: (v) => validateRequired(v, "gstNumber").test(v),
    },
    {
      label: "Logo",
      type: "file",
      name: "logo",
      onChange: handleFileChange,
      accept: "image/*",
      preview: photoPreview,
    },
    {
      label: "Documents",
      type: "file",
      name: "documents",
      onChange: handleFileChange,
      accept: "image/*,application/pdf",
      multiple: true, // 👈 Add this flag
      required: true,
    },
  ].filter(Boolean);

  // Handle form submission

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("ownerId", clientId);
      formDataToSend.append("name", data.name);
      formDataToSend.append("address", data.address);
      formDataToSend.append("gstNumber", data.gstNumber);
      if (data.logo) formDataToSend.append("logo", data.logo);
      if (data.documents?.length > 0) {
        Array.from(data.documents).forEach((doc) => {
          formDataToSend.append("documents", doc);
        });
      }

      const endpoint = isEditMode ? `companies/${companyId}` : "companies";
      const method = isEditMode ? API.put : API.post;
      const response = await method(endpoint, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("responce for compney", response);

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.message || "Success");
        navigate(routes.Clients);
      } else {
        toast.error(response?.message || "Failed to save");
      }
    } catch (err) {
      toast.error(err.message || "Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <GenericForm
          title={isEditMode ? "Edit Company" : "Add Company"}
          fields={formFields}
          onSubmit={handleSubmit}
          buttonLabel={
            loading ? "Processing..." : isEditMode ? "Update" : "Save"
          }
          loading={loading}
          error={error}
          data={formData}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
