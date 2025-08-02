import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

const PaymentCallbackPage = () => {
  const navigate = useNavigate();
  const [status] = useState("success");
  const [appointmentDetails] = useState({
    id: "TEMP1234",
    date: "2025-08-01",
    time: "10:30 AM"
  });

  const handleViewAppointments = () => {
    navigate("/dashboard/appointments");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-10">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 text-center py-8">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your appointment has been confirmed.
              </p>

              <div className="mb-6 bg-gray-50 p-4 rounded-md text-left">
                <p className="text-sm text-gray-500 mb-1">Appointment ID</p>
                <p className="font-medium mb-2">{appointmentDetails.id}</p>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="font-medium">
                  {appointmentDetails.date} at {appointmentDetails.time}
                </p>
              </div>

              <button
                onClick={handleViewAppointments}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentCallbackPage;
