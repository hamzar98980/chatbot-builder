import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Spinner } from "react-bootstrap";
import { CornerUpRight, MoreHorizontal } from "react-feather";
import SimpleBar from "simplebar-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessages,
  clearNewMessage,
  getAllMessage,
  handleReceiveMessage,
  readMessages,
} from "../../../redux/reducer/Message";
import moment from "moment";
import Cookies from "js-cookie";
import { handleOnline, handleReadMessages } from "../../../redux/reducer/Chat";
import HkTooltip from "../../../components/@hk-tooltip/HkTooltip";
import { useSocket } from "../../../context/socketContext";

const ChatBody = ({
  newMessage,
  setNewMessage,
  typing,
  setTyping,
  setIsTyping,
  setMessageData,
}) => {
  const socket = useSocket();
  const { currentChat } = useSelector((state) => state.chatReducer);
  const [socketConnected, setSocketConnected] = useState(false);

  const {
    data: messagesList,
    pagination,
    newMessage: messageSocket,
  } = useSelector((state) => state.messageReducer);

  useEffect(() => {
    socket.on("connected", () => setSocketConnected(true));
  }, [socket]);

  // Socket Logic
  useEffect(() => {
    socket.emit("setup", { myId: Cookies.get("refreshToken") });

    socket.on("typing", (data) => {
      if (
        data.user !== Cookies.get("refreshToken") &&
        data.chatId === currentChat._id
      ) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (userId) => {
      if (userId !== Cookies.get("refreshToken")) {
        setIsTyping(false);
      }
    });

    socket.on("online user", (online) => {
      dispatch(handleOnline(online));
    });

    return () => {
      socket.emit("close", Cookies.get("refreshToken"));
    };
  }, [socketConnected]);

  useEffect(() => {
    socket.emit("join chat", currentChat._id, Cookies.get("refreshToken"));

    setTyping(false);
    setIsTyping(false);
  }, [currentChat, socketConnected]);

  useEffect(() => {
    socket.on("message received", (message) => {
      if (message?.chat?._id === currentChat._id) {
        dispatch(handleReceiveMessage({ ...message, sendByMe: false }));
        socket.emit("read message", {
          chatId: currentChat._id,
          userId: Cookies.get("refreshToken"),
        });
      } else {
        setMessageData(message?.sender?.first_name + " sent a message");
      }
    });
  }, [currentChat]);

  useEffect(() => {
    if (messageSocket) {
      socket.emit("new message", messageSocket);
    }
    dispatch(clearNewMessage());
  }, [messageSocket]);

  useEffect(() => {
    if (!socketConnected) {
      console.log("socket not connected");
      return;
    }

    if (typing) {
      setTyping(true);
      socket.emit("typing", {
        chatId: currentChat._id,
        userId: Cookies.get("refreshToken"),
      });
    }

    setTimeout(() => {
      socket.emit("stop typing", {
        chatId: currentChat._id,
        userId: Cookies.get("refreshToken"),
      });
      setTyping(false);
    }, 5000);
  }, [typing, socketConnected]);

  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [goToBottom, setGoToBottom] = useState(true);
  // 👇️ scroll to bottom every time messages change
  const bottomRef = useRef(null);
  const topRef = useRef(null);
  let currentDate = null; // Initialize currentDate to keep track of date changes

  useEffect(() => {
    setPageNo(1);
    setGoToBottom(true);
    dispatch(clearMessages());
  }, [currentChat]);

  useEffect(() => {
    if (currentChat?._id) {
      dispatch(
        getAllMessage({
          chatId: currentChat._id,
          pageNo,
        })
      );

      socket.emit("read message", {
        chatId: currentChat._id,
        userId: Cookies.get("refreshToken"),
      });

      socket.on("read message", (data) => {
        if (
          data.chatId === currentChat._id &&
          data.userId !== Cookies.get("refreshToken")
        ) {
          dispatch(readMessages({ chatId: data.chatId }));
          dispatch(handleReadMessages({ _id: data.chatId }));
        }
      });

      setIsLoading(false);
    }
  }, [currentChat, pageNo]);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;

    if (scrollTop === 0 && pagination?.hasNextPage) {
      setIsLoading(true);
      setTimeout(() => {
        setPageNo(pageNo + 1);
      }, 2000);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
      setGoToBottom(false);
    }

    if (newMessage) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
      setNewMessage(false);
    }
  }, [messagesList, newMessage]);

  return (
    <SimpleBar
      style={{ height: "100%" }}
      id="chat_body"
      className="chat-body"
      onScrollCapture={handleScroll}
    >
      <ul
        id="dummy_avatar"
        className="list-unstyled chat-single-list"
        ref={topRef}
      >
        {isLoading && (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {messagesList?.map((message, index) => {
          const messageDate = moment(message.createdAt);
          let dateLine = null;

          if (!currentDate || !messageDate.isSame(currentDate, "day")) {
            // If currentDate is not set or messageDate is different, display date line
            if (messageDate.isSame(moment(), "day")) {
              dateLine = "Today";
            } else if (
              messageDate.isSame(moment().subtract(1, "days"), "day")
            ) {
              dateLine = "Yesterday";
            } else {
              dateLine = messageDate.format("MMM D, YYYY"); // Display full date
            }
            currentDate = messageDate; // Update currentDate
          }

          return (
            <div key={index}>
              {dateLine && (
                <li className="day-sep">
                  <span>{dateLine}</span>
                </li>
              )}
              {message.sendByMe ? (
                <li className="media sent">
                  <div className="media-body">
                    <div className="msg-box">
                      <div>
                        <p>{message?.content}</p>
                        <div className="d-flex align-items-center gap-1">
                          <span className="chat-time">
                            {moment(message?.createdAt).format("hh:mm A")}
                          </span>
                          {!message?.isRead ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon icon-tabler icon-tabler-check"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              stroke-width="2.5"
                              stroke="#c0c0c0"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M5 12l5 5l10 -10" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon icon-tabler icon-tabler-checks"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              stroke-width="2.5"
                              stroke="#ffffff"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M7 12l5 5l10 -10" />
                              <path d="M2 12l5 5m5 -5l5 -5" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="msg-action">
                        <Button className="btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret">
                          <span className="icon">
                            <span className="feather-icon">
                              <CornerUpRight />
                            </span>
                          </span>
                        </Button>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="flush-dark"
                            className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                          >
                            <span className="icon">
                              <span className="feather-icon">
                                <MoreHorizontal />
                              </span>
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item href="#forward">
                              Forward
                            </Dropdown.Item>
                            <Dropdown.Item href="#copy">Copy</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="media received">
                  {currentChat.isGroupChat && (
                    <div className="avatar avatar-xs avatar-rounded me-3">
                      <div className="avatar avatar-sm avatar-primary avatar-rounded">
                        <HkTooltip
                          placement="top"
                          title={message?.sender?.first_name[0]}
                        >
                          <span className="initial-wrap">
                            {message?.sender?.first_name[0]}
                          </span>
                        </HkTooltip>
                      </div>
                    </div>
                  )}
                  <div className="media-body">
                    <div className="msg-box">
                      <div>
                        <p>{message?.content}</p>
                        <span className="chat-time">
                          {moment(message?.createdAt).format("hh:mm A")}
                        </span>
                      </div>
                      <div className="msg-action">
                        <Button className="btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret">
                          <span className="icon">
                            <span className="feather-icon">
                              <CornerUpRight />
                            </span>
                          </span>
                        </Button>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="flush-dark"
                            className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                          >
                            <span className="icon">
                              <span className="feather-icon">
                                <MoreHorizontal />
                              </span>
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item href="#forward">
                              Forward
                            </Dropdown.Item>
                            <Dropdown.Item href="#copy">Copy</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </div>
          );
        })}
      </ul>

      <div ref={bottomRef} />
    </SimpleBar>
  );
};

export default ChatBody;
