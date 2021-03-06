import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { useUser } from "../../contexts/User.context";
import { useUsersUpdates } from "../../contexts/UsersUpdates.context";
import { usePreferences } from "../../contexts/Preferences.context";
import { useSocket } from "../../contexts/Socket.context";

import serverAPI from "../../api/serverApi";
import { headerOptions, NotificationObject } from "../../types/types";

import { StyledHamburgerMenu } from "./styledHamburgerMenu";
import { StyledHamburgerList } from "./styledHamburgerList";
import { StyledHamburgerIcons } from "./styledHamburgerIcons";
import { StyledNotifsContainer } from "./StyledNotifsContainer";
import { StyledButton } from "../styledButton/StyledButton";
import { StyledRequestHelpIcon } from "./StyledRequestHelpIcon";
import MakeRequest from "../../pages/makeRequest/MakeRequest";
import { StyledIcons } from "./StyledIcons";
import { StyledLogo } from "./StyledLogo";
import logoText from "../../assets/images/logoText.png";
import logoIcon from "../../assets/images/marker.svg";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { GrAddCircle } from "react-icons/gr";
import { MdOutlineNotifications } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { useChat } from "../../contexts/Chat.context";

function NavBar() {
  const [responding, setResponding] = useState(false);
  const { currentUser, token, logOut } = useUser();
  const { notifications, setNotifications } = useUsersUpdates();
  const { socket } = useSocket();
  const { userMessages, resetUnreadCount } = useChat();
  const {
    hamburgerOpen,
    setHamburgerOpen,
    toggleHamburger,
    isLoaded,
    displayNotifs,
    setDisplayNotifs,
    toggleNotifications,
    requestPopup,
    setRequestPopup,
    toggleRequestPopup,
  } = usePreferences();

  useEffect(() => {
    setResponding(false);
  }, [notifications]);

  const getNotificationsJSX = () => {
    return notifications?.notifications.map((notObj) => {
      if (notObj.accepted !== undefined) {
        return responseToOfferingJSX(notObj);
      } else if (notObj.accept !== undefined) {
        if (notObj.accept === "deciding") {
          return decidingToAcceptNotifJSX(notObj);
        } else if (notObj.accept === "yes") {
          return acceptedDeclineOfferJSX(notObj, true);
        } else if (notObj.accept === "no") {
          return acceptedDeclineOfferJSX(notObj, false);
        } else {
          return offerMarkerExpiredJSX(notObj);
        }
      } else if (notObj.reviewed !== undefined) {
        return userLeftAReviewJSx(notObj);
      } else {
        return addedMarkerNotifJSX(notObj);
      }
    });
  };

  const responseToOfferingJSX = (notObj: NotificationObject) => {
    const response = notObj.accepted ? "accepted" : "declined";
    const review = notObj.accepted ? " Make sure to leave a review after!" : "";
    return (
      <div key={notObj._id}>
        <NavLink
          onClick={() => setDisplayNotifs(false)}
          to={`/profile/${notObj.userID}`}
        >
          <span>{notObj.name}</span>
        </NavLink>
        {` has ${response} your offer!${review}`}
        <hr />
      </div>
    );
  };

  const decidingToAcceptNotifJSX = (notObj: NotificationObject) => {
    return (
      <div key={notObj._id}>
        <NavLink
          onClick={() => setDisplayNotifs(false)}
          to={`/profile/${notObj.userID}`}
        >
          <span>{notObj.name}</span>
        </NavLink>
        {" is offering to help!"}
        <div className="decidingContainer">
          <StyledButton
            disabled={responding}
            onClick={() => handleResponse("no", notObj)}
          >
            Decline
          </StyledButton>
          <StyledButton
            disabled={responding}
            onClick={() => handleResponse("yes", notObj)}
          >
            Accept
          </StyledButton>
        </div>
        <hr />
      </div>
    );
  };

  const handleResponse = async (res: string, notObj: NotificationObject) => {
    setResponding(true);
    socket.emit("responseToOffer", { res, notObj });
    if (res === "yes") {
      const options: headerOptions = {
        headers: {
          Authorization: token!,
        },
      };
      try {
        await serverAPI(options).delete(
          `/markers/deleteMarker/${notObj.markerID}`
        );
        await serverAPI(options).put("/users/updateUsersToReview", {
          add: true,
          toUser: notObj.userID,
        });
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  const acceptedDeclineOfferJSX = (
    notObj: NotificationObject,
    response: boolean
  ) => {
    return (
      <div key={notObj._id}>
        {response ? "You have accepted " : "You have declined "}
        <NavLink
          onClick={() => setDisplayNotifs(false)}
          to={`/profile/${notObj.userID}`}
        >
          <span>{notObj.name}</span>
        </NavLink>
        {`'s offer!${response ? " Make sure you leave a review after" : ""}`}
        <hr />
      </div>
    );
  };

  const offerMarkerExpiredJSX = (notObj: NotificationObject) => {
    return (
      <div key={notObj._id}>
        <NavLink
          onClick={() => setDisplayNotifs(false)}
          to={`/profile/${notObj.userID}`}
        >
          <span>{notObj.name}</span>
        </NavLink>
        {" has offered to help, but the request has expired!"}
        <hr />
      </div>
    );
  };

  const userLeftAReviewJSx = (notObj: NotificationObject) => {
    return (
      <div key={notObj._id}>
        <NavLink
          onClick={() => setDisplayNotifs(false)}
          to={`/profile/${notObj.userID}`}
        >
          <span>{notObj.name}</span>
        </NavLink>
        {" has posted a review about you! check your "}
        <NavLink onClick={() => setDisplayNotifs(false)} to={"/profile"}>
          <span>profile</span>
        </NavLink>
        <hr />
      </div>
    );
  };

  const addedMarkerNotifJSX = (notObj: NotificationObject) => {
    return (
      <div key={notObj._id}>
        <NavLink
          onClick={() => setDisplayNotifs(false)}
          to={`/profile/${notObj.userID}`}
        >
          <span>{notObj.name}</span>
        </NavLink>
        {" is requesting help, check the "}
        <NavLink onClick={() => setDisplayNotifs(false)} to={"/map"}>
          <span>map</span>
        </NavLink>
        <hr />
      </div>
    );
  };

  const handleNotifClick = async () => {
    toggleNotifications();
    if (notifications!.unRead > 0) {
      const options: headerOptions = {
        headers: {
          Authorization: token!,
        },
      };
      try {
        setNotifications((prev: any) => ({ ...prev, unRead: 0 }));
        await serverAPI(options).put("/notifications/updateUnRead");
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  return (
    <>
      <NavLink to="/">
        <StyledLogo>
          <img src={logoText} id="logoText" alt="text" />
          <img src={logoIcon} alt="icon" />
        </StyledLogo>
      </NavLink>
      <StyledHamburgerIcons
        id="burgerIcon"
        onClick={() => {
          toggleHamburger();
          if (displayNotifs) {
            setDisplayNotifs(false);
          }
        }}
      >
        {hamburgerOpen ? <AiOutlineClose /> : <FiMenu />}
      </StyledHamburgerIcons>
      <StyledHamburgerMenu id="burgerMenu" active={hamburgerOpen}>
        <StyledHamburgerList onClick={() => setHamburgerOpen(false)}>
          <NavLink to="/">
            <li>Home</li>
          </NavLink>
          {currentUser && (
            <NavLink to="/profile">
              <li>Profile</li>
            </NavLink>
          )}
          {currentUser && currentUser.helper && (
            <NavLink to="/map">
              <li>Map</li>
            </NavLink>
          )}

          <NavLink to="/about">
            <li>About</li>
          </NavLink>

          <NavLink to="/contact">
            <li>Contact</li>
          </NavLink>

          {!currentUser && (
            <>
              <NavLink to="/signUp">
                <li>SignUp</li>
              </NavLink>

              <NavLink to="/login">
                <li>Login</li>
              </NavLink>
            </>
          )}
          {currentUser && (
            <NavLink onClick={logOut} to="/">
              <li>Logout</li>
            </NavLink>
          )}
        </StyledHamburgerList>
      </StyledHamburgerMenu>
      {currentUser && (
        <StyledIcons
          notCount={notifications?.unRead}
          msgCount={userMessages?.newMsgUsersIDs.length || 0}
        >
          <MdOutlineNotifications className="icon" onClick={handleNotifClick} />
          {displayNotifs && (
            <>
              <div className="tip"></div>
              <StyledNotifsContainer>
                {getNotificationsJSX()}
              </StyledNotifsContainer>
            </>
          )}
          <NavLink onClick={resetUnreadCount} to="/chat">
            <BsChatDots className="icon" />
          </NavLink>
        </StyledIcons>
      )}
      {currentUser && !currentUser.helper && (
        <StyledRequestHelpIcon>
          {isLoaded && <GrAddCircle onClick={toggleRequestPopup} />}
        </StyledRequestHelpIcon>
      )}
      {requestPopup && <MakeRequest close={setRequestPopup} />}
    </>
  );
}

export default NavBar;
