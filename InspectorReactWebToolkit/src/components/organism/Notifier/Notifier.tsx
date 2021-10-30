import React, { useContext } from "react";
import { observer } from 'mobx-react-lite'
import { styled } from '@material-ui/core/styles';

import { StoreContext } from "../../../core/store/rootStore";
import { ENotification } from "../../../core/store/notificationsStore/notificationsTypes";

const Notifier = observer(() => {
  const { notificationStore } = useContext(StoreContext)
  const notifications = notificationStore.notifications
  const clearNotification = notificationStore.clearNotification
  
  return (
    <Styled.Container>
      {notifications.map((item) => (
        <Styled.AnimatedCard
          key={Math.random()}
          variant={item.variant}
          //style={props}
          onClick={() => clearNotification(item.id)}
        >
          <i className="close-icon">×</i>
          {item.message}
        </Styled.AnimatedCard>
      ))}
    </Styled.Container>
  );
})

const COLORS = {
  [ENotification.ALERT]: "#eba434",
  [ENotification.ERROR]: "#cc2821",
  [ENotification.SUCCESS]: "#12b255"
};

const Styled = {
  Container: styled('div')({
    position: 'relative',
    left: '0px',
    top: '0px',
  }),
  AnimatedCard: styled('button')({
    position: 'relative',
    backgroundColor: (props: {variant: ENotification}) => COLORS[props.variant],
    border: 'none',
    color: 'white',
    fontSize: '14px',
    lineHeight: '1.4',
    marginBottom: '8px',
    padding: '16px 24px 16px 16px',
    textAlign: 'left',
    width: '400px',
    whiteSpace: 'pre-wrap',
    '& i': {
      position: 'absolute',
      fontSize: '20px',
      fontStyle: 'normal',
      right: '8px',
      top: '0px',
      cursor: 'pointer'
    }
  })
};

export default Notifier