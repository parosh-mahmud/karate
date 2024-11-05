// pages/main.js

import { useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Component from "../../components/admissions/admissions";
import AdmissionForm from "../../components/admissions/admissionForm";
export default function MainComponent() {
  const [currentPage, setCurrentPage] = useState("home");

  const goToHome = () => setCurrentPage("home");
  const goToAdmissions = () => setCurrentPage("admissions");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto py-4">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            color="inherit"
            href="#"
            onClick={goToHome}
            underline="hover"
            style={{ cursor: "pointer" }}
          >
            Home
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={goToAdmissions}
            underline="hover"
            style={{ cursor: "pointer" }}
          >
            Admissions
          </Link>
          {currentPage === "admissions" && (
            <Typography color="textPrimary">Admission Form</Typography>
          )}
        </Breadcrumbs>
      </div>

      {/* Conditionally render Component or AdmissionForm */}
      <div className="container mx-auto">
        {currentPage === "home" ? (
          <Component onEnrollClick={goToAdmissions} />
        ) : (
          <AdmissionForm />
        )}
      </div>
    </div>
  );
}
