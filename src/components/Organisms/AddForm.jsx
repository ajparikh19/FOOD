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
        data[field.name] ||
        field.defaultValue ||
        (field.type === "checkbox" ? false : "");
      return acc;
    }, {})
  );

  const [formErrors, setFormErrors] = useState({});
  const [previews, setPreviews] = useState({
    photo: null,
    documents: [],
  });

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return isNaN(age) || age < 0 ? "" : age; // Return empty string if invalid date
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;

    

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
      const username = newValue;
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

  const handleFileChange = (e) => {
    const { name, files, multiple } = e.target;

    if (multiple) {
      const fileArray = Array.from(files);

      setFormData((prev) => ({
        ...prev,
        [name]: fileArray,
      }));

      // Set preview only for image types
      const imagePreviews = fileArray.map((file) =>
        file.type.startsWith("image/") ? URL.createObjectURL(file) : null
      );

      setPreviews((prev) => ({
        ...prev,
        [name]: imagePreviews,
      }));
    } else {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setPreviews((prev) => ({
        ...prev,
        [name]: file?.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));
    }
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

  const FormGroup2 = ({
    label,
    type,
    name,
    onChange,
    required,
    accept,
    multiple,
  }) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        required={required}
        accept={accept}
        multiple={multiple}
        className="form-control"
      />
    </div>
  );

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
                        label={
                          field.required ? `${field.label} *` : field.label
                        }
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
                          <p
                            className="text-danger"
                            style={{ fontSize: "11px", marginBottom: "0px" }}
                          >
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ) : field.type === "select" && field.component ? (
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
                    ) : field.type === "date" &&
                      field?.label === "Birth Date" ? (
                      <div className="col-md-12">
                        <label className="form-label">{field.label}</label>
                        <input
                          type="date"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="form-control"
                          max={
                            field.label === "Birth Date"
                              ? new Date().toISOString().split("T")[0]
                              : undefined
                          }
                        />
                        {formErrors[field.name] && (
                          <p
                            className="text-danger"
                            style={{ fontSize: "11px", marginBottom: "0px" }}
                          >
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ) : field.type === "date" &&
                      field?.label === "Anniversary Date" ? (
                      <div className="col-md-12">
                        <label className="form-label">{field.label}</label>
                        <input
                          type="date"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="form-control"
                          min={
                            formData?.birthDate
                              ? new Date(formData.birthDate).toISOString().split("T")[0]
                              : undefined
                          }
                        />
                        {formErrors[field.name] && (
                          <p
                            className="text-danger"
                            style={{ fontSize: "11px", marginBottom: "0px" }}
                          >
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ) : field.type === "file" ? (
                      <div className="col-md-12">
                        <FormGroup2
                          label={
                            field.required ? `${field.label} *` : field.label
                          }
                          type={field.type}
                          name={field.name}
                          onChange={handleFileChange} // Fallback to general handleChange
                          required={field.required}
                          accept={field.accept}
                          multiple={field.multiple || false} // 👈 Add this line
                        />
                        {formErrors[field.name] && (
                          <p
                            className="text-danger"
                            style={{ fontSize: "11px", marginBottom: "0px" }}
                          >
                            {formErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ) : (
                      <FormGroup
                        label={
                          field.required ? `${field.label} *` : field.label
                        }
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
                      <p
                        className="text-danger"
                        style={{ fontSize: "11px", marginBottom: "0px" }}
                      >
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {/* <div className="w-25">
                {imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid mt-2" />}
              </div> */}

              {/* Single preview (e.g., for photo) */}
              {previews.photo && (
                <div className="lo">
                  <h6>logo </h6>
                  <img src={previews.photo} alt="Photo Preview" width="100" />
                </div>
              )}
              {previews.logo && (
                <div className="lo">
                  <h6>logo </h6>
                  <img src={previews.logo} alt="Photo Preview" width="100" />
                </div>
              )}

              <div className="multiple">
                {previews.documents && previews.documents.length > 0 && (
                  <h6>Documents</h6>
                )}

                {previews.documents &&
                  previews.documents.map((src, i) =>
                    src ? (
                      <img key={i} src={src} alt={`Doc ${i}`} width="100" />
                    ) : (
                      <p key={i}>PDF File</p>
                    )
                  )}
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
