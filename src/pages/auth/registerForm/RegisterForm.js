import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import classes from './RegisterForm.module.scss';
import InputCT from '../../../components/inputCT/InputCT';
import ButtonCT from '../../../components/button/ButtonCT';
import useMergeState from '../../../hook/useMergeState';
import { validateEmail } from '../handleAuth';
import auth from '../../../utils/auth';
import { axiosClient } from '../../../api/axios';

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useMergeState({
    isLoading: false,
    error: '',
    dataValid: false,
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (state.dataValid) {
      setState({
        isLoading: true,
        error: '',
      });
      const object = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        gender: 'male',
      };
      axiosClient
        .post('/auth/register/', object)
        .then((res) => {
          auth.login(res.data);
          setState({
            isLoading: false,
          });
          navigate('/auth/login', { state: location.state });
          toast.success('Register successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        })
        .catch((err) => {
          console.log(err);
          setState({
            isLoading: false,
            error: err.email ? err.email[0].message : 'Register account unsuccessfully!',
          });
          toast.error('Register failed! Please try again!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        });
    }
  };

  const checkConfirmPassword = () => {
    if (confirmPassword !== password) {
      setState({
        error: 'Confirm password is invalid!',
      });
    } else {
      setState({
        error: '',
      });
    }
  };

  useEffect(() => {
    if (email && firstName && lastName && password && password === confirmPassword) {
      setState({
        dataValid: true,
      });
    } else {
      setState({
        dataValid: false,
      });
    }
  }, [email, firstName, lastName, password, confirmPassword, state.error]);

  return (
    <form className={classes.registerForm} onSubmit={handleRegister}>
      <InputCT
        type="email"
        placeholder="Email"
        setValue={setEmail}
        defaultValue={email}
        required
        validation={validateEmail}
      />
      <InputCT type="text" placeholder="First name" required setValue={setFirstName} defaultValue={firstName} />
      <InputCT type="text" placeholder="Last name" required setValue={setLastName} defaultValue={lastName} />
      <InputCT type="password" placeholder="Password" required setValue={setPassword} defaultValue={password} />
      <InputCT
        type="password"
        placeholder="Confirm password"
        required
        defaultValue={confirmPassword}
        setValue={setConfirmPassword}
        onBlur={checkConfirmPassword}
        message={state.error}
      />
      <ButtonCT
        primary
        borderRadius
        medium
        block
        disabled={!state.dataValid}
        style={{ marginTop: '10px' }}
        onClick={handleRegister}
        loading={state.isLoading}
      >
        Sign Up
      </ButtonCT>
    </form>
  );
};

export default RegisterForm;
