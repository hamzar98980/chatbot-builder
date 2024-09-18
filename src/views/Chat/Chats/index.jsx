import React, { useEffect, useState } from "react";
import ContactList from "./ContactList";
import ChatBody from "./ChatBody";
import ChatInfo from "./ChatInfo";
import ChatFooter from "../ChatFooter";
import classNames from "classnames";
import InvitePeopleModal from "../InvitePeopleModal";
import ChatHeader from "../ChatHeader";
import { useWindowWidth } from "@react-hook/window-size";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPeopleGroup from "../AddPeopleGroup";
import { useSocket } from "../../../context/socketContext";
import {
  getAllConv,
  handleLastMessage,
  handleUnreadMessages,
} from "../../../redux/reducer/Chat";
import Cookies from "js-cookie";

const Chats = ({}) => {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");

      socket.emit("setup", { myId: Cookies.get("refreshToken") });
    });

    socket.on("chat created", () => {
      dispatch(
        getAllConv({
          search: "",
        })
      );
    });

    socket.on("message received", (message) => {
      console.log("message received", message);
      if (
        message?.sender?._id !== Cookies.get("refreshToken") &&
        message?.chat?._id !== currentChat?._id
      ) {
        dispatch(
          handleUnreadMessages({
            _id: message?.chat?._id,
          })
        );
      }

      dispatch(
        handleLastMessage({
          chatId: message?.chat?._id,
          content: message?.content,
          createdAt: new Date().toISOString(),
        })
      );
    });
  }, [socket]);

  const [showInfo, setShowInfo] = useState(true);
  const [invitePeople, setInvitePeople] = useState(false);
  const [addToGroup, setAddToGroup] = useState(false);

  const windowWidth = useWindowWidth();
  useEffect(() => {
    if (windowWidth <= 1199) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  }, [windowWidth]);

  const { currentChat } = useSelector((state) => state.chatReducer);

  const [newMessage, setNewMessage] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    if (messageData != null) {
      toast.success(messageData, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setMessageData(null);
      }, 5000);
    }
  }, [messageData]);

  return (
    <div className="hk-pg-body py-0">
      <ToastContainer />
      <div
        className={classNames("chatapp-wrap", {
          "chatapp-info-active": showInfo,
        })}
      >
        <div className="chatapp-content">
          <ContactList invitePeople={() => setInvitePeople(!invitePeople)} />
          {currentChat == null ? (
            <div className=""></div>
          ) : (
            <div className="chatapp-single-chat">
              <ChatHeader
                infoState={showInfo}
                infoToggle={() => setShowInfo(!showInfo)}
                invitePeople={() => setInvitePeople(!invitePeople)}
                isTyping={isTyping}
              />
              <ChatBody
                setNewMessage={setNewMessage}
                newMessage={newMessage}
                typing={typing}
                setTyping={setTyping}
                isTyping={isTyping}
                setIsTyping={setIsTyping}
                setMessageData={setMessageData}
              />
              <ChatFooter setNewMessage={setNewMessage} setTyping={setTyping} />
              <ChatInfo
                infoToggle={() => setShowInfo(!showInfo)}
                addToGroup={() => setAddToGroup(!addToGroup)}
              />
            </div>
          )}
          {/* Invite People */}
          <InvitePeopleModal
            show={invitePeople}
            onClose={() => setInvitePeople(!invitePeople)}
          />

          <AddPeopleGroup
            show={addToGroup}
            onClose={() => setAddToGroup(!addToGroup)}
          />
        </div>
      </div>
    </div>
  );
};

export default Chats;
