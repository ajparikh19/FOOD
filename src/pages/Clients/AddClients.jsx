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

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Initial form state


  const [formData, setFormData] = useState({
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
  });

  // Fetch client details for editing
  useEffect(() => {
    if (clientId) {
      const fetchDetails = async () => {
        setFormSubmitting(true);
        try {
          const { data, error } = await fetchEntityDetails("client", clientId);

          if (error) {
            setError(error);
          } else if (data) {
            setFormData((prev) => ({
              ...prev,
              ...data,
              birthDate: data.birthDate?.split("T")[0] || "",
              anniversaryDate: data.anniversaryDate?.split("T")[0] || "",
              state: data.state || "",
              city: data.city || "",
              photo: null,
              gender: data.gender || "Male",
              maritalStatus: data.maritalStatus || "Single",
            }));

            if (data.photoUrl) setPhotoPreview(data.photoUrl);
          }
        } catch (error) {
          toast.error("Failed to fetch client data");
        } finally {
          setFormSubmitting(false);
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
    const fetchCities = async () => {
      if (!formData?.state) {
        setCities([]);
        return;
      }

      setCitiesLoading(true);
      try {
        const res = await API.get(`locations/states/${formData.state}/cities`);

        const citiesData = res.data?.data || [];

        setCities(citiesData);
      } catch (error) {
        toast.error("Failed to load cities");
        setCities([]);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [formData?.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ,
      ...(name === "state" && { city: "" }),
    }));
  };
  // const handleChange2 = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, city: value }));
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, photo: file }));
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
      validation: (v) => (v ? validateEmail(v) : !isEditMode),
    },
    {
      label: "Phone Number",
      type: "tel",
      name: "phoneNumber",
      value: formData.phoneNumber,
      required: !isEditMode,
      validation: (v) => {
        if (!v && !isEditMode) return "Phone number is required";
        if (v) {
          if (!/^\d+$/.test(v)) return "Only numbers are allowed";
          if (v.length !== 10) return "Must be exactly 10 digits";
        }
        return null;
      },
      inputProps: {
        pattern: "[0-9]*",
        inputMode: "numeric"
      }
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
          cities={cities || []}
          value={formData.city}
          onChange={handleChange}
          disabled={!formData.state}
          loading={citiesLoading}
        />
      ),
    },
    {
      label: "Pincode",
      type: "text",
      name: "pincode",
      value: formData.pincode,
      required: !isEditMode,
      validation: (v) => {
        if (!v && !isEditMode) return "Pincode is required";
        if (v) {
          if (!/^\d+$/.test(v)) return "Only numbers are allowed";
          if (v.length !== 6) return "Must be 6 digits";
        }
        return null;
      },
      inputProps: {
        pattern: "[0-9]*",
        inputMode: "numeric",
        maxLength: 6
      }
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
    setFormSubmitting(true);
    setError(null);
    setSuccess(null);
    

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("fullName", data.fullName || "");
      formDataToSend.append("pincode", data.pincode || "");
      formDataToSend.append("email", data.email || "");
      formDataToSend.append("phoneNumber", data.phoneNumber || "");
      formDataToSend.append("address", data.address || "");
      formDataToSend.append("gender", data.gender || "Male");
      formDataToSend.append(
        "maritalStatus",
        data.maritalStatus || "Single"
      );
      formDataToSend.append("birthDate", data.birthDate || "");
      formDataToSend.append("anniversaryDate", data.anniversaryDate || "");
      formDataToSend.append("state", formData?.state || "");
      formDataToSend.append("city", formData?.city || "");

      // const jsonData = {
      //   ...formData,
      //   photo: undefined, // Exclude photo from JSON data
      // }
      // formDataToSend.append("data", JSON.stringify(jsonData));

      if (data.photo instanceof File) {
        formDataToSend.append("photo", data.photo);
      }


      const endpoint = clientId ? `client/${clientId}` : "client";
      const method = clientId ? "put" : "post";

      const response = await API[method](endpoint, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      

      if (response.status === 200 || response.status === 201) {
        toast.success(response?.message || "Operation successful");
        setFormData({
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
        });
      
        setPhotoPreview(null);
        navigate(routes.Clients);
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
      setError(err.message || "An error occurred");
    } finally {
      setFormSubmitting(false);
    }
  };

  // const title = clientId ? "Edit Client" : "Add Client";
  // const buttonLabel = loading
  //   ? clientId
  //     ? "Updating..."
  //     : "Adding..."
  //   : clientId
  //   ? "Update"
  //   : "Save";

    return (
      <div>
        <ToastContainer />
        <GenericForm
          title={clientId ? "Edit Client" : "Add Client"}
          fields={formFields}
          onSubmit={handleSubmit}
          buttonLabel={formSubmitting ? (clientId ? "Updating..." : "Adding...") : (clientId ? "Update" : "Save")}
          data={formData}
          loading={formSubmitting}
          onChange={handleChange}
        />
      </div>
    );
}
