import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import classes from './Tag.module.scss';

const Tag = ({ title, active, onClose }) => (
  <div className={`${classes.tag} ${active ? classes['tag--active'] : undefined}`}>
    <p className={classes.tag__title}>{title}</p>
    {active && (
      <div className={classes.tag__close} onClick={onClose}>
        <FontAwesomeIcon icon={faClose} fontSize={18} color="#333" />
      </div>
    )}
  </div>
);

export default Tag;
