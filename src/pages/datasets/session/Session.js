import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './Session.module.scss';
import ButtonCT from '../../../components/button/ButtonCT';
import useAxios from '../../../hook/useAxios';
import CardDatasets from '../../../components/cardDatasets/CardDatasets';
import CardPlaceholder from '../../../components/cardPlaceholder/CardPlaceholder';

const Session = ({ title, icon, url, onSeeAll }) => {
  const [response, e, isLoading] = useAxios('get', url, {}, {}, []);

  const handleClickSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
    }
  };

  return (
    <div className={classes.session}>
      <div className={classes.session__heading}>
        <div>
          <FontAwesomeIcon icon={icon} />
          <h3>{title}</h3>
        </div>
        <ButtonCT opacityBtn borderRadius medium onClick={handleClickSeeAll}>
          <strong>See All</strong>
        </ButtonCT>
      </div>
      <div className={classes.session__list}>
        {isLoading || !response
          ? [1, 2, 3, 4, 5, 6].map((item) => <CardPlaceholder type="DATASET" key={item} />)
          : response.results.map((item, idx) => <CardDatasets item={item} key={+idx} type={1} />)}
      </div>
      <p style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }} />
    </div>
  );
};

export default React.memo(Session);
