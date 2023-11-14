import React from 'react';
import classes from './CardHome.module.scss';

const CardHome = ({ title, img, summary, description, path }) => (
  <a className={classes.cardHome} href={path} target={path.includes('answer') ? '_blank' : undefined} rel="noreferrer">
    <div className={classes.cardHome__heading}>
      <h3>{title}</h3>
      <div className={classes['cardHome__heading-img']}>
        <img src={img} alt="" />
      </div>
    </div>
    <p className={classes.cardHome__summary}>{summary}</p>
    <p className={classes.cardHome__description}>{description}</p>
  </a>
);

export default CardHome;
