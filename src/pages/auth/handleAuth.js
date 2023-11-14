export const validateEmail = ({ value }) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!regex.test(value)) {
    return 'Email is invalid!';
  }
  return '';
};

export const validatePassword = ({ value }) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!regex.test(value)) {
    return 'Password ít nhất 8 ký tự gồm số và chữ cái!';
  }

  return '';
};
