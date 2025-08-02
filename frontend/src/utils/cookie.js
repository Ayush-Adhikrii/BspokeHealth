export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  console.log(`Cookie set: ${name} = ${value} (expires in ${days} days)`);
}

export function setSessionCookie(name, value) {
  document.cookie = name + '=' + encodeURIComponent(value) + '; path=/';
  console.log(`Session cookie set: ${name} = ${value}`);
}

export function getCookie(name) {
  const value = document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
  console.log(`Cookie retrieved: ${name} = ${value}`);
  return value;
}

export function removeCookie(name) {
  setCookie(name, '', -1);
  console.log(`Cookie removed: ${name}`);
}

export function setAppointmentData(doctorId, appointmentDate, timeSlotId) {
  setSessionCookie('bookAppointmentWith', doctorId);
  setSessionCookie('appointmentDate', appointmentDate);
  setSessionCookie('timeSlotId', timeSlotId);
  console.log('Appointment data saved to cookies:', { doctorId, appointmentDate, timeSlotId });
}

export function getAppointmentData() {
  const data = {
    doctorId: getCookie('bookAppointmentWith'),
    appointmentDate: getCookie('appointmentDate'),
    timeSlotId: getCookie('timeSlotId')
  };
  console.log('Appointment data retrieved from cookies:', data);
  return data;
}

export function clearAppointmentData() {
  removeCookie('bookAppointmentWith');
  removeCookie('appointmentDate');
  removeCookie('timeSlotId');
  console.log('Appointment data cleared from cookies');
}

export function clearAllLocalStorage() {
  try {
    localStorage.clear();
    console.log('All localStorage data cleared');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

export function clearAllSessionStorage() {
  try {
    sessionStorage.clear();
    console.log('All sessionStorage data cleared');
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
}