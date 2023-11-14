import React from 'react';
import classes from './Author.module.scss';

const Author = ({ size, rank, img, borderRankSize }) => {
  const ranks = [
    {
      color: '#1ccd76',
      deg: 80,
    },
    {
      color: '#20beff',
      deg: 160,
    },
    {
      color: '#651fff',
      deg: 250,
    },
    {
      color: '#ff5c19',
      deg: 340,
    },
  ];

  return (
    <div
      className={classes.author}
      style={{
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `conic-gradient(${ranks[rank - 1].color} 0 ${ranks[rank - 1].deg}deg, #ddd 0deg)`,
      }}
    >
      <div
        className={classes.author__img}
        style={{
          width: `calc(100% - ${borderRankSize || 4}px)`,
          height: `calc(100% - ${borderRankSize || 4}px)`,
        }}
      >
        <img
          src={img}
          alt=""
          style={{
            width: `calc(100% - ${borderRankSize / 2 || 2}px)`,
            height: `calc(100% - ${borderRankSize / 2 || 2}px)`,
          }}
        />
      </div>
    </div>
  );
};

export default Author;
