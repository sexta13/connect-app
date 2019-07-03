import React from 'react'
import styles from './MenuItem.scss'
import { NavLink } from 'react-router-dom'

function MenuItem ({ label, icon, to, isActive, onClick }) {
  return (<li className={styles.container}>
    {to
      ? <NavLink to={to} activeClassName={styles.active} exact>
        <div className={styles.roundCorners}>
          <div className={`${styles.top} ${styles.right}`} />
          <div className={`${styles.bottom} ${styles.right}`} />
          <div className={styles.menuItem}>
            {icon}
            <div className={styles.label}>
              {label}
            </div>
          </div>
        </div>
      </NavLink>
      : <span onClick={onClick} styleName={isActive ? 'active' : ''}>{label}</span>
    }
  </li>)
}

export default MenuItem