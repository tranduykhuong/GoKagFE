/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-expressions */
import React from 'react';
import ContentLoader from 'react-content-loader';
import classes from './CardPlaceholder.module.scss';

const CardPlaceholder = ({ type }) =>
  type === 'DATASET' ? (
    <div className={classes.cardDatasets}>
      <ContentLoader height="100%" speed={1} foregroundColor="#ddd">
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="112" />
        <rect x="20" y="130" rx="5" ry="5" width="80%" height="18" />
        <rect x="20" y="154" rx="5" ry="5" width="60%" height="18" />
        <rect x="20" y="184" rx="2" ry="2" width="70%" height="14" />
        <rect x="20" y="206" rx="2" ry="2" width="50%" height="14" />

        <rect x="0" y="260" rx="2" ry="2" width="100%" height="1" />
        <rect x="20" y="280" rx="5" ry="5" width="50%" height="18" />
        <rect x="80%" y="276" rx="50%" ry="50%" width="24" height="24" />
      </ContentLoader>
    </div>
  ) : (
    <div className={classes.cardSurveys}>
      <ContentLoader height={70} speed={1} foregroundColor="#ddd" viewBox="0 0 380 70">
        <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
        <rect x="86" y="6" rx="5" ry="5" width="80%" height="15" />
        <rect x="86" y="30" rx="3" ry="3" width="70%" height="12" />
        <rect x="86" y="50" rx="3" ry="3" width="40%" height="12" />
      </ContentLoader>
    </div>
  );

export default CardPlaceholder;
