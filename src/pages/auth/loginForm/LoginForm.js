import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import OneSignal from 'react-onesignal';
import classes from './LoginForm.module.scss';
import InputCT from '../../../components/inputCT/InputCT';
import ButtonCT from '../../../components/button/ButtonCT';
import icGoogle from '../../../assets/imgs/icon_google.png';
import useMergeState from '../../../hook/useMergeState';
import auth from '../../../utils/auth';
import { axiosClient } from '../../../api/axios';
import { validateEmail } from '../handleAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useMergeState({
    error: '',
    isLoading: false,
  });

  const handleLogin = (event) => {
    event.preventDefault();
    if (email !== '' && password !== '') {
      setState({
        isLoading: true,
        error: '',
      });
      const object = {
        email,
        password,
      };
      axiosClient
        .post('/auth/login/', object)
        .then((res) => {
          auth.login(res.data);
          setState({
            isLoading: false,
          });

          console.log(res.data.user.id);

          OneSignal.init({ appId: '492ef2e8-e4d1-4b59-b809-2967552103cd', allowLocalhostAsSecureOrigin: true }).then(
            () => {
              OneSignal.Slidedown.promptPush();
              OneSignal.User.addAlias('external_id', res.data.user.id.toString());
            }
          );

          navigate(location.state !== null ? location.state : '/');
          toast.success('Login successfully!', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });

          // axiosPrivate
          //   .get(`/carts?idUser=${res.data.data.user._id}`)
          //   .then((res) => {
          //     // dispatch(init(res.data.data));
          //     if (auth.role() === 'user') {
          //     } else {
          //       // navigate('/dashboard');
          //       window.location.replace('http://localhost:3001/dashboard');
          //     }
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //     navigate('/');
          //   });
        })
        .catch((err) => {
          console.log(err);
          setState({
            isLoading: false,
            error: 'Email or password is invalid! Please try again!',
          });
          toast.error('Login failed! Please try again!', {
            position: 'top-right',
            autoClose: 4000,
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

  return (
    <form className={classes.loginForm} method="submit">
      <InputCT
        type="email"
        placeholder="Email"
        setValue={setEmail}
        required
        validation={validateEmail}
        defaultValue={email}
      />
      <InputCT
        type="password"
        placeholder="Password"
        setValue={setPassword}
        required
        message={state.error}
        defaultValue={password}
      />
      <ButtonCT
        primary
        borderRadius
        medium
        block
        loading={state.isLoading}
        onClick={handleLogin}
        style={{ marginTop: '10px' }}
        disabled={email === '' || password === ''}
      >
        Login
      </ButtonCT>
      <span className={classes.loginForm__line} />
      <ButtonCT borderRadius outlineBtn medium block imgLeft={icGoogle} style={{ marginBottom: '10px' }}>
        Login with Google
      </ButtonCT>
    </form>
  );
};

export default LoginForm;
