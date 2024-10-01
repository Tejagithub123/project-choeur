//aziz
import React, { useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { Badge, Drawer, Image, List, Space, Typography } from "antd";
import Notification from "../Notification/Notification"; // Ensure this import path is correct

function AppHeader() {
  const [comments, setComments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div
      className="AppHeader"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        background: "#f0f2f5",
      }}
    >
      <Image
        width={100}
        height={70}
        src="https://tse2.mm.bing.net/th/id/OIP.3NWZ9QAQdW-7wUTS210VHQHaEK?rs=1&pid=ImgDetMain"
      />
      <Typography.Title level={2} style={{ margin: "0 2rem" }}>
        <b>CARTHAGE SYMPHONY ORCHESTRA</b>
      </Typography.Title>
      <Space size="large" style={{ marginLeft: "auto" }}>
        <Badge style={{ height: "0.5cm" }}>
          <Notification />
        </Badge>
      </Space>
    </div>
  );
}

export default AppHeader;
