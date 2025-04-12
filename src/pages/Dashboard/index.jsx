import { useDocumentTitle } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";

import API from "../../http/api";


export default function Dashboard() {
    const [doctors,setDoctors] = useState([]);
    const [dashboardData,setDashboardData] = useState([]);
    const [dates, setDates] = useState({
      date_type:"day",
      date: new Date().toISOString().split("T")[0], // Default to today's date
      start: new Date().toISOString().split("T")[0], // Default to today's date
      end: new Date().toISOString().split("T")[0] // Default to today's date
    });

    

    const fetchDoctors = async () => {
      try {
        const response = await API.post("active-employee-detail", {
          is_today:1
        });
  
        // Handle the response from the API
        if (response.status === 200) {
          setDoctors(response?.data);
  
          // toast.success(response?.message);
        } else {
          console.error("Failed to create appointment:", response);
          toast.error(response?.message);
          toast.error(
            "There was an issue creating your appointment. Please try again."
          );
        }
      } catch (error) {
        console.error("Error during API request:", error);
        toast.error("Error during appointment creation. Please try again.");
      }
    };
    const fetchDashbord = async (dates) => {
      if (!dates) return;
    
      const params = {
        date_type: dates.date_type,
        ...(dates.date_type === "custom"
          ? { start_date: dates.start, end_date: dates.end }
          : { date: dates.date }),
      };
    
      try {
        const queryString = new URLSearchParams(params).toString();
        const response = await API.get(`dashboard?${queryString}`);
    
        if (response.status === 200) {
          setDashboardData(response?.data);
        } else {
          console.error("Failed to fetch dashboard data:", response);
          toast.error(response?.message || "Failed to fetch dashboard data.");
        }
      } catch (error) {
        console.error("Error during API request:", error);
        toast.error("Error fetching dashboard data. Please try again.");
      }
    };
    

    useEffect(()=>{
      fetchDoctors();
      fetchDashbord(dates);
    },[dates])
   
   

  useDocumentTitle(`Dashboard`);
  return (
    <>
      <div className="main-content app-content">
        <div className="container-fluid">
          <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
            <h1 className="page-title fw-semibold fs-18 mb-0">Dashboard</h1>
            <div className="ms-md-1 ms-0">
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="javascript:void(0);">Pages</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
         
          <div className="row">
            <div className="col-xxl-12 col-xl-12">
              <div className="row">
             
                <div className="col-lg-3 col-sm-6 col-md-3 col-xl-3">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon secondary  px-0">
                          <span className="rounded p-3 bg-secondary-transparent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="svg-white secondary"
                              enableBackground="new 0 0 24 24"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0,0h24v24H0V0z" fill="none" />
                              <g>
                                <path d="M22,3H2C0.9,3,0,3.9,0,5v14c0,1.1,0.9,2,2,2h20c1.1,0,1.99-0.9,1.99-2L24,5C24,3.9,23.1,3,22,3z M4.54,19 c1.1-1.22,2.69-2,4.46-2s3.36,0.78,4.46,2H4.54z M22,19h-6.08c-1.38-2.39-3.96-4-6.92-4s-5.54,1.61-6.92,4H2V5h20V19z" />
                                <rect height={2} width={6} x={9} y={7} />
                                <rect height={2} width={2} x={16} y={7} />
                                <rect height={2} width={6} x={9} y={10} />
                                <rect height={2} width={2} x={16} y={10} />
                              </g>
                            </svg>
                          </span>
                        </div>
                        <div className="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                          <div className="mb-2">Telephonic Appointments</div>
                          <div className="text-muted mb-1 fs-12">
                            <span className="text-dark fw-semibold fs-20 lh-1 vertical-bottom">
                              {dashboardData?.telephonic_appointment}
                            </span>
                          </div>
                          <div>
                            <span className="fs-12 mb-0">
                              Increase by{" "}
                              <span className="badge bg-success-transparent text-success mx-1">
                                +12.0%
                              </span>{" "}
                              this month
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-md-3 col-xl-3">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon px-0">
                          <span className="rounded p-3 bg-primary-transparent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="svg-white primary"
                              enableBackground="new 0 0 24 24"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <g>
                                <rect fill="none" height={24} width={24} />
                                <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
                              </g>
                            </svg>
                          </span>
                        </div>
                        <div className="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                          <div className="mb-2">Website Appointments</div>
                          <div className="text-muted mb-1 fs-12">
                            <span className="text-dark fw-semibold fs-20 lh-1 vertical-bottom">
                            {dashboardData?.website_appointment}
                            </span>
                          </div>
                          <div>
                            <span className="fs-12 mb-0">
                              Increase by{" "}
                              <span className="badge bg-success-transparent text-success mx-1">
                                +4.2%
                              </span>{" "}
                              this month
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-md-3 col-xl-3">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon secondary  px-0">
                          <span className="rounded p-3 bg-secondary-transparent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="svg-white secondary"
                              enableBackground="new 0 0 24 24"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0,0h24v24H0V0z" fill="none" />
                              <g>
                                <path d="M22,3H2C0.9,3,0,3.9,0,5v14c0,1.1,0.9,2,2,2h20c1.1,0,1.99-0.9,1.99-2L24,5C24,3.9,23.1,3,22,3z M4.54,19 c1.1-1.22,2.69-2,4.46-2s3.36,0.78,4.46,2H4.54z M22,19h-6.08c-1.38-2.39-3.96-4-6.92-4s-5.54,1.61-6.92,4H2V5h20V19z" />
                                <rect height={2} width={6} x={9} y={7} />
                                <rect height={2} width={2} x={16} y={7} />
                                <rect height={2} width={6} x={9} y={10} />
                                <rect height={2} width={2} x={16} y={10} />
                              </g>
                            </svg>
                          </span>
                        </div>
                        <div className="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                          <div className="mb-2">App Appointments</div>
                          <div className="text-muted mb-1 fs-12">
                            <span className="text-dark fw-semibold fs-20 lh-1 vertical-bottom">
                            {dashboardData?.app_appointment}
                            </span>
                          </div>
                          <div>
                            <span className="fs-12 mb-0">
                              Increase by{" "}
                              <span className="badge bg-success-transparent text-success mx-1">
                                +12.0%
                              </span>{" "}
                              this month
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-md-3 col-xl-3">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon px-0">
                          <span className="rounded p-3 bg-primary-transparent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="svg-white primary"
                              enableBackground="new 0 0 24 24"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <g>
                                <rect fill="none" height={24} width={24} />
                                <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
                              </g>
                            </svg>
                          </span>
                        </div>
                        <div className="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                          <div className="mb-2">Walking Appointments</div>
                          <div className="text-muted mb-1 fs-12">
                            <span className="text-dark fw-semibold fs-20 lh-1 vertical-bottom">
                            {dashboardData?.walking_appointment}
                            </span>
                          </div>
                          <div>
                            <span className="fs-12 mb-0">
                              Increase by{" "}
                              <span className="badge bg-success-transparent text-success mx-1">
                                +4.2%
                              </span>{" "}
                              this month
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
       

        </div>
      </div>
    </>
  );
}