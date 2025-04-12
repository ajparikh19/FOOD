import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import routes from "../../constants/routesConstants";
import { useDocumentTitle } from "@uidotdev/usehooks";
import useAuth from "../../context/authContext";
import API from "../../http/api";
import { useUserRole } from '../../context/userRoleContext';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    .email("Email is invalid.")
    .max(42),
  password: yup.string().required("Password is required.").max(42),
});

export default function Forgot() {
  useDocumentTitle(`Login`);
  // const { hasPermission, updateUserRole } = useUserRole();

  const { state } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || routes.Dashboard);
    }
  }, [state, navigate, isLoggedIn]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      isAcceptConditions: false,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await API.get(`login?email=${data.email}&password=${data.password}&fcm_token=x`);
      setLoading(false);
      if (response?.status === '200') {
        login(response?.data);
        const userRole = response?.data?.role;
        // updateUserRole(userRole); // Update user role using context
        console.log(userRole);
        navigate(routes.Dashboard);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
      toast.error("Apologies, unable to fulfill your request now. Please try again later.");
    }
  };

  return (
    <>
      <div className="row authentication mx-0">
        <div className="col-xxl-7 col-xl-7 col-lg-12">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xxl-6 col-xl-7 col-lg-7 col-md-7 col-sm-8 col-12">
              <div className="p-5">
                <div className="text-center mb-5">
                  <img src="/assets/images/1658930039795.webp" alt="logo" className="authentication-brand desktop-logo mx-auto mb-2 w-50 h-50" />
                  <h5 className="fw-semibold mb-2">Sign In</h5>
                  <p className="mb-3 text-muted op-7">One step away from your work. Let's Start!</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row gy-3">
                    {/* email */}
                    <div className="col-xl-12 mt-0">
                      <label htmlFor="email" className="form-label text-default">Email</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="email"
                        placeholder="Email"
                        {...register("email")}
                        maxLength={42}
                      />
                      {errors.email?.message != undefined && (
                        <span className="error mt-2 text-danger d-block">{errors.email?.message}</span>
                      )}
                    </div>

                    {/* password */}
                    <div className="col-xl-12 mb-3">
                      <label htmlFor="password" className="form-label text-default d-block">Password</label>
                      <div className="input-group">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className="form-control form-control-lg"
                          id="password"
                          placeholder="Password"
                          {...register("password")}
                          maxLength={42}
                        />
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={togglePasswordVisibility}
                          id="button-addon2"
                        >
                          <i className={passwordVisible ? "ri-eye-line align-middle" : "ri-eye-off-line align-middle"} />
                        </button>
                      </div>
                      {errors.password?.message != undefined && (
                        <span className="error mt-2 text-danger d-block">{errors.password?.message}</span>
                      )}

                      {/* remember password */}
                      <div className="mt-2">
                        <div className="form-check">
                      
                          <label className="form-check-label text-muted fw-normal" onClick={() => { navigate(routes.ForgotPassword); }}>Back To Login</label>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12 d-grid mt-2">
                      <button type="submit" className="btn btn-primary mx-auto" disabled={loading}>
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>


        <div className=" col-xxl-5 col-xl-5 col-lg-12 ">
          <div className="row justify-content-center align-items-center h-100">

            <img src="https://stavyaspine.com/wp-content/uploads/2020/03/WhatsApp-Image-2020-03-31-at-12.18.00-PM.jpeg" alt="logo" className="w-75" />
          </div>
        </div>
      </div>
    </>
  );
}
