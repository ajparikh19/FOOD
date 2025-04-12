import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id: companyId } = useParams(); // Get companyId from URL params
  const { clientId: clientId } = useParams(); // Get companyId from URL params
  const isEditMode = !!companyId;

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
    documents: "",
  });

  // Fetch imaplan details for editing
  useEffect(() => {
    if (companyId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          //  const { data, error } = await fetchEntityDetails("implants", { id: companyId });
          const { data, error } = await fetchEntityDetails("client", companyId);
          // const { data, error } = await API.get(`/client/${id}`);

          if (error) {
            setError(error);
          } else if (data) {
            setFormData((prevData) => ({
              ...prevData,
              fullName: data.fullName || "",
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              birthDate: data.birthDate?.split("T")[0] || "",
              anniversaryDate: data.anniversaryDate?.split("T")[0] || "",
              pincode: data.pincode || "",
              address: data.address || "",
              state: data.state || "",
              city: data.city || "",
              photo: null, // assuming no photo from data
              gender: data.gender || "Male",
              maritalStatus: data.maritalStatus || "Unmarried",
            }));

            if (data.photoUrl) setPhotoPreview(data.photoUrl);
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          photoUrl: reader.result,
          photo: file,
        }));
      };
      reader.readAsDataURL(file);
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
      name: "logoe",
      onChange: handleFileChange,
      accept: "image/*",
      preview: photoPreview,
    },
  ].filter(Boolean);

  // Handle form submission
  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log("data is:", data);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("ownerId", clientId);

      Object.keys(data).forEach((key) => {
        if (key === "photo" && data[key]) {
          formDataToSend.append("photo", data[key]);
        } else if (key === "photoUrl") {
          // Skip photoUrl as it's just for preview
          return;
        } else {
          formDataToSend.append(key, data[key]);
        }
      });

      const endpoint = companyId ? `companies/${companyId}` : `companies`;

      let response;

      if (companyId) {
        response = await API.put(endpoint, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.post(endpoint, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.message);
        navigate(routes?.Clients);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form");
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const title = companyId ? "Edit Company" : "Add Company";
  const buttonLabel = loading
    ? companyId
      ? "Updating..."
      : "Adding..."
    : companyId
    ? "Update"
    : "Save";

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <ToastContainer /> */}
          <GenericForm
            title={title}
            fields={formFields}
            onSubmit={handleSubmit}
            buttonLabel={buttonLabel}
            loading={loading}
            error={error}
            success={success}
            data={formData}
            onChange={handleChange}
          />
        </>
      )}
    </div>
  );
}
