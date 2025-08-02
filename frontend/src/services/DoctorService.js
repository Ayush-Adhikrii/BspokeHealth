import API from "../utils/axios";


export const getAllDoctors = async (params = {}) => {
  try {
    const response = await API.get("/doctors", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch doctors" };
  }
};


export const getAllSpecialties = async () => {
  try {
    const response = await API.get("/doctors/specialities");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch specialties" };
  }
};


export const getDoctorById = async (doctorId) => {
  try {
    const response = await API.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch doctor details" };
  }
};