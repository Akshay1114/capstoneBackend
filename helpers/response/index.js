export const responseMessages = {
  EN: {
    'SLEEPDATA_FETCHED': 'Your Latest Sleep Data',
    "SCHEDULE_ADDED": "Schedule added successfully",
    'ACCOUNT_DISABLED': 'Your account is disabled',
    'ANIMAL_NOTFOUND': 'Animal not found',
    'ALREADY_EXIST': 'Aleardy Exist Please Login',
    'ALREADY_REGISTER': 'Mobile number already registered',
    'ANIMAL_ADDED': 'Animal added successfully',
    'BAD_REQUEST': 'Bad request',
    'CREATE': 'Created successfully',
    'DELETE_ANIMAL': 'Animal deleted successfully',
    'DELETE_USER': 'User deleted successfully',
    'DELETE_NOTIFICATIONS': 'Notifications deleted successfully',
    'EMAIL_NOT_REGISTER': 'Email not registered',
    'ERROR': 'Something went wrong',
    'FETCH_ANIMAL': 'Fetch animal successfully',
    'FETCH_ANIMALS': 'Fetch animals successfully',
    'FETCH_QR_CODE': 'Fetch QRcode successfully',
    'FETCH_SETTING': 'Fetch setting successfully',
    'FETCH_USER': 'Fetch user successfully',
    'FETCH_USERS': 'Fetch users successfully',
    'FETCH_NOTIFICATIONS': 'Fetch notifications successfully',
    'FETCH_REFRESH_TOKEN': 'Fetch refresh token successfully',
    'FORBIDDEN': 'Forbidden',
    'INVALID': 'Invalid email or password',
    'INVALID_PASSWORD': 'Invalid old password',
    'LOGIN': 'Login successfully',
    'NOTIFICATION_SEND': 'Notification sent successfully',
    'OTP_FOR_PASSWORD': 'OTP For Password Reset Sent To Your Email',
    'OTP_MISMATCH': 'OTP mismatch',
    'OTP_SENT': 'OTP sent to your mobile number',
    'PASSWORD_CHANGED': 'Password Changed Successfully',
    'RESET_PASSWORD': 'Password Reset Successful',
    'REQUEST_FORBIDDEN': 'Request is forbidden',
    'SELECT_IMAGE': 'Please select an image to upload',
    'SESSION_EXPIRED': 'Session expired, please login again',
    'STATUS_UPDATE': 'Status updated successfully',
    'SUCCESS': 'Success',
    'SUFFICIENT_RIGHTS': 'You do not have sufficient rights',
    'UNAUTHORIZED': 'Unauthorized',
    'UPDATE_SETTING': 'Settings updated successfully',
    'UPDATE_STATUS': 'Status updated successfully',
    'UPDATE_USER': 'User updated successfully',
    'USER_ADDED': 'User added successfully',
    'USER_NOTFOUND': 'User not found',
    'VALID': 'Valid',
    'VERIFY_OTP': 'OTP Verified',
  },
  'FR': {

  }
}

export const notificationPayload = {
  'TITLE': 'Bovinae',
  'VACCINATION_TYPE': 'vaccination_due',
  'HEAT_DATE_TYPE': 'Deworming_coming_soon',
  'VACCINATION_DUE': 'Vaccination due',
  'HEAT_DATE': 'Deworming coming soon'
}

export const statusCodes = {
  'SUCCESS': 200,
  'RECORD_CREATED': 201,
  'BAD_REQUEST': 400,
  'AUTH_ERROR': 401,
  'FORBIDDEN': 403,
  'NOT_FOUND': 404,
  'INVALID_REQUEST': 405,
  'RECORD_ALREADY_EXISTS': 409,
  'SERVER_ERROR': 500
}

const makeResponse = async (res, statusCode, success, message, payload = null, meta = {}) =>
  new Promise(resolve => {
    res.status(statusCode)
      .send({
        success,
        code: statusCode,
        message,
        data: payload,
        meta
      });
    resolve(statusCode);
  });

export { makeResponse };
