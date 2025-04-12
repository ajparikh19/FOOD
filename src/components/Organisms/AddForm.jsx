import React, { useEffect, useState } from "react";
import FormGroup from "../molecules/FormGroup/FormGroup";
import CheckboxField from "../atoms/CheckBox/CheckboxField";
import Button from "../atoms/Button/Button";
import Loader from "../atoms/loader/Loader";


const GenericForm = ({
  fields,
  onSubmit,
  buttonLabel,
  title,
  loading = false,
  error = null,
  success = null,
  data = {},
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] =
        data[field.name] || field.defaultValue || (field.type === "checkbox" ? false : "");
      return acc;
    }, {})
  );

  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  useEffect(() => {
    if (data?.image) {
      setImagePreview(data.image);
    }
  }, [data]);

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return isNaN(age) || age < 0 ? "" : age; // Return empty string if invalid date
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === "checkbox" ? checked : type === "file" ? files[0] : value;

    console.log("newValue:" , newValue);

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    }

    if (type === "select") {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        
      }));
    }

    // Age Calculation
    if (type === "date" && name === "dob") {
      const age = calculateAge(newValue);
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        age, // Update the calculated age
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    // userName 
    if (type === "number" && name === "phoneNumber") {
      const username = newValue
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        username, // Update the calculated age
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    const error = validateField(name, newValue);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateField = (name, value) => {
    const field = fields.find((f) => f.name === name);
    if (field?.required && !value) {
      return `${field.label} is required.`;
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate fields
    const errors = fields.reduce((acc, field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) acc[field.name] = error;
      return acc;
    }, {});
    
    setFormErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      // Ensure null values are converted to empty strings before submission
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value ?? ""])
      );
  
      onSubmit(cleanedData); // Submit cleaned data
    }
  };
  

  return (
    <div className=" app-content main-content">
      <div className="container-fluid">
        <div className="mt-3 card custom-card">
          <div className="card-header">
            <div className="card-title">{title}</div>
          </div>
          <div className="card-body">
            {loading && <Loader />}
            <form onSubmit={handleSubmit} noValidate>
              <div className="row align-items-center">
                {fields.map((field, index) => (
                  <div key={index} className="col-md-4 my-2">
                    {field.type === "checkbox" ? (
                      <CheckboxField
                      label={field.required ? `${field.label} *` : field.label}
                        name={field.name}
                        checked={formData[field.name]}
                        onChange={handleChange}
                      />
                    ) : field.type === "radio" ? (
                      <div className="col-md-12">
                        <label className="form-label">{field.label}</label>
                        <div className="d-flex justify-content-start flex-wrap">
                          {field.options?.map((option, idx) => (
                            <div key={idx} className="me-3 mb-2">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={option}
                                  checked={formData[field.name] === option}
                                  onChange={handleChange}
                                  className="form-check-input"
                                />
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                        {formErrors[field.name] && (
                          <p className="text-danger" style={{ fontSize: "11px", marginBottom: "0px" }}>
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    )  : field.type === "select" && field.component ? (
                      <div className="col-md-12">
                        <label className="form-label">{field.label}</label>
                        {field.component}
                        {formErrors[field.name] && (
                          <p
                            className="text-danger"
                            style={{
                              fontSize: "11px",
                              marginBottom: "0px",
                            }}
                          >
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ) : field.type === "date" && field?.label === "Birth Date" ? (
                      <div className="col-md-12">
                        <label className="form-label">{field.label}</label>
                        <input
                          type="date"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="form-control"
                          max={field.label === "Birth Date" ? new Date().toISOString().split("T")[0] : undefined}
                        />
                        {formErrors[field.name] && (
                          <p className="text-danger" style={{ fontSize: "11px", marginBottom: "0px" }}>
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ): field.type === "date" && field?.label === "Anniversary Date" ? (
                      <div className="col-md-12">
                        <label className="form-label">{field.label}</label>
                        <input
                          type="date"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="form-control"
                          max={
                            formData?.birthDate
                              ? new Date(formData.birthDate).toISOString().split("T")[0]
                              : new Date().toISOString().split("T")[0]
                          }
                        />
                        {formErrors[field.name] && (
                          <p className="text-danger" style={{ fontSize: "11px", marginBottom: "0px" }}>
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ): field.type === "file" ? (
                      <div className="col-md-12">
                        <FormGroup
                        label={field.required ? `${field.label} *` : field.label}
                          type={field.type}
                          name={field.name}
                          onChange={handleChange}
                          required={field.required}
                        />
                        {formErrors[field.name] && (
                          <p className="text-danger" style={{ fontSize: "11px", marginBottom: "0px" }}>
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ) 
                    : (
                      <FormGroup
                      label={field.required ? `${field.label} *` : field.label}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        options={field.options || []}
                      />
                    )}
                    {formErrors[field.name] && (
                      <p className="text-danger" style={{ fontSize: "11px", marginBottom: "0px" }}>
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="w-25">
                {imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid mt-2" />}
              </div>

              {success && <p className="text-success">{success}</p>}
              {error && <p className="text-danger">{error}</p>}

              <div className="text-end">
                <Button
                  label={loading ? "Submitting..." : buttonLabel}
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading || Object.values(formErrors).some((e) => e)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericForm;
