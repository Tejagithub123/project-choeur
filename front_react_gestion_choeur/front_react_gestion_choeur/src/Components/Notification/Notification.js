//aziz
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { io } from "socket.io-client";
import { BsBell } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [counter, setcounter] = useState(false);
  const [storedToken, setStoredToken] = useState();
  const [user, setUser] = useState();
  const [confirmation, setconfirmation] = useState(false);
  const [count, setcount] = useState(5);
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();
  const socket = io.connect("http://localhost:5000/");
  console.log(socket);
  useEffect(() => {
    if (socket && user) {
      // Set the user's socketId when they connect
      socket.emit("setSocketId", user._id);
      // Listen for notifications only if socket is defined
      socket.on("getNotification", (allCandidates) => {
        console.log("Rappel", allCandidates);
        setCandidates(allCandidates);
      });
      //////////////////////////////////

      return () => {
        // Clean up the socket connection on component unmount
        socket.removeAllListeners(); // Remove all event listeners
        socket.disconnect();
      };
    }
  }, [user, socket]);

  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue && storedTokenValue != "null") {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        console.log(storedToken);
        fetchUser();
      }
    }
  }, [storedToken, counter]);
  const fetchUser = async () => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      console.log(decodedToken.userId);
      socket.emit("setSocketId", decodedToken.userId);
      // const res = null;
      const res = await axios.get(
        `http://localhost:3000/api/utilisateur/getutilisateur/${decodedToken.userId}`
      );

      if (res) {
        setUser(res.data[0]);
        // console.log("yoo", res.data[0].notifications);
        const notifications = res.data[0].notifications;
        setNotifications(notifications);
        let unreadCount = 0;
        for (let i = 0; i < notifications.length; i++) {
          if (!notifications[i].read) {
            unreadCount++;
          }
        }
        setcounter(unreadCount);
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        let dataPlusRead = {
          notification: data,
          read: false,
        };
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          dataPlusRead,
        ]);
        console.log(notifications);
        setcounter((unreadCount) => unreadCount + 1);
      });
    }
  }, [socket]);

  const handleRead = async () => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      console.log(decodedToken.userId);
      socket.emit("setSocketId", decodedToken.userId);
      setcounter(0);
      setOpen(false);
      await axios.patch(
        `http://localhost:3000/api/utilisateur/UpdateutilisateurNotif/${decodedToken.userId}`
      );
    }
  };
  ////////////////////////////////////////
  const [userId, setUserId] = useState("");
  const [notifTimer, setNotifTimer] = useState("");
  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");
    if (storedTokenValue && storedTokenValue !== "null") {
      setStoredToken(storedTokenValue);
      const decodedToken = jwtDecode(storedTokenValue);
      setUserId(decodedToken.userId);

      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/utilisateur/getuser",
            {
              params: {
                userId: decodedToken.userId,
              },
            }
          );
          setNotifTimer(response.data[0].schedulNotif);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      const executeCronTask = async () => {
        try {
          await axios.get(
            "http://localhost:3000/api/utilisateur/rappelrepetition",
            {
              params: {
                userId: userId,
              },
            }
          );
          console.log("Cron task executed successfully");
        } catch (error) {
          console.error("Error executing cron task:", error);
        }
      };

      const interval = setInterval(() => {
        fetchData();
      }, 3000); // Fetch data every 30 seconds

      const checkCronTask = () => {
        const now = new Date();
        const notifDate = new Date(notifTimer);
        console.log("tt", notifDate);
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const notifHours = notifDate.getHours();
        const notifMinutes = notifDate.getMinutes();
        console.log("hhh", notifHours, "mmm", notifMinutes);
        console.log("nhhh", hours, "nmmm", minutes);
        console.log(notifDate);
        if (notifHours === hours && notifMinutes === minutes) {
          executeCronTask();
        }
      };

      const cronCheckInterval = setInterval(checkCronTask, 60000); // Check cron task every 30 seconds

      return () => {
        clearInterval(interval);
        clearInterval(cronCheckInterval);
      };
    }
  }, [userId, notifTimer]);
  const handleSeeMore = async () => {
    setcount(count + 5);
  };
  const handleSeeLess = async () => {
    setcount(count - 5);
  };
  return (
    <div
      style={{ width: "8cm", margin: 0 }}
      className="layout-page position-relative"
    >
      {/* Navbar */}
      <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <a
            className="nav-item nav-link px-0 me-xl-4"
            href="javascript:void(0)"
          >
            <i className="bx bx-menu bx-sm" />
          </a>
        </div>
        <div
          className="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            {/* Place this tag where you want the button to render. */}
            <li className="nav-item lh-1 me-3">
              <div className="icon" onClick={() => setOpen(!open)}>
                <BsBell
                  className="iconImg"
                  style={{ height: "25px", width: "25px" }}
                />
                {counter > 0 && (
                  <div className="counter badge bg-danger">{counter}</div>
                )}
              </div>
              {open && (
                <div className="notifications dropdown-menu dropdown-menu-end show">
                  {notifications
                    .slice()
                    .reverse()
                    .slice(0, count)
                    .map((notification) => (
                      <span
                        key={notification.id}
                        className={`dropdown-item ${
                          !notification.read ? "bg-dark text-white" : ""
                        }`}
                        style={{ margin: "2%" }}
                      >
                        {notification.notification}
                      </span>
                    ))}
                  <button
                    className="dropdown-item text-center"
                    onClick={handleRead}
                  >
                    Mark as read
                  </button>
                  <button
                    className="dropdown-item text-center"
                    onClick={handleSeeMore}
                  >
                    See more
                  </button>
                  <button
                    className="dropdown-item text-center"
                    onClick={handleSeeLess}
                  >
                    See less
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {/* / Navbar */}
      {/* Content wrapper */}
      <div className="content-wrapper" />
      {/* Content wrapper */}
    </div>
  );
}

export default Notification;
