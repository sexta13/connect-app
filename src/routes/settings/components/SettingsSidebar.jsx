import React from 'react'
import UserSummary from '../../../components/UserSummary/UserSummary'
import MenuList from '../../../components/MenuList/MenuList'
import FileIcon from '../../../assets/icons/file.svg'

import styles from './SettingsSidebar.scss'

const settings = [
  {label: 'All Projects',
    to:'/projects?sort=updatedAt%20desc',
    Icon: FileIcon},
  {
    label: 'My Profile',
    to: '/settings/profile',
    Icon: FileIcon
  },
  {
    label: 'Notifications',
    to: '/settings/notifications',
    Icon: FileIcon
  },
  {
    label: 'Account & Security',
    to: '/settings/account',
    Icon: FileIcon
  }, ]


const Sidebar = ({user}) => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.userSummary}>
          <UserSummary user={user} counters={{ active: 4, draft: 7, delivered:5 }} />
        </div>
        <hr className={styles.separator} />
        <div className={styles.system}>
          <div className={styles.systemTitle}>SYSTEM</div>
          <div className={styles.menuList}>
            <MenuList navLinks={settings}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar