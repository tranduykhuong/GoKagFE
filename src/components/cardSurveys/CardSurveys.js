import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import classes from './CardSurveys.module.scss';
import Author from '../author/Author';

const CardSurveys = ({ item }) => {
  const location = useLocation();

  const handleShare = async () => {
    const textToCopy = `${process.env.REACT_APP_DOMAIN}/answer/${item.slug}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.info('Copy link successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (err) {
      console.error('Lỗi khi sao chép vào clipboard: ', err);
    }
  };

  return (
    <div className={classes.cardSurveys}>
      <Link to={`/answer/${item.slug}`} state={location.pathname} target="_blank" className={classes.cardSurveys__left}>
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

          <div className={classes['cardSurveys__right-author--share']} onClick={handleShare}>
            <FontAwesomeIcon icon={faLink} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CardSurveys);
