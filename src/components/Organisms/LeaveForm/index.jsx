import React, { useEffect, useState } from "react";
import Button from "../../atoms/Button/Button";
import FormGroup from "../../Molecules/FormGroup/FormGroup";
import SelectField from "../../atoms/SelectField/SelectField";
import CheckboxField from "../../atoms/CheckBox/CheckboxField";

const LeaveForm = ({ departments, persons, onSubmit  , data}) => {
  const [formData, setFormData] = useState({
    department_id: "",
    person_id: "",
    reason: "",
    available_start_time: "",
    available_end_time: "",
    leave_start_time: "",
    leave_end_time: "",
    is_available: 0,
    status: 1, // Default to active
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    if(data) {
      setFormData({
        department_id: data?.department_id,
        person_id: data?.person_id,
        reason: data?.reason,
        available_start_time: data?.available_start_time,
        available_end_time: data?.available_end_time,
        leave_start_time: data?.leave_start_time,
        leave_end_time: data?.leave_end_time,
        is_available: data?.is_available,
        status: 1, // Default to active
      });
    }
  },[data])

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
      <div className="my-3 d-flex align-items-center">
                        {/* Export Dropdown */}

                    </div>
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Leave Form</div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Department Dropdown */}
                  <div className="col-md-4 mt-2 mb-2">
                    <FormGroup
                      label="Department"
                      type="select"
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      options={departments}
                      required
                    />
                  </div>

                  {/* Person ID Dropdown */}
                  <div className="col-md-4 mt-2 mb-2">
                    <FormGroup
                      label="Person ID"
                      type="select"
                      name="person_id"
                      value={formData.person_id}
                      onChange={handleChange}
                      options={persons}
                      required
                    />
                  </div>

                  {/* Reason Field */}
                  <div className="col-md-4 mt-2 mb-2">
                    <FormGroup
                      label="Reason"
                      type="text"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Enter Reason for Leave"
                      required
                    />
                  </div>


                  {/* Leave Start Time */}
                  <div className="col-md-4 mt-2 mb-2">
                    <FormGroup
                      label="Leave Start Time"
                      type="time"
                      name="leave_start_time"
                      value={formData.leave_start_time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Leave End Time */}
                  <div className="col-md-4 mt-2 mb-2">
                    <FormGroup
                      label="Leave End Time"
                      type="time"
                      name="leave_end_time"
                      value={formData.leave_end_time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Conditionally Render Available Start and End Time Fields */}
                  {formData.is_available && (
                    <>
                      {/* Available Start Time */}
                      <div className="col-md-4 mt-2 mb-2">
                        <FormGroup
                          label="Available Start Time"
                          type="time"
                          name="available_start_time"
                          value={formData.available_start_time}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Available End Time */}
                      <div className="col-md-4 mt-2 mb-2">
                        <FormGroup
                          label="Available End Time"
                          type="time"
                          name="available_end_time"
                          value={formData.available_end_time}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}
                     {/* Is Available Checkbox */}
                    <CheckboxField
                      label="Is Available"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleChange}
                    />
                </div>
                <div className="text-end">
                  <Button label="Submit Leave Form" type="submit" variant="primary" size="md" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LeaveForm;
