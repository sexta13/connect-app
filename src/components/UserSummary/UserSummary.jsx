import React from 'react'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import styles from './UserSummary.scss'
import {getAvatarResized} from '../../helpers/tcHelpers'
import moment from 'moment'
import PT from 'prop-types'

const UserSummary = ({user, counters}) => {
  const date = user && new Date(user.createdAt)
  const {active, draft, delivered}=counters
  return (!!user &&
    <div>
      <div className={styles.userInfoContainer}>
        <div className={styles.avatar}>
          <Avatar userName="@vic-tor"
            avatarUrl={getAvatarResized(_.get(user, 'photoURL'), 60)}
            size={60}
          />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
          <div className={styles.username}> {`@${user.handle}`}</div>
          <div className={styles.since}>Customer since {moment(date).format('MMMM YYYY')}</div>
        </div>
      </div>
      <div className={styles.projectUserInfoContainer}>
        <div className={styles.projectInfo}>
          <div className={styles.projectCounter}>{active}</div>
          <div className={styles.projectDesc}>Active Projects</div>
        </div>
        <div className={styles.projectInfo}>
          <div className={styles.projectCounter}>{draft}</div>
          <div className={styles.projectDesc}>Drafts</div>
        </div>
        <div className={styles.projectInfo}>
          <div className={styles.projectCounter}>{delivered}</div>
          <div className={styles.projectDesc}>Delivered </div>
        </div>
      </div>

    </div>
  )
}

UserSummary.propTypes = {
  user: PT.object,
  counters: PT.shape(
    {
      active: PT.number,
      draft: PT.number,
      delivered: PT.number
    }
  )
}

export default UserSummary