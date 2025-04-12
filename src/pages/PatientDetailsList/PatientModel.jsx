// models/appointmentTypeModel.js
export const patientColumns = [
    { Header: "Seq ID", accessor: "seq_id" }, // Sequential ID
    { Header: "Patient ID", accessor: "patient_id" }, 
      { accessor: 'first_name', Header: 'Name' },
      { accessor: 'dob', Header: 'DOB' },
      { accessor: 'gender', Header: 'Gender' },
      { accessor: 'phone_number', Header: 'Phone' },
      { accessor: 'status', Header: 'Status' },
    ];
    
    