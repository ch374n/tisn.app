import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { PublicRoute, PrivateRoute, AdminRoute } from '../Router/Router';

import Home from '../Home/Home';
import UserEvents from '../UserEvents/UserEvents';
import EventSteps from '../EventSteps/EventSteps';
import Event from '../Event/Event';
import Users from '../Users/Users';
import User from '../User/User';
import UserTabs from '../UserTabs/UserTabs';
import Interests from '../Interests/Interests';

import Welcome from '../Welcome/Welcome';
import LogInForm from '../LogInForm/LogInForm';
import SignUpForm from '../SignUpForm/SignUpForm';

import AdminDashboard from '../AdminDashboard/AdminDashboard';

const Navigation = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute exact path="/events/mine" component={UserEvents} />
      <PrivateRoute exact path="/events/new" component={EventSteps} />
      <PrivateRoute exact path="/events/:id" component={Event} />
      <PrivateRoute exact path="/events/:id/edit" component={EventSteps} />
      <PrivateRoute exact path="/users" component={Users} />
      <PrivateRoute exact path="/users/:id" component={User} />
      <PrivateRoute exact path="/users/:id/edit" component={UserTabs} />
      <PrivateRoute exact path="/interests" component={Interests} />

      <PublicRoute exact path="/welcome" component={Welcome} />
      <PublicRoute exact path="/log-in" component={LogInForm} />
      <PublicRoute exact path="/sign-up" component={SignUpForm} />

      <AdminRoute exact path="/admin" component={AdminDashboard} />

      <Redirect to="/" />
    </Switch>
  );
};

export default Navigation;
