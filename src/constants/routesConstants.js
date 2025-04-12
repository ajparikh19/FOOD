const routes = {
  //======================== Login And Dashboard, Settings ========
  Login: "/",
  ForgotPassword: "/forgotPassword",
  Dashboard: "/dashboard",

  //============================Registration ==============================

  Registration: "/registration",
  AddRegistration: "/registration/add",
  EditRegistration: "/registration/edit/:id",
  EditPatient: "/editpatient/:id",

  //============================ Clients ==============================
  Clients: "/clients",
  AddClient: "/clients/add",
  EditClient: "/clients/edit/:id",
  ViewClient: "/clients/view/:id",
  


  //============================ Companies ==============================
  Companies: "/companies",
  AddCompany: "/companies/add/:clientId",
  EditCompany: "/companies/edit/:id",

  //============================ Subscription ==============================
  Subscriptions: "/subscriptions",
  AddSubscription: "/subscriptions/add",
  EditSubscription: "/subscriptions/edit/:id",
};
export default routes;
