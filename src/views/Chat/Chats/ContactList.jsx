import React, { useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import * as Icons from "react-feather";
import { Dropdown, Form, ListGroup } from "react-bootstrap";
import { useWindowWidth } from "@react-hook/window-size";
//Redux
//Images
import { useDispatch, useSelector } from "react-redux";
import {
  getAllConv,
  handleCurrentChat,
  handleLastMessage,
  handleUnreadMessages,
} from "../../../redux/reducer/Chat";
import moment from "moment";
import Cookies from "js-cookie";
import { clearMessages } from "../../../redux/reducer/Message";
import { useSocket } from "../../../context/socketContext";

const ContactList = ({ invitePeople }) => {
  const socket = useSocket();

  const [activeUser, setActiveUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const width = useWindowWidth();

  const dispatch = useDispatch();

  const { data: list, currentChat } = useSelector((state) => state.chatReducer);

  useEffect(() => {
    dispatch(
      getAllConv({
        search: searchValue,
      })
    );
  }, [dispatch]);

  const Conversation = (index) => {
    dispatch(
      handleCurrentChat({
        _id: index?._id,
        name: index?.chatName,
        image: index?.groupImage,
        isGroupChat: index?.isGroupChat,
        members: index?.users,
        admin: index?.groupAdmin,
      })
    );

    dispatch(clearMessages());
  };

  useEffect(() => {
    dispatch(
      getAllConv({
        search: "",
      })
    );
  }, [searchValue]);

  useEffect(() => {
    setActiveUser(currentChat?._id);
  }, [currentChat]);

  return (
    <>
      <div className="chatapp-aside">
        <header className="aside-header">
          <Dropdown>
            <Dropdown.Toggle
              as="a"
              className="chatapp-title link-dark"
              href="#"
            >
              <h1>Chat</h1>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="chats.html">
                <span className="feather-icon dropdown-icon">
                  <Icons.MessageSquare />
                </span>
                <span>Chats</span>
              </Dropdown.Item>
              <Dropdown.Item href="chats-contact.html">
                <span className="feather-icon dropdown-icon">
                  <Icons.Book />
                </span>
                <span>Contacts</span>
              </Dropdown.Item>
              <Dropdown.Item href="chats-group.html">
                <span className="feather-icon dropdown-icon">
                  <Icons.User />
                </span>
                <span>Groups</span>
              </Dropdown.Item>
              <Dropdown.Item href="#some">
                <span className="feather-icon dropdown-icon">
                  <Icons.Archive />
                </span>
                <span>Archived</span>
              </Dropdown.Item>
              <Dropdown.Item href="#some">
                <span className="feather-icon dropdown-icon">
                  <Icons.Star />
                </span>
                <span>Favorites</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="d-flex">
            <Dropdown>
              <Dropdown.Toggle
                as="a"
                href="#"
                className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret me-1"
              >
                <span className="icon">
                  <span className="feather-icon">
                    <Icons.Settings />
                  </span>
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item href="#some">
                  <span className="feather-icon dropdown-icon">
                    <Icons.UserCheck />
                  </span>
                  <span>Active Contacts</span>
                </Dropdown.Item>
                <Dropdown.Item href="#some">
                  <span className="feather-icon dropdown-icon">
                    <Icons.MessageSquare />
                  </span>
                  <span>Chat Requests</span>
                </Dropdown.Item>
                <Dropdown.Item href="#some">
                  <span className="feather-icon dropdown-icon">
                    <Icons.Archive />
                  </span>
                  <span>Archived Chats</span>
                </Dropdown.Item>
                <Dropdown.Item href="#some">
                  <span className="feather-icon dropdown-icon">
                    <Icons.ToggleRight />
                  </span>
                  <span>Unread Chats</span>
                </Dropdown.Item>
                <Dropdown.Divider as="div" />
                <Dropdown.Item href="#some">Settings</Dropdown.Item>
                <Dropdown.Item href="#some">Help</Dropdown.Item>
                <Dropdown.Item href="#some">Report a problem </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Link
              to="#"
              className="btn btn-icon btn-rounded btn-primary"
              onClick={invitePeople}
            >
              <span className="icon">
                <span className="feather-icon">
                  <Icons.Plus />
                </span>
              </span>
            </Link>
          </div>
        </header>

        <SimpleBar style={{ height: "100%" }} className="aside-body">
          <Form className="aside-search" role="search">
            <Form.Control
              type="text"
              placeholder="Search Chats"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Form>

          <ListGroup variant="flush" className="chat-contacts-list">
            {list?.map((elem, index) => (
              <ListGroup.Item onClick={() => Conversation(elem)} key={index}>
                <div
                  className={classNames(
                    "media",
                    { "active-user": elem._id === activeUser },
                    { "read-chat": !elem.unreadMessages }
                  )}
                >
                  <div className="media-head">
                    {elem?.groupImage && (
                      <div className="avatar avatar-sm avatar-rounded position-relative">
                        <img
                          src={elem?.groupImage}
                          alt="user"
                          className="avatar-img"
                        />
                        {elem.status === "active" && (
                          <span className="badge badge-success badge-indicator badge-indicator-lg position-bottom-end-overflow-1" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="media-body">
                    <div>
                      <div className="user-name">{elem?.chatName}</div>
                      <div className="user-last-chat">
                        {elem?.lastMessage?.content}
                      </div>
                    </div>
                    <div>
                      <div className="last-chat-time">
                        {elem?.updatedAt &&
                          moment(elem?.updatedAt).format("hh:mm A")}
                      </div>
                      {elem.unreadMessages > 0 && (
                        <div className="badge badge-primary badge-sm badge-pill">
                          {elem.unreadMessages}
                        </div>
                      )}
                      <div className="dropdown action-drp">
                        <a
                          href="#some"
                          className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret"
                          data-bs-toggle="dropdown"
                        >
                          <span className="icon">
                            <span className="feather-icon">
                              <i data-feather="more-horizontal" />
                            </span>
                          </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#some">
                            Mute Chat
                          </a>
                          <a className="dropdown-item" href="#some">
                            Archive Chat
                          </a>
                          <a className="dropdown-item" href="#some">
                            Delete Chat
                          </a>
                          <a className="dropdown-item link-danger" href="#some">
                            Block
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </SimpleBar>
      </div>
    </>
  );
};

export default ContactList;
