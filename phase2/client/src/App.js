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
import mock_data from './mock_data';
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
    this.setState({
      users: mock_data.users,
      posts: mock_data.posts,
      comments: mock_data.comments,
      attachments: mock_data.attachments,
      current_user: mock_data.current_user,
      current_post: mock_data.current_post,
      setAppState: this.setAppState,
    });
    store.dispatch(loadUser());
  }

  setAppState = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Navbar state={this.state} />
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            <Route exact path="/index.html" component={() => <Home state={this.state} />} />
            <Route exact path="/userprofile" component={() => <UserProfile state={this.state} />} />
            <Route
              exact
              path="/adminprofile"
              component={() => <AdminProfile state={this.state} />}
            />
            <Route
              exact
              path="/otherprofile/:id"
              component={() => <OtherProfile state={this.state} />}
            />
            <Route exact path="/login" component={() => <Login state={this.state} />} />
            <Route exact path="/signup" component={() => <SignUp state={this.state} />} />
            <Route exact path="/new_post" component={() => <NewPost state={this.state} />} />
            <Route exact path="/edit_post" component={() => <NewPost state={this.state} />} />
            {/*<Route*/}
            {/*  exact*/}
            {/*  path="/single_post/:id"*/}
            {/*  component={() => <SinglePost state={this.state}/>}*/}
            {/*/>*/}
            <Route exact path="/single_post/:id" render={() => <SinglePost state={this.state} />} />
            <Route
              exact
              path="/prof_setting"
              component={() => <ProfSetting state={this.state} />}
            />
            <Route exact path="/image_uploader" component={() => <ImageUploader />} />
            {/* <Route exact path="/tmp" component={Tmp} /> */}

            <Route component={NotFound404} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
