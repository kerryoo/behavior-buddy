import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import UploadVideoScreen from './screens/UploadVideoScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import GeneralInfoScreen from './screens/GeneralInfoScreen';
import NewSetScreen from './screens/NewSetScreen';
import SetLibraryScreen from './screens/SetLibraryScreen';
import ConfirmationScreen from './screens/ConfirmationScreen'
import ReliabilityScreen from './screens/ReliabilityScreen';
import './App.global.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/generalinfo" component={GeneralInfoScreen} />
        <Route path="/newset" component={NewSetScreen} />
        <Route path="/setlibrary" component={SetLibraryScreen} />
        <Route path="/uploadvideo" component={UploadVideoScreen} />
        <Route path="/videoplayer" component={VideoPlayerScreen} />
        <Route path="/confirm" component={ConfirmationScreen} />
        <Route path="/reliability" component={ReliabilityScreen} />
        <Route path="/" component={HomeScreen} />
      </Switch>
    </Router>
  );
}
