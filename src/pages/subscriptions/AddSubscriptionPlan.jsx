import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import GenericForm from "../../components/Organisms/AddForm";
import API from "../../http/api";
import Loader from "../../components/atoms/loader/Loader";
import routes from "../../constants/routesConstants";

export default function SubscriptionCreate() {
  const navigate = useNavigate();
  const { id: planId } = useParams();
  const isEditMode = !!planId;

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    planType: "",
    name: "",
    description: "",
    price: "",
    durationDays: "",
    features: [],
    termsAndConditions: "",
    isActive: true,
    trialDays: 0,
    currency: "INR",
  });

  // Fetch plan details for editing
  useEffect(() => {
    if (planId) {
      const fetchDetails = async () => {
        setFormSubmitting(true);
        try {
          const response = await API.get(`subscription-plans/${planId}`);
          const data = response.data;

          if (data) {
            setFormData({
              ...data,
              planType: data.planType || "",
              durationDays: data.durationDays?.toString() || "",
              price: data.price?.toString() || "",
              trialDays: data.trialDays?.toString() || "0",
              features: Array.isArray(data.features) 
              ? data.features.join(', ') 
              : ''
            });
          }
        } catch (error) {
          toast.error("Failed to fetch plan data");
        } finally {
          setFormSubmitting(false);
        }
      };

      fetchDetails();
    }
  }, [planId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const formFields = [
    {
      label: "Plan Type",
      type: "text",
      name: "planType",
      value: formData.planType,
      required: true,
      validation: (v) => (v ? null : "Plan type is required"),
    },
    {
      label: "Plan Name",
      type: "text",
      name: "name",
      value: formData.name,
      required: true,
      validation: (v) => (v ? null : "Plan name is required"),
    },
    {
      label: "Description",
      type: "textarea",
      name: "description",
      value: formData.description,
      required: true,
    },
    {
      label: "Currency",
      type: "select",
      name: "currency",
      value: formData.currency,
      options: [
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
        { label: "GBP", value: "GBP" },
        { label: "INR", value: "INR" },
        { label: "AUD", value: "AUD" },
        { label: "CAD", value: "CAD" },
      ],
      required: true,
      validation: (v) => (v ? null : "Currency selection is required"),
    },
    {
      label: "Price",
      type: "number",
      name: "price",
      value: formData.price,
      required: true,
      validation: (v) => (v > 0 ? null : "Price must be greater than 0"),
    },
    {
      label: "Duration (days)",
      type: "number",
      name: "durationDays",
      value: formData.durationDays,
      required: true,
      validation: (v) => (v > 0 ? null : "Duration must be at least 1 day"),
    },
    {
      label: "Trial Days",
      type: "number",
      name: "trialDays",
      value: formData.trialDays,
      validation: (v) => (v >= 0 ? null : "Trial days can't be negative"),
    },
    {
      label: "Features",
      type: "dynamic",
      name: "features",
      values: formData.features,
      onAdd: addFeature,
      onChange: handleFeatureChange,
      onRemove: removeFeature, // This function is commented out above!
      validation: (values) =>
        Array.isArray(values) &&
        values.every((v) => typeof v === "string" && v.trim())
          ? null
          : "Features cannot be empty",
    },
    {
      label: "Terms & Conditions",
      type: "textarea",
      name: "termsAndConditions",
      value: formData.termsAndConditions,
      required: true,
    },
  ];

  const handleSubmit = async (data) => {
    setFormSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // const featuresArray = Array.isArray(data.features)
      //   ? data.features
      //   : [data.features].filter(Boolean);

      const payload = {
        ...data,
        price: parseFloat(data.price),
        durationDays: parseInt(data.durationDays),
        trialDays: parseInt(data.trialDays),
        features: data.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f)
    };


      const endpoint = planId
        ? `subscription-plans/${planId}`
        : "subscription-plans";
      const method = planId ? "put" : "post";

      const response = await API[method](endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || "Operation successful");
        navigate(routes.Subscriptions);
      } else {
        toast.error(response.data?.message || "Operation failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div>
      <GenericForm
        title={planId ? "Edit Subscription Plan" : "Create Subscription Plan"}
        fields={formFields}
        onSubmit={handleSubmit}
        buttonLabel={
          formSubmitting
            ? "Processing..."
            : planId
            ? "Update Plan"
            : "Create Plan"
        }
        data={formData}
        loading={formSubmitting}
        onChange={handleChange}
      />
    </div>
  );
}
