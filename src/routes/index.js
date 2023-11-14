import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from '../pages/home/Home';
import Layout from '../layouts/index';
import Datasets from '../pages/datasets/Datasets';
import DatasetLayout from '../pages/datasetDetail/datasetLayout/DatasetLayout';
import General from '../pages/datasetDetail/general/General';
import DataCard from '../pages/datasetDetail/dataCard/DataCard';
import AuthFrame from '../pages/auth/AuthFrame';
import RegisterForm from '../pages/auth/registerForm/RegisterForm';
import LoginForm from '../pages/auth/loginForm/LoginForm';
import Settings from '../pages/datasetDetail/settings/Settings';
import Surveys from '../pages/surveys/Surveys';
import EditSurvey from '../pages/editSurvey/EditSurvey';
import FormAnswer from '../pages/formAnswer/FormAnswer';
import auth from '../utils/auth';
import PrivateRoute from './privateRoute';
import Profile from '../pages/profile/Profile';
import Visualize from '../pages/datasetDetail/visualize/Visualize';
import NotFound from '../pages/notFound/notFound';

const Navigation = () => {
  const authenticated = !!auth.getAccessToken();

  return (
    <main>
      <Routes>
        <Route element={<PrivateRoute isAllowed={!authenticated} redirectPath="/" />}>
          <Route path="auth" element={<AuthFrame />}>
            <Route index element={<Navigate to="/" />} />
            <Route path="login" name="auth" element={<LoginForm />} />
            <Route path="register" name="auth" element={<RegisterForm />} />
          </Route>
        </Route>

        <Route element={<Layout />}>
          <Route path="/" name="home" element={<Home />} />
          <Route path=":slug" name="profile" element={<Profile />} />

          <Route path="datasets" name="datasets">
            <Route index element={<Datasets />} />
            <Route path=":slug" element={<DatasetLayout />}>
              <Route index element={<General />} />
              <Route path="data" element={<DataCard />} />
              <Route path="visualize" element={<Visualize />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="surveys" name="surveys">
            <Route index element={<Surveys />} />
            <Route path=":slug">
              <Route path="edit" name="edit" element={<EditSurvey />} />
            </Route>
          </Route>
          <Route path="404" name="notFound" element={<NotFound />} />
        </Route>
        <Route path="answer" name="answer">
          <Route path=":slug" element={<FormAnswer />} />
        </Route>
        <Route path="*" name="notFound" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default Navigation;
