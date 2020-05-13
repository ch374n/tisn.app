import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';

import { getFriendships } from '../../logic/api';
import {
  classifyFriendships,
  buildMessageNotificationsObject,
  sortChats,
} from '../../logic/utils';
import { distanceToNow } from '../../logic/date-time';

import { useUser } from '../UserProvider/UserProvider';
import { useNotifications } from '../NotificationsProvider/NotificationsProvider';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Chats = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();
  const user = useUser();
  const notifications = useNotifications();

  const [friendships, setFriendships] = useState(null);
  const [messageNotifications, setMessageNotifications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      getFriendships(user._id)
        .then((data) =>
          setFriendships(classifyFriendships(data.friendships, user).accepted)
        )
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (notifications) {
      setMessageNotifications(
        buildMessageNotificationsObject(notifications.message)
      );
    }
  }, [notifications]);

  useEffect(() => {
    if (friendships) {
      setFriendships(sortChats(friendships));
    }
  }, [friendships]);

  const friendshipCardHeader = (friendship) => {
    const friendshipUser =
      friendship.requestant._id === user._id
        ? friendship.receivant
        : friendship.requestant;

    return (
      <CardHeader
        avatar={
          <Badge
            badgeContent={
              messageNotifications[friendship._id] &&
              messageNotifications[friendship._id].length
            }
            color="secondary"
            overlap="circle"
          >
            <Avatar
              src={friendshipUser.avatar}
              alt={t('chats.avatar', { name: friendshipUser.name })}
              style={{ margin: '4px' }}
            >
              {friendshipUser.name.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
        }
        title={friendshipUser.name}
        subheader={
          friendship.lastMessageAt
            ? t('chats.lastMessage', {
                timeDistance: distanceToNow(friendship.lastMessageAt),
              })
            : t('chats.noMessages', {
                timeDistance: distanceToNow(friendship.acceptedAt),
              })
        }
        subheaderTypographyProps={{ className: style.preLine }}
      />
    );
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <Typography variant="h2">{t('chats.title')}</Typography>
          </Grid>
          {friendships && friendships.length > 0
            ? friendships.map((friendship) => (
                <Grid item key={friendship._id} md={4} sm={6} xs={12}>
                  <Card>
                    <CardActionArea
                      component={Link}
                      to={`/chats/${friendship._id}`}
                    >
                      {friendshipCardHeader(friendship)}
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            : !loading && (
                <Grid item className={`${style.fullWidth} ${style.center}`}>
                  <Typography gutterBottom variant="body1">
                    {t('chats.noFriendships')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push('/users')}
                  >
                    {t('chats.browseUsers')}
                  </Button>
                </Grid>
              )}
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Chats;
