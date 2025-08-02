import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import DoctorDashboardService from "../../services/DoctorDashboardService";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generalStats, setGeneralStats] = useState(null);
  const [appointmentAnalytics, setAppointmentAnalytics] = useState(null);
  const [patientInsights, setPatientInsights] = useState(null);

  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        
        try {
          const stats = await DoctorDashboardService.getGeneralStats();
          console.log("General stats:", stats);
          setGeneralStats(stats);
        } catch (error) {
          console.error("Failed to fetch general stats:", error);
        }

        try {
          const appointments =
            await DoctorDashboardService.getAppointmentAnalytics();
          console.log("Appointment analytics:", appointments);
          setAppointmentAnalytics(appointments);
        } catch (error) {
          console.error("Failed to fetch appointment analytics:", error);
        }

        try {
          const patients = await DoctorDashboardService.getPatientInsights();
          console.log("Patient insights:", patients);
          setPatientInsights(patients);
        } catch (error) {
          console.error("Failed to fetch patient insights:", error);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  
  const getGrowthClass = (growth) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  
  const prepareGenderData = () => {
    if (!patientInsights?.demographics?.gender) return [];

    return Object.entries(patientInsights.demographics.gender).map(
      ([gender, count]) => ({
        name: gender,
        value: count,
      })
    );
  };

  const prepareAgeData = () => {
    if (
      !patientInsights?.demographics?.ageGroups ||
      typeof patientInsights.demographics.ageGroups === "string"
    ) {
      return [];
    }

    return Object.entries(patientInsights.demographics.ageGroups).map(
      ([ageGroup, count]) => ({
        name: ageGroup,
        value: count,
      })
    );
  };

  const prepareAppointmentStatusData = () => {
    if (!generalStats?.appointments) return [];

    return [
      { name: "Upcoming", value: generalStats.appointments.upcoming },
      { name: "Completed", value: generalStats.appointments.completed },
      { name: "Cancelled", value: generalStats.appointments.cancelled },
      { name: "Pending", value: generalStats.appointments.pending },
    ];
  };

  
  const GENDER_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
  const AGE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const APPOINTMENT_COLORS = {
    Upcoming: "#3b82f6",
    Completed: "#10b981",
    Cancelled: "#ef4444",
    Pending: "#f59e0b",
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Doctor Dashboard
          </h1>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
          <span className="text-sm text-gray-500">
            Last updated: {format(new Date(), "MMMM d, yyyy, h:mm a")}
          </span>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Total Patients
                </h2>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {generalStats?.patients?.total || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-md">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-xs font-medium">New This Month:</span>
                <span className="ml-2 text-sm font-semibold">
                  {generalStats?.patients?.newThisMonth || 0}
                </span>
                <span
                  className={`ml-2 text-xs ${getGrowthClass(
                    generalStats?.patients?.percentNewThisMonth
                  )}`}
                >
                  ({generalStats?.patients?.percentNewThisMonth || 0}%)
                </span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Total Appointments
                </h2>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {generalStats?.appointments?.total || 0}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-md">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-xs font-medium">Upcoming:</span>
                <span className="ml-2 text-sm font-semibold">
                  {generalStats?.appointments?.upcoming || 0}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium">Completed:</span>
                <span className="ml-2 text-sm font-semibold">
                  {generalStats?.appointments?.completed || 0}
                </span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Monthly Revenue
                </h2>
                <p className="text-3xl font-bold text-gray-800 mt-4">
                 Rs. {generalStats?.revenue?.currentMonth || 0}
                </p>
              </div>
             
            </div>
            <div className="mt-4">
             
            
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Appointment Status
              </h2>
            </div>
            <div className="p-6 h-72">
              {prepareAppointmentStatusData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareAppointmentStatusData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} appointments`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Appointments">
                      {prepareAppointmentStatusData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={APPOINTMENT_COLORS[entry.name]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No appointment data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Appointment Metrics
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Completion Rate
                </p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          appointmentAnalytics?.metrics?.completionRate || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {appointmentAnalytics?.metrics?.completionRate || 0}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Cancellation Rate
                </p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${
                          appointmentAnalytics?.metrics?.cancelRate || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {appointmentAnalytics?.metrics?.cancelRate || 0}%
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Busiest Days
                </h3>
                <div className="space-y-2">
                  {appointmentAnalytics?.busiest?.days?.map((day, index) => (
                    <div
                      key={day.day}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">{day.day}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {day.count} appts
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">No data available</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Today's Appointments
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {appointmentAnalytics?.today?.count || 0} appointments scheduled
              </p>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {appointmentAnalytics?.today?.appointments?.length > 0 ? (
                appointmentAnalytics.today.appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          {appointment.patient_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {`${appointment.start_time} - ${appointment.end_time}`}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    No appointments scheduled for today
                  </p>
                </div>
              )}
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Patient Gender Distribution
              </h2>
            </div>
            <div className="p-6 h-64">
              {prepareGenderData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareGenderData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareGenderData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} patients`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    Insufficient data for gender distribution
                  </p>
                </div>
              )}
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Patient Age Distribution
              </h2>
            </div>
            <div className="p-6 h-64">
              {prepareAgeData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareAgeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareAgeData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={AGE_COLORS[index % AGE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} patients`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    Insufficient data for age distribution
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Recent Appointments
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointmentAnalytics?.recent?.appointments?.length > 0 ? (
                    appointmentAnalytics.recent.appointments.map(
                      (appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patient_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {appointment.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {appointment.time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No recent appointments
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Top Patients
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Patients with most appointments
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Appointments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientInsights?.patientEngagement?.topPatients?.length >
                  0 ? (
                    patientInsights.patientEngagement.topPatients.map(
                      (patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {patient.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.appointmentCount}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No patient data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Patient Engagement
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    New vs. Returning Patients
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="font-medium text-blue-600">
                      {patientInsights?.patientEngagement?.newVsReturning
                        ?.new || 0}
                    </span>
                    <span className="text-gray-500 ml-1">new</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-green-600">
                      {patientInsights?.patientEngagement?.newVsReturning
                        ?.returning || 0}
                    </span>
                    <span className="text-gray-500 ml-1">returning</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Return Rate:{" "}
                    {patientInsights?.patientEngagement?.newVsReturning
                      ?.returnRate || 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
