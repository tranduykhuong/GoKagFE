import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './SessionSurvey.module.scss';
import ButtonCT from '../../../components/button/ButtonCT';
import CardDatasets from '../../../components/cardDatasets/CardDatasets';

const SessionSurvey = ({ title, icon }) => (
  <div className={classes.sessionSurvey}>
    <div className={classes.sessionSurvey__heading}>
      <div>
        <FontAwesomeIcon icon={icon} />
        <h3>{title}</h3>
      </div>
      <ButtonCT opacityBtn borderRadius medium>
        <strong>See All</strong>
      </ButtonCT>
    </div>
    <div className={classes.sessionSurvey__list}>
      <CardDatasets />
      <CardDatasets />
      <CardDatasets />
      <CardDatasets />
      <CardDatasets />
      <CardDatasets />
    </div>
    <p style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }} />
  </div>
);

export default SessionSurvey;
