/* eslint-disable max-len */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef, useState } from 'react';
import {
  faChartLine,
  faComputer,
  faFilter,
  faGraduationCap,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router';
import classes from './Datasets.module.scss';
import ButtonCT from '../../components/button/ButtonCT';
import bannerDatasets from '../../assets/imgs/bannerDatasets.png';
import Tag from '../../components/tag/Tag';
import useWindowEvent from '../../hook/useWindowEvent';
import Session from './session/Session';
import ModalCreate from './modalCreate/ModalCreate';
import InputCT from '../../components/inputCT/InputCT';
import useMergeState from '../../hook/useMergeState';
import useAxios from '../../hook/useAxios';
import CardDatasets from '../../components/cardDatasets/CardDatasets';
import Pagination from '../../components/pagination/Pagination';
import CardPlaceholder from '../../components/cardPlaceholder/CardPlaceholder';

const Datasets = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const divRef = useRef();
  const [scrollY, setScrollY] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [numQuestions, setNumQuestions] = useMergeState({
    minQuestion: '',
    maxQuestion: '',
  });

  const [filter, setFilter] = useMergeState({
    tags: path.search.split('?tag=')[1] || '',
    minQuestion: '',
    maxQuestion: '',
    search: path.search.split('?key=')[1] || '',
    currentPage,
  });

  const [responseTags] = useAxios('get', '/questionnaire/all-tags/', {}, {}, []);
  const [responseData, e, isLoading] = useAxios(
    'get',
    `/questionnaire/?tags=${filter.tags}&limit=6&offset=${filter.currentPage * 6}&min_questions=${
      filter.minQuestion
    }&max_questions=${filter.maxQuestion}&key=${filter.search}`,
    {},
    {},
    [filter]
  );

  const isFilter = () =>
    filter.tags !== '' || filter.minQuestion !== '' || filter.maxQuestion !== '' || filter.search !== '';

  const handleApply = () => {
    setFilter({
      ...numQuestions,
      currentPage: 0,
    });
    setCurrentPage(0);

    setIsOpenFilter(false);
  };

  const handleClear = () => {
    setFilter({
      minQuestion: '',
      maxQuestion: '',
      currentPage: 0,
    });
    setNumQuestions({
      minQuestion: '',
      maxQuestion: '',
    });
    setIsOpenFilter(false);
    setCurrentPage(0);
  };

  const handleSelectTag = (item) => {
    const tagsTmp = tags.filter((e) => e !== item);
    const selectedTmp = [...selected, item];
    setFilter({
      tags: selectedTmp.join('|'),
      currentPage: 0,
    });
    setTags(tagsTmp);
    setSelected(selectedTmp);
    setCurrentPage(0);
  };

  const handleUnSelectTag = (item) => {
    const selectedTmp = selected.filter((e) => e !== item);
    const tagsTmp = [...tags, item];
    setFilter({
      tags: selectedTmp.join('|'),
      currentPage: 0,
    });
    setTags(tagsTmp);
    setSelected(selectedTmp);
    setCurrentPage(0);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChangePage = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newFilter = { ...filter };
      newFilter.currentPage = page;
      setFilter(newFilter);
    }
  };

  const handleSeeAll = (tag) => {
    setCurrentPage(0);
    const newFilter = { ...filter };
    newFilter.tags = tag;
    handleSelectTag(tag);
    setFilter(newFilter);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (window.scrollY <= 300) setScrollY(false);
    else setScrollY(true);
  };

  useWindowEvent('scroll', handleScroll);

  useEffect(() => {
    if (filter.minQuestion || filter.maxQuestion || filter.tags || filter.search) {
      setData(responseData.results);
    } else {
      setData(null);
    }
  }, [responseData]);

  useEffect(() => {
    if (responseTags) {
      const tmp = [];
      for (const item of responseTags.data) {
        if (item.name !== 'DEFAULT') {
          tmp.push(item.name);
        }
      }
      setTags(tmp);
    }
  }, [responseTags]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsOpenFilter(false);

        setNumQuestions({
          minQuestion: filter.minQuestion,
          maxQuestion: filter.maxQuestion,
        });
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (path.search && path.search.includes('?tag=')) {
      handleSeeAll(path.search.split('?tag=')[1]);
      navigate('/datasets');
    } else if (path.search && path.search.includes('?key=')) {
      setSearch(path.search.split('?key=')[1]);
      navigate('/datasets');
    }
  }, [path]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!path.search) {
        const newFilter = { ...filter };
        newFilter.search = search;
        newFilter.currentPage = 0;
        setFilter(newFilter);
        setCurrentPage(0);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <>
      <div className={classes.datasets}>
        <div className={classes.datasets__heading}>
          <div>
            <h1 className={classes['datasets__heading-title']}>Datasets</h1>
            <p className={classes['datasets__heading-summary']}>
              Explore, analyze, and share quality data. Learn more about data types, creating, and collaborating.
            </p>
            <div className={classes['datasets__heading-btn']}>
              <ButtonCT
                primary
                borderRadius
                large
                iconLeft={faPlus}
                onClick={() => navigate(`${path.pathname}?new=true`)}
              >
                New datasets
              </ButtonCT>
            </div>
          </div>
          <div className={classes['datasets__heading-img']}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/bannerDatasets.jpg?alt=media"
              alt=""
            />
          </div>
        </div>
        <div className={`${classes.datasets__filter} ${scrollY && classes['datasets__filter--shadow']}`}>
          <div className={classes['datasets__filter-search']}>
            <FontAwesomeIcon icon={faSearch} color="#555" />
            <input type="text" placeholder="Search datasets" onChange={handleSearch} value={search} />
            <ButtonCT
              opacityBtn
              borderRadius
              medium
              iconLeft={faFilter}
              onClick={() => setIsOpenFilter((prev) => !prev)}
            >
              <strong>Filters</strong>
            </ButtonCT>
            {(filter.minQuestion || filter.maxQuestion) && (
              <div className={classes['datasets__filter-search--circle']} />
            )}
            {isOpenFilter && (
              <div className={classes['datasets__filter-modal']} ref={divRef}>
                <h4 className={classes['datasets__filter-modal-title']}>Num Questions</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                  <InputCT
                    type="number"
                    standard
                    title="Min"
                    nonLabel
                    min={0}
                    defaultValue={numQuestions.minQuestion}
                    setValue={(val) => setNumQuestions({ minQuestion: val })}
                  />
                  <InputCT
                    type="text"
                    standard
                    title="Max"
                    nonLabel
                    min={0}
                    defaultValue={numQuestions.maxQuestion}
                    setValue={(val) => setNumQuestions({ maxQuestion: val })}
                  />
                </div>
                {/* <h4 className={classes['datasets__filter-modal-title']}>Columns</h4> */}
                {/* <div style={{ display: 'flex', gap: 10 }}>
                  <InputCT placeholder="Min" type="text" standard />
                  <InputCT placeholder="Max" type="text" standard />
                </div> */}
                <div style={{ display: 'flex', gap: 10, paddingTop: 20, justifyContent: 'flex-end' }}>
                  <ButtonCT opacityBtn medium borderRadius onClick={handleClear}>
                    <strong>Clear</strong>
                  </ButtonCT>
                  <ButtonCT standard medium borderRadius onClick={handleApply}>
                    <strong>Apply</strong>
                  </ButtonCT>
                </div>
              </div>
            )}
          </div>
          {selected &&
            selected.map((item, idx) => <Tag title={item} key={+idx} onClose={() => handleUnSelectTag(item)} active />)}
          {tags &&
            tags.map((item, idx) => (
              <span key={+idx} onClick={() => handleSelectTag(item)}>
                <Tag title={item} />
              </span>
            ))}
        </div>
        <div className={classes.datasets__content}>
          {isFilter() && !data && isLoading && [1, 2, 3, 4, 5, 6].map((item) => <CardPlaceholder key={item} />)}
          {data ? (
            data.length ? (
              <>
                {filter.search && (
                  <h3 style={{ padding: '20px 0', fontWeight: 500, color: '#202124' }}>
                    {`Search results with keyword: "${filter.search}"`}
                  </h3>
                )}
                <div style={{ padding: '20px 0' }}>
                  {data.map((item, idx) => (
                    <CardDatasets key={+idx} item={item} />
                  ))}
                </div>
                <Pagination
                  pageCount={responseData.count / 6}
                  currentPage={currentPage}
                  setCurrentPage={handleChangePage}
                />
              </>
            ) : (
              <h3 style={{ padding: '20px 0', fontWeight: 500, color: '#202124' }}>
                {`No Datasets is found with keyword: "${filter.search}"`}
              </h3>
            )
          ) : (
            <>
              <Session
                title="New Datasets"
                icon={faChartLine}
                url="/questionnaire/?limit=6&offset=0"
                onSeeAll={() => handleSeeAll('DEFAULT')}
              />
              <Session
                title="Education"
                icon={faGraduationCap}
                url="/questionnaire/?tags=Education&limit=6&offset=0"
                onSeeAll={() => handleSeeAll('Education')}
              />
              <Session
                title="Technology"
                icon={faComputer}
                url="/questionnaire/?tags=Computer Science&limit=6&offset=0"
                onSeeAll={() => handleSeeAll('Computer Science')}
              />
            </>
          )}
        </div>

        <div className={classes.datasets__QA}>
          <h1>Did not find what you were looking for?</h1>
          <ButtonCT borderRadius large outlineBtn style={{ margin: 'auto' }}>
            Explore all public datasets
          </ButtonCT>
        </div>
      </div>
      <ModalCreate />
    </>
  );
};

export default Datasets;
