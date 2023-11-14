import React from 'react';
import { useLocation } from 'react-router';
import {
  TelegramIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from 'react-share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import classes from './ModalShare.module.scss';

const ModalShare = ({ isOpen, setIsOpen }) => {
  const path = useLocation();

  const url = process.env.REACT_APP_DOMAIN + path.pathname;

  return (
    <>
      <div
        className={`${classes.modalShare} ${isOpen ? classes['modalShare--active'] : undefined}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`${classes.modalShare__content} ${isOpen ? classes['modalShare__content--active'] : undefined}`}>
        <div className={classes['modalShare__content-close']}>
          <p>Share</p>
          <FontAwesomeIcon icon={faClose} fontSize={20} onClick={() => setIsOpen(false)} />
        </div>
        <div style={{ paddingTop: 20 }}>
          <FacebookShareButton url={url} className={classes['modalShare__content-item']}>
            <FacebookIcon size={32} borderRadius={50} />
            <p>Share on Facebook</p>
          </FacebookShareButton>
          <TelegramShareButton url={url} className={classes['modalShare__content-item']}>
            <TelegramIcon size={32} borderRadius={50} />
            <p>Share on Telegram</p>
          </TelegramShareButton>
          <LinkedinShareButton url={url} className={classes['modalShare__content-item']}>
            <LinkedinIcon size={32} borderRadius={50} />
            <p>Share on LinkedIn</p>
          </LinkedinShareButton>
          <TwitterShareButton url={url} className={classes['modalShare__content-item']}>
            <TwitterIcon size={32} borderRadius={50} />
            <p>Share on Twitter</p>
          </TwitterShareButton>
        </div>
      </div>
    </>
  );
};

export default ModalShare;
