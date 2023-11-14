import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTableList } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import moment from 'moment';
import classes from './CardList.module.scss';
import ButtonCT from '../../../../components/button/ButtonCT';
import CardHome from '../cardHome/CardHome';

const CardList = ({ title, description, path, data }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.cardList}>
      <div className={classes.cardList__heading}>
        <div className={classes['cardList__heading-title']}>
          <FontAwesomeIcon icon={faTableList} />
          <h2>{title}</h2>
        </div>
        <div>
          <ButtonCT onClick={() => navigate(path)} opacityBtn medium borderRadius iconLeft={faArrowRight}>
            View all
          </ButtonCT>
        </div>
      </div>
      <div className={classes.cardList__description}>{description}</div>
      <div className={classes.cardList__list}>
        {data &&
          data.map((item, idx) => (
            <div key={+idx}>
              <CardHome
                title={item.title}
                img={item.thumb}
                description={item.summary}
                summary={`${moment(item.create_at).format('YYYY-MM-DD HH:mm:ss')}`}
                path={path === '/datasets' ? `/datasets/${item.slug}` : `/answer/${item.slug}`}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CardList;
