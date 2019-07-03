import React from 'react'
import MenuItem from './MenuItem'
import styles from './MenuList.scss'

function MenuList ({menuItems}) {

  return (<div className={styles.container}>
    <div className={styles.line}/>
    <nav className={styles.navList}>
      <ul>
        {menuItems.map(item =>
          (
            <MenuItem key={item.label}
              label={item.label}
              icon={item.icon}
              to={item.to}
            />)
        )}
      </ul>
    </nav>
  </div>)
}

export default MenuList