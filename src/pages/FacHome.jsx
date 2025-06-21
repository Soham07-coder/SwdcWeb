import React from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import FacSidebar from "../components/FacSideBar";
import FacNavbar from "../components/FacNavbar";

const forms = [
  {
    id: "UG Form 1",
    path: "fac-ug1",
    category: "UG1 In-House Student project (FY to LY Students) Within Department",
  },
  {
    id: "UG Form 2",
    path: "fac-ug2",
    category: "UG2 In-House (FY to LY Students) Interdisciplinary projects",
  },
  {
    id: "UG Form 3A",
    path: "fac-ug3a",
    category: "UG3 Participation in Project Competition",
  },
  {
    id: "UG Form 3B",
    path: "fac-ug3b",
    category: "UG3 Participation in Reputed Conference",
  },
  {
    id: "PG Form 1",
    path: "fac-pg1",
    category: "PG1 Professional Development Through Workshops / STTPs",
  },
  {
    id: "PG Form 2A",
    path: "fac-pg2a",
    category: "PG2 Participation in Project Competition",
  },
  {
    id: "PG Form 2B",
    path: "fac-pg2b",
    category: "PG2 Participation in Reputed Conference",
  },
  {
    id: "Research Form 1",
    path: "fac-r1",
    category: "Publication in Reputed Journals/Conferences/STTPs/Workshops",
  },
];


const FacHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <FacNavbar />
      <div className="home-container">
        <div className="container">
          <FacSidebar />
          <main className="content">
            <div className="application-forms">
              <h1>Application Forms</h1>
              <div className="form-grid">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="form-card"
                    onClick={() => navigate(`/home/${form.path}`)}
                  >
                    <h3>{form.id}</h3>
                    <p>Category: {form.category}</p>
                    <button className="fill-form-btn">View Applications</button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default FacHome;
