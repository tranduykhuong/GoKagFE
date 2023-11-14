/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Link } from 'react-router-dom';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import classes from './CardDatasets.module.scss';
import Author from '../author/Author';

const CardDatasets = ({ item, type }) =>
  type === 1 ? (
    <div className={classes.cardDatasets}>
      <Link to={`/datasets/${item.slug}`}>
        <div className={classes.cardDatasets__img}>
          <img src={item.thumb} alt="" />
        </div>
        <div className={classes.cardDatasets__content}>
          <h4>{item.title}</h4>
          <p>{`Updated at ${moment(item.create_at).format('YYYY-MM-DD HH:mm:ss')}`}</p>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ fontWeight: 500 }}>Total</strong>
            {` ${item.questions.length} questions`}
          </p>
          <span
            style={{
              fontSize: '1.3rem',
              padding: '4px 10px',
              borderRadius: 10,
              backgroundColor: `${!item.is_public ? '#abffe3' : '#b0ffab'}`,
            }}
          >
            {item.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </Link>
      <div className={classes.cardDatasets__author}>
        <p>{`${item.author.last_name} ${item.author.first_name}`}</p>
        <Author size="24" rank={Math.floor(((Math.random() * 10) % 4) + 1)} img={item.author.avatar} />
      </div>
    </div>
  ) : (
    <div className={classes.cardSurveys}>
      <Link to={`/datasets/${item.slug}`} className={classes.cardSurveys__left}>
        <div className={classes['cardSurveys__left-img']}>
          <img src={item.thumb} alt="" />
        </div>
        <div className={classes['cardSurveys__left-content']}>
          <h3>{item.title}</h3>
          <p>
            <span style={{ backgroundColor: `${item.is_public ? '' : '#b0ffab'}` }}>
              {item.is_public ? 'Public' : 'Private'}
            </span>
            <span>{`Updated at ${moment(item.create_at).format('YYYY-MM-DD HH:mm:ss')}`}</span>
          </p>
          <p>{`Total ${item.questions.length} questions`}</p>
        </div>
      </Link>
      <div className={classes.cardSurveys__right}>
        <div
          className={classes['cardSurveys__right-status']}
          style={{ backgroundColor: `${item.is_collecting ? '' : '#d78b00'}` }}
        >
          {item.is_collecting ? 'Survey' : 'Unsurvey'}
        </div>
        <div className={classes['cardSurveys__right-author']}>
          <Author size="24" rank={Math.floor(((Math.random() * 10) % 4) + 1)} img={item.author.avatar} />

          <div className={classes['cardSurveys__right-author--share']}>
            <FontAwesomeIcon icon={faLink} />
          </div>
        </div>
      </div>
    </div>
  );

export default React.memo(CardDatasets);
