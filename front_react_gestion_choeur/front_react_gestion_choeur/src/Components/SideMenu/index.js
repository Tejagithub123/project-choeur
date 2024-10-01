import {
  AppstoreOutlined,
  FolderAddOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Badge, Drawer, Image, List, Space, Typography } from "antd";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Nominations from "../Nominations/Nominations";

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          //item.key
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          <Image width={100} height={20}></Image>,

          {
            label: "Home\n",

            icon: <AppstoreOutlined />,
            key: "/home",
            className: "nnn",
          },

          {
            label: "Candidats",
            key: "/inventory",
            icon: <UserOutlined />,
            className: "nnn",
          },

          {
            label: "Auditions",
            key: "/AjoutE",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "Nominations",
            key: "/Nominations",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "Planification Auditions",
            key: "/PlanificationAuditions",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "Consulter Planification",
            key: "/ConsultPlanificationAuditions",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "RepetitionsQR",
            key: "/RepetitionsQR",
            icon: <PlusOutlined />,
            className: "nnn",
          },
          {
            label: "ConcertsQR",
            key: "/ConcertsQR",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "tache3",
            key: "/tache3",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "tache32",
            key: "/tache32",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "tache33",
            key: "/tache33",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "tache22",
            key: "/tache22",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          {
            label: "tache30",
            key: "/tache30",
            icon: <PlusOutlined />,
            className: "nnn",
          },

          <Image width={100} height={20}></Image>,
          {
            label: "Logout",
            key: "/",
            icon: <LogoutOutlined />,
            className: "nnn",
          },
        ]}
      ></Menu>
    </div>
  );
}
export default SideMenu;
