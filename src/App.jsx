import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import FacHome from "./pages/FacHome";

import PendingApplications from "./pages/PendingApplications";
import AcceptedApplications from "./pages/AcceptedApplications";
import RejectedApplications from "./pages/RejectedApplications";
import ApplicationDetails from "./pages/ApplicationDetails";
import FacPendingApplications from "./pages/FacPendingApplications";
import FacAcceptedApplications from "./pages/FacAcceptedApplications"; // ✅ NEW IMPORT
import FacDashboard from "./pages/FacDashboard";

// Forms
import UG_1 from "./components/FormComponent/UG_1";
import UG_2 from "./components/FormComponent/UG_2";
import UG_3_A from "./components/FormComponent/UG_3_A";
import UG_3_B from "./components/FormComponent/UG_3_B";
import PG_1 from "./components/FormComponent/PG_1";
import PG_2_A from "./components/FormComponent/PG_2_A";
import PG_2_B from "./components/FormComponent/PG_2_B";
import R1 from "./components/FormComponent/R1";
import FacUGForm1 from "./components/FormComponent/FacUG1";
import FacUGForm2 from "./components/FormComponent/FacUG2";
import FacUGForm3A from "./components/FormComponent/FacUG3a";
import FacUGForm3B from "./components/FormComponent/FacUG3b";
import FacPGForm1 from "./components/FormComponent/FacPG1";
import FacPG2aForm from "./components/FormComponent/FacPG2a";
import FacPG2bForm from "./components/FormComponent/FacPG2b";
import FacR1Form from "./components/FormComponent/FacR1";
import FacultyFormViewer from "./components/FormComponent/FacultyFormViewer";

// General Info Pages
import Policy from "./pages/Policy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";

import "./style.css";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Student Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/home/ug1" element={<UG_1 />} />
        <Route path="/home/ug2" element={<UG_2 />} />
        <Route path="/home/ug3a" element={<UG_3_A />} />
        <Route path="/home/ug3b" element={<UG_3_B />} />
        <Route path="/home/pg1" element={<PG_1 />} />
        <Route path="/home/pg2a" element={<PG_2_A />} />
        <Route path="/home/pg2b" element={<PG_2_B />} />
        <Route path="/home/r1" element={<R1 />} />

        {/* Info Pages */}
        <Route path="/policy" element={<Policy />} />
        <Route path="/faqs" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        {/* Application Status Pages for Students */}
        <Route path="/application/pending" element={<PendingApplications />} />
        <Route path="/application/accepted" element={<AcceptedApplications />} />
        <Route path="/application/rejected" element={<RejectedApplications />} />
        <Route path="/application/:id" element={<ApplicationDetails />} />

        {/* Validator (Faculty) Routes */}
        <Route path="/fac/home" element={<FacHome />} />
        <Route path="/fac/pending" element={<FacPendingApplications />} />
        <Route path="/fac/approved" element={<FacAcceptedApplications />} /> {/* ✅ UPDATED */}
        <Route path="/fac/rejected" element={<RejectedApplications />} />
        <Route path="/fac/application/:id" element={<ApplicationDetails />} />
        <Route path="/fac/dashboard" element={<FacDashboard />} />
        <Route path="/fac/applications" element={<FacPendingApplications />} />
        <Route path="/home/fac-ug1" element={<FacUGForm1 />} />
        <Route path="/home/fac-ug2" element={<FacUGForm2/>} />
        <Route path="/home/fac-ug3a" element={<FacUGForm3A/>} />
        <Route path="/home/fac-ug3b" element={<FacUGForm3B/>} />
        <Route path="/home/fac-pg1" element={<FacPGForm1/>} />
        <Route path="/home/fac-pg2a" element={<FacPG2aForm/>} />
        <Route path="/home/fac-pg2b" element={<FacPG2bForm/>} />
        <Route path="/home/fac-r1" element={<FacR1Form/>} />
        <Route path="/fac/view/:formType/:formId" element={<FacultyFormViewer />} />
      </Routes>
    </Router>
  );
};

export default App;
