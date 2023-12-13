import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.min.css";
import routes from "./routes";
import PrivateRoute from "./routes/private-route";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authSlice, { setCurrentUserInfo } from "./redux/slices/authSlice";
import { userInfoSelector } from "./redux/selector";
import { loadSemesters } from "./redux/slices/semesterSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //callAPI lấy thông tin user khi refresh
  const refreshPage = () => {
    if (localStorage.getItem("access_token")) {
      dispatch(setCurrentUserInfo());
    } else {
      dispatch(authSlice.actions.logout());
      // message.warn("Vui lòng đăng nhập để tiếp tục");
      // navigate("/signin");
    }
  };

  useEffect(() => {
    window.addEventListener("storage", () => {
      if (!localStorage.getItem("access_token")) {
        dispatch(authSlice.actions.logout());
        navigate("/signin");
      } else {
        dispatch(setCurrentUserInfo());
      }
    });
    refreshPage();
  }, []);

  const userInfo = useSelector(userInfoSelector);

  useEffect(() => {
    if (userInfo && !userInfo.roles.includes("ROOT_ADMIN")) {
      dispatch(loadSemesters(userInfo.campus_id));
    }
  }, [userInfo]);

  return (
    <Routes>
      {routes.map((route, index) => {
        const Element = route.element;
        const roleTargets = route.roleTargets;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <PrivateRoute roleTargets={roleTargets}>
                <Element />
              </PrivateRoute>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
