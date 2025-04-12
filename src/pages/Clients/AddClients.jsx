import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import SelectState from "../../components/atoms/SelectField/selectState";
import SelectCity from "../../components/atoms/SelectField/selectCity";
import routes from "../../constants/routesConstants";

export default function ClientCreate() {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const isEditMode = !!clientId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Initial form state
  const initialState = {
    fullName: "",
    pincode: "",
    email: "",
    phoneNumber: "",
    address: "",
    photo: null,
    gender: "Male",
    maritalStatus: "Single",
    birthDate: "",
    anniversaryDate: "",
    state: "",
    city: "",
  };

  const [formData, setFormData] = useState(initialState);

  // Fetch client details for editing
  useEffect(() => {
    if (clientId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const { data, error } = await fetchEntityDetails("client", clientId);

          if (error) {
            setError(error);
          } else if (data) {
            setFormData({
              ...initialState,
              ...data,
              birthDate: data.birthDate?.split("T")[0] || "",
              anniversaryDate: data.anniversaryDate?.split("T")[0] || "",
              state: data.state || "",
              city: data.city || "",
              photo: null,
              gender: data.gender || "Male",
              maritalStatus: data.maritalStatus || "Single",
            });

            if (data.photoUrl) setPhotoPreview(data.photoUrl);
          }
        } catch (error) {
          toast.error("Failed to fetch client data");
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [clientId]);

  useEffect(() => {
    API.get(`locations/states`)
      .then((res) => setStates(res.data || []))
      .catch(() => toast.error("Failed to load states"));
  }, []);

  useEffect(() => {
    if (formData?.state) {
      setLoading(true);
      API.get(`locations/states/${formData?.state}/cities`)
        .then((res) => {
          console.log("Cities API Response:", res.data);
          const citiesData = res.data?.data || res.data || [];
        
          const cityOptions = (res.data?.data || []).map(city => ({
            value: String(city?.cityId || ''),
            label: city?.name || 'Unknown City'
          }));
          setCities(cityOptions);
        })
        .catch(() => toast.error("Failed to load cities"))
        .finally(() => setLoading(false));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formFields = [
    {
      label: "Full Name",
      type: "text",
      name: "fullName",
      value: formData.fullName,
      required: !isEditMode,
      validation: (v) => validateRequired(v, "Full Name"),
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      value: formData.email,
      required: !isEditMode,
      validation: (v) => v ? validateEmail(v) : !isEditMode,
    },
    {
      label: "Phone Number",
      type: "tel",
      name: "phoneNumber",
      value: formData.phoneNumber,
      required: !isEditMode,
      validation: (v) => v ? validatePhone(v) : !isEditMode,
    },
    {
      label: "Gender",
      type: "select",
      name: "gender",
      options: ["Male", "Female", "Other"],
      value: formData.gender,
    },
    {
      label: "Birth Date",
      type: "date",
      name: "birthDate",
      value: formData.birthDate,
    },
    {
      label: "Marital Status",
      type: "select",
      name: "maritalStatus",
      options: ["Single", "Married", "Divorced", "Widowed"],
      value: formData.maritalStatus,
    },
    {
      label: "Anniversary Date",
      type: "date",
      name: "anniversaryDate",
      value: formData.anniversaryDate,
      required: formData.maritalStatus === "Married",
      validation: (v) => formData.maritalStatus === "Married" ? validateRequired(v, "Anniversary Date") : true,
    },
    {
      label: "Address",
      type: "textarea",
      name: "address",
      value: formData.address,
      required: !isEditMode,
    },
    {
      label: "State",
      type: "select",
      name: "state",
      value: formData.state,
      component: (
        <SelectState
          states={states}
          value={formData.state}
          onChange={handleChange}
        />
      ),
    },
    {
      label: "City",
      type: "select",
      name: "city",
      value: formData.city,
      component: (
        <SelectCity
          cities={cities}
          value={formData.city}
          onChange={handleChange}
          disabled={!formData.state}
        />
      ),
    },
    {
      label: "Pincode",
      type: "text",
      name: "pincode",
      value: formData.pincode,
      required: !isEditMode,
      validation: (v) => validateRequired(v, "Pincode") && /^\d{6}$/.test(v),
    },
    {
      label: "Profile Photo",
      type: "file",
      name: "photo",
      onChange: handleFileChange,
      accept: "image/*",
      preview: photoPreview,
    },
  ];

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Append the photo file separately
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const endpoint = clientId ? `client/${clientId}` : "client";
      const method = clientId ? "put" : "post";

      const response = await API[method](endpoint, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response?.message || "Operation successful");
        setFormData(initialState);
        setPhotoPreview(null);
        navigate(routes.Clients);
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const title = clientId ? "Edit Client" : "Add Client";
  const buttonLabel = loading 
    ? (clientId ? "Updating..." : "Adding...")
    : (clientId ? "Update" : "Save");

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <GenericForm
          title={title}
          fields={formFields}
          onSubmit={handleSubmit}
          buttonLabel={buttonLabel}
          data={formData}
          onChange={handleChange}
        />
      )}
    </div>
  );
}