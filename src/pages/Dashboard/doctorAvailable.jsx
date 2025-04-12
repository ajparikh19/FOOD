import React, { useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";

import "./AvailableDoctors.css"; // Import a separate CSS file for custom styles
import { getSlotHour } from "../../components/utils/Helper";

export default function AvailableDoctors({ doctors = [] }) {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State to store selected doctor

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true); // Open the modal on click
  };

  const handleClose = () => {
    setShowModal(false); // Close the modal
    setSelectedDoctor(null);
  };

  return (
    <div className="main-content">
      {doctors &&
        doctors.length > 0 &&
        doctors?.filter((doctor) => doctor?.is_available_on_date === true)
          .length > 0 && (
          <>
            <div className="my-4 card custom-card ">
              <div className="card-header justify-content-between">
                <h5 className="card-title">Doctors Available</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {doctors
                    ?.filter((doctor) => doctor?.is_available_on_date === true)
                    ?.map((doctor, index) => (
                      <div
                        className="col-lg-3 col-sm-6 col-md-3 col-xl-3"
                        key={index}
                      >
                        <div
                          className="card doc-card"
                          role="button"
                          onClick={() => handleDoctorClick(doctor)}
                        >
                          <div className="card-body doc-card-body">
                            <div className="row">
                              <div className="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon secondary px-0">
                                <img
                                  src={
                                    doctor?.avatar || "/assets/doctoricon.png"
                                  } // Replace with your actual dummy image path
                                  alt={doctor?.first_name || "Doctor"}
                                  width={50}
                                  height={50}
                                  className="doctor-image"
                                />
                              </div>
                              <div className="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                                <div className="mb-1 fs-18">
                                  {" "}
                                  {doctor.prefix_name} {doctor.first_name} {doctor.last_name}
                                </div>
                                <div className="text-muted mb-1">
                                  <span className="text-dark fw-semibold fs-15 lh-1 vertical-bottom">
                                    Next Time Slote
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDoctor
              ? `${selectedDoctor.prefix_name || ""} ${selectedDoctor.first_name || ""}  ${selectedDoctor.last_name || ""}`
              : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Today Available Time Slots:</h5>
          <div>
            {selectedDoctor && selectedDoctor.available_slots ? (
              selectedDoctor.available_slots.slice(0, 5).map((slot, index) => (
                <Badge className="fs-6 m-1 p-2" key={index} bg="primary">
                    {getSlotHour(slot) || "-"}
                </Badge>
              ))
            ) : (
              <p>No slots available</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
