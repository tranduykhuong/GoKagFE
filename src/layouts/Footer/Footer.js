import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './Footer.module.scss';
import logo from '../../assets/imgs/GOKag.png';
import iconFacebook from '../../assets/imgs/icon_facebook.png';
import iconLinkedIn from '../../assets/imgs/icon_linkedIn.png';
import useAxios from '../../hook/useAxios';

const Footer = () => {
  const [responseTags, setResponseTags] = useState(null);
  const [response] = useAxios('get', '/questionnaire/all-tags/', {}, {}, []);

  useEffect(() => {
    if (response) {
      setResponseTags(response.data);
    }
  }, [response]);

  return (
    <div className={classes.footer}>
      <div className={classes.footer__wrap}>
        <div className={classes['footer__wrap-session']}>
          <img src={logo} alt="" width={140} />
          <div className={classes['footer__wrap-contact']}>
            <a href="https://goldenowl.asia/">
              <img src={iconFacebook} alt="" width={30} />
            </a>
            <a href="https://www.linkedin.com/company/golden-owl-consulting/">
              <img src={iconLinkedIn} alt="" width={30} />
            </a>
          </div>
        </div>
        <div className={classes['footer__wrap-session']}>
          <h4>Questionnaire</h4>
          {responseTags &&
            responseTags
              .filter((e) => e.name !== 'DEFAULT')
              .reverse()
              .splice(0, 3)
              .map((item, idx) => (
                <p key={+idx}>
                  <Link to={`/surveys?tag=${item.name}`}>{item.name}</Link>
                </p>
              ))}
        </div>
        <div className={classes['footer__wrap-session']}>
          <h4>Datasets</h4>
          {responseTags &&
            responseTags
              .filter((e) => e.name !== 'DEFAULT')
              .splice(0, 4)
              .map((item, idx) => (
                <p key={+idx}>
                  <Link to={`/datasets?tag=${item.name}`}>{item.name}</Link>
                </p>
              ))}
        </div>
        <div className={classes['footer__wrap-session']}>
          <h4>Company</h4>
          <p>
            <a href="https://goldenowl.asia/">Golden Owl Consultant</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Footer);
