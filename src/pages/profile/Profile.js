import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router';
import classes from './Profile.module.scss';
import InputCT from '../../components/inputCT/InputCT';
import SelectOption from '../../components/selectOption/SelectOption';
import auth from '../../utils/auth';
import ButtonCT from '../../components/button/ButtonCT';
import useAxiosPrivate from '../../hook/useAxiosPrivate';
import ModalUploadImg from './modalUploadImg/ModalUploadImg';
import Author from '../../components/author/Author';
import useAxios from '../../hook/useAxios';
import CardPlaceholder from '../../components/cardPlaceholder/CardPlaceholder';
import Pagination from '../../components/pagination/Pagination';
import CardDatasets from '../../components/cardDatasets/CardDatasets';

const genderMapping = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

const rankMapping = [
  {
    img: 'https://www.kaggle.com/static/images/tiers/novice@96.png',
    title: 'Beginner',
  },
  {
    img: 'https://www.kaggle.com/static/images/tiers/contributor@96.png',
    title: 'Contributor',
  },
  {
    img: 'https://www.kaggle.com/static/images/tiers/expert@96.png',
    title: 'Expert',
  },
  {
    img: 'https://www.kaggle.com/static/images/tiers/master@96.png',
    title: 'Master',
  },
];

const Profile = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const [general, setGeneral] = useState(auth.getUser());
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalImg, setIsOpenModalImg] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  const [responseData, error, isLoadingData] = useAxios(
    'get',
    `/questionnaire/?limit=6&offset=${currentPage * 6}&user_id=${general.id}`,
    {},
    {},
    [currentPage]
  );

  console.log(responseData);

  const handleChangeFirstName = (value) => {
    const tmp = { ...general };
    tmp.first_name = value;
    setGeneral(tmp);

    if (value !== general.first_name) {
      setIsChange(true);
    }
  };
  const handleChangeLastName = (value) => {
    const tmp = { ...general };
    tmp.last_name = value;
    setGeneral(tmp);

    if (value !== general.last_name) {
      setIsChange(true);
    }
  };
  const handleChangeGender = (value) => {
    const tmp = { ...general };
    tmp.gender = value.toLowerCase();
    setGeneral(tmp);

    if (value !== general.gender) {
      setIsChange(true);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      setIsLoading(true);
      const res = await axiosPrivate.patch('/auth/update/', general);
      setIsChange(false);

      auth.updateUser(res.data.data);

      toast.success('Upload profile successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (e) {
      toast.error('Upload profile failed! Please try again!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (!path.pathname.includes(general.slug)) {
      navigate('/404');
    }
  }, []);

  return (
    <div style={{ maxWidth: '1300px', margin: 'auto' }}>
      <div className={classes.profile}>
        <div className={classes.profile__general}>
          <div className={classes['profile__general-avatar']}>
            {/* <img src={auth.getUser().avatar} alt="" /> */}
            <Author
              size="140"
              borderRankSize="12"
              rank={Math.floor(((Math.random() * 10) % 4) + 1)}
              img={auth.getUser().avatar}
            />

            <ButtonCT borderRadius outlineBtn medium onClick={() => setIsOpenModalImg(true)}>
              Change avatar
            </ButtonCT>
          </div>
          <div className={classes['profile__general-info']}>
            <div className={classes['profile__general-info--item']}>
              <InputCT
                flex
                nonLabel
                standard
                required
                placeholder="First name"
                defaultValue={general.first_name}
                setValue={handleChangeFirstName}
                style={{ minWidth: '200px' }}
              />
              <InputCT
                flex
                nonLabel
                standard
                required
                placeholder="Last name"
                defaultValue={general.last_name}
                setValue={handleChangeLastName}
                style={{ minWidth: '200px' }}
              />
            </div>
            <div className={classes['profile__general-info--item']}>
              <InputCT
                flex
                nonLabel
                standard
                required
                placeholder="Email"
                defaultValue={general.email}
                disabled
                style={{ minWidth: '200px' }}
              />
              <div style={{ margin: '8px 14px 32px 0', flex: 1, minWidth: '120px' }}>
                <SelectOption
                  options={['Male', 'Female', 'Other']}
                  defaultValue={genderMapping[general.gender]}
                  setSelect={handleChangeGender}
                />
              </div>
            </div>
            <ButtonCT
              primary
              medium
              style={{ width: '100px', marginLeft: 'auto', marginRight: '14px' }}
              disabled={!isChange}
              loading={isLoading && isChange}
              onClick={handleSaveGeneral}
            >
              Save
            </ButtonCT>
          </div>
          <div className={classes['profile__general-rank']}>
            <img src={rankMapping[0].img} alt="" />
            <h3>{rankMapping[0].title}</h3>
          </div>
        </div>

        <div className={classes.profile__yourWork}>
          <h3 className={classes['profile__yourWork-title']}>Your Work</h3>
          {!responseData && isLoadingData && [1, 2, 3, 4, 5, 6].map((item) => <CardPlaceholder key={item} />)}
          {responseData && responseData.results.length ? (
            <>
              <div style={{ padding: '20px 0' }}>
                {responseData.results.map((item, idx) => (
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
            <h3 style={{ padding: '20px 0', fontWeight: 500, color: '#202124' }}>No work is found</h3>
          )}
        </div>
      </div>
      <ModalUploadImg defaultImg={auth.getUser().avatar} isOpen={isOpenModalImg} setIsOpen={setIsOpenModalImg} />
    </div>
  );
};

export default Profile;
