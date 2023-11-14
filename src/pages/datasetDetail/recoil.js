import { atom } from 'recoil';

export const aboutRecoil = atom({
  key: 'aboutRecoil',
  default: null,
});

export const likersRecoil = atom({
  key: 'likersRecoil',
  default: [],
});

export const datasetRecoil = atom({
  key: 'datasetRecoil',
  default: null,
});

export const statisticsRecoil = atom({
  key: 'statisticsRecoil',
  default: null,
});
