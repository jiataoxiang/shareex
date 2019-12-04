import React from 'react';
import Home from './components/Homepage/Home';
import UserProfile from './components/UserProfile/UserProfile';
import AdminProfile from './components/UserProfile/AdminProfile';
import OtherProfile from './components/UserProfile/OtherProfile';
// import AdminProfile from "./components/UserProfile/AdminProfile";
import Login from './components/Login/Login';
import SignUp from './components/Signup/SignUp';
import NewPost from './components/NewPost/NewPost';
import NotFound404 from './components/404';
import SinglePost from './components/SinglePost/SinglePost';
import ProfSetting from './components/prof_set/prof_set';
import Navbar from './components/Navbar';
// import Tmp from "./components/Tmp";
// import { rand_string } from "./lib/util";
// import { uid } from "react-uid";
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';
import ImageUploader from './components/ImageUploader';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    store.dispatch(loadUser());
  }

  setAppState = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            <Route exact path="/index.html" component={() => <Home />} />
            <Route exact path="/userprofile" component={() => <UserProfile />} />
            <Route exact path="/adminprofile" component={() => <AdminProfile />} />
            <Route exact path="/otherprofile/:id" component={() => <OtherProfile />} />
            <Route exact path="/login" component={() => <Login />} />
            <Route exact path="/signup" component={() => <SignUp />} />
            <Route exact path="/new_post" component={() => <NewPost />} />
            <Route exact path="/edit_post" component={() => <NewPost />} />
            {/*<Route*/}
            {/*  exact*/}
            {/*  path="/single_post/:id"*/}
            {/*  component={() => <SinglePost />}*/}
            {/*/>*/}
            <Route exact path="/single_post/:id" render={() => <SinglePost />} />
            <Route exact path="/prof_setting" component={() => <ProfSetting />} />
            <Route exact path="/image_uploader" component={() => <ImageUploader />} />
            {/* <Route exact path="/tmp" component={Tmp} /> */}

            <Route component={NotFound404} />
            <Route exact path="/404notfound" component={NotFound404} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
