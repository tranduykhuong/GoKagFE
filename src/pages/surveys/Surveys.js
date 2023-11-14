/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { faFilter, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonCT from '../../components/button/ButtonCT';
import classes from './Surveys.module.scss';
import Tag from '../../components/tag/Tag';
import useWindowEvent from '../../hook/useWindowEvent';
import CardSurveys from '../../components/cardSurveys/CardSurveys';
import Pagination from '../../components/pagination/Pagination';
import ModalCreateSurvey from './modalCreateSurvey/ModalCreateSurvey';
import useMergeState from '../../hook/useMergeState';
import useAxios from '../../hook/useAxios';
import CardPlaceholder from '../../components/cardPlaceholder/CardPlaceholder';
import InputCT from '../../components/inputCT/InputCT';

const Surveys = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const divRef = useRef();
  const [scrollY, setScrollY] = useState(0);
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
    tags: '',
    minQuestion: '',
    maxQuestion: '',
    isFilter: false,
    search,
    currentPage,
  });

  const [responseTags] = useAxios('get', '/questionnaire/all-tags/', {}, {}, []);
  const [responseData] = useAxios(
    'get',
    `/questionnaire/?tags=${filter.tags}&limit=6&offset=${filter.currentPage * 6}&min_questions=${
      filter.minQuestion
    }&max_questions=${filter.maxQuestion}&key=${filter.search}`,
    {},
    {},
    [filter]
  );

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
    setData(responseData.results);
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
      navigate('/surveys');
    }
  }, [path]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilter = { ...filter };
      newFilter.search = search;
      newFilter.currentPage = 0;
      setFilter(newFilter);
      setCurrentPage(0);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <>
      <div className={classes.surveys}>
        <div className={classes.surveys__heading}>
          <div>
            <h1 className={classes['surveys__heading-title']}>Surveys</h1>
            <p className={classes['surveys__heading-summary']}>
              Explore, analyze, and share quality data. Learn more about data types, creating, and collaborating.
            </p>
            <div className={classes['surveys__heading-btn']}>
              <ButtonCT
                primary
                borderRadius
                large
                iconLeft={faPlus}
                onClick={() => navigate(`${path.pathname}?new=true`)}
              >
                New surveys
              </ButtonCT>
            </div>
          </div>
          <div className={classes['surveys__heading-img']}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/bannerSurvey.jpg?alt=media"
              alt=""
            />
          </div>
        </div>
        <div className={`${classes.surveys__filter} ${scrollY && classes['surveys__filter--shadow']}`}>
          <div className={classes['surveys__filter-search']}>
            <FontAwesomeIcon icon={faSearch} color="#555" />
            <input type="text" placeholder="Search surveys" onChange={handleSearch} />
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
              <div className={classes['surveys__filter-search--circle']} />
            )}
            {isOpenFilter && (
              <div className={classes['surveys__filter-modal']} ref={divRef}>
                <h4 className={classes['surveys__filter-modal-title']}>Num Questions</h4>
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
                {/* <h4 className={classes['surveys__filter-modal-title']}>Columns</h4> */}
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
        <div className={classes.surveys__content}>
          {!data && [1, 2, 3, 4, 5, 6].map((item) => <CardPlaceholder key={item} />)}
          {data && data.length ? (
            <>
              <div style={{ padding: '20px 0' }}>
                {data.map((item, idx) => (
                  <CardSurveys key={+idx} item={item} />
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
              {`No surveys is found with keyword: "${search}"`}
            </h3>
          )}
        </div>

        <div className={classes.surveys__QA}>
          <h1>Did not find what you were looking for?</h1>
          <ButtonCT borderRadius large outlineBtn style={{ margin: 'auto' }}>
            Explore all public surveys
          </ButtonCT>
        </div>
      </div>
      <ModalCreateSurvey />
    </>
  );
};

export default Surveys;
