import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import styles from './Header.module.css';

interface Props {
  backLink: string;
  forwardLink?: string;
  state?: any;
  disabled?: boolean;
  screenName?: string;
}

const Header = ({
  backLink,
  forwardLink,
  state,
  disabled,
  screenName,
}: Props) => {
  const forwardTo = { pathname: forwardLink, state: state };

  return (
    <div className={styles.container}>
      <div>
        <Link to={backLink}>
          <AiOutlineLeft className={styles.arrow} />
        </Link>
      </div>

      {disabled ? (
        <div>
          <AiOutlineRight className={styles.disabled} />
        </div>
      ) : (
        <div>
          {forwardLink && (
            <Link to={forwardTo}>
              <AiOutlineRight className={styles.arrow} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
