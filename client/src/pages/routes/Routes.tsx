import { Switch, Route } from "react-router-dom";
import Lottie from "lottie-react";
import helpSpinner from "../../lottie/help-animation.json";
import NavBar from "../../components/navBar/NavBar";
import Home from "../home/Home";
import Profile from "../profile/Profile";
import Map from "../map/Map";
import SignUp from "../signUp/SignUp";
import Login from "../login/Login";
import About from "../about/About";
import Contact from "../contact/Contact";
import EditProfile from "../editProfile/EditProfile";
import { usePreferences } from "../../contexts/Preferences.context";
import Chat from "../chat/Chat";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute";
import PublicRoute from "../../components/PrivateRoute/PublicRoute";

const Routes = () => {
  const { isLoading, setHamburgerOpen, hamburgerOpen, setDisplayNotifs } =
    usePreferences();

  const closeMenu = (e: any) => {
    if (
      e.target.id !== "burgerIcon" &&
      e.target.id !== "burgerMenu" &&
      hamburgerOpen
    ) {
      setHamburgerOpen(false);
    }
    if (e.target.id === "main") {
      setDisplayNotifs(false);
    }
  };

  return (
    <div onClick={closeMenu} id="main" className="mainContainer">
      <div className="bg-container"></div>
      <NavBar />
      {isLoading && (
        <Lottie className="lottieSpinner" animationData={helpSpinner} loop />
      )}
      <Switch>
        <Route exact component={Home} path="/" />
        <PrivateRoute exact component={Profile} path="/profile/:id?" />
        <PrivateRoute exact component={Map} path="/map" />
        <Route exact component={Contact} path="/contact" />
        <Route exact component={About} path="/about" />
        <PublicRoute exact component={SignUp} path="/signUp" />
        <PublicRoute exact component={Login} path="/login" />
        <PrivateRoute exact component={Chat} path="/chat" />
        <PrivateRoute exact component={EditProfile} path="/editProfile" />
      </Switch>
    </div>
  );
};

export default Routes;
