import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, Nav, Tab } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Briefcase, Mail, MapPin, MoreVertical, Phone } from "react-feather";
import {
  faDropbox,
  faFacebook,
  faGithub,
  faGoogle,
  faGoogleDrive,
} from "@fortawesome/free-brands-svg-icons";
//Redux

//Images
import avatar1 from "../../../assets/dist/img/avatar1.jpg";
import avatar2 from "../../../assets/dist/img/avatar2.jpg";
import thumbImg from "../../../assets/dist/img/img-thumb1.jpg";
import HkTooltip from "../../../components/@hk-tooltip/HkTooltip";
import { useDispatch, useSelector } from "react-redux";
import { mutualGroups } from "../../../redux/reducer/Message";
import Cookies from "js-cookie";
import { handleCurrentChat } from "../../../redux/reducer/Chat";

const ChatInfo = ({ infoToggle, avatar, userName, addToGroup }) => {
  const { currentChat } = useSelector((state) => state.chatReducer);

  const { mutualGroupsList } = useSelector((state) => state.messageReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    const userId = currentChat.members.find(
      (member) => member._id === Cookies.get("refreshToken")
    )._id;

    const myId = Cookies.get("refreshToken");

    dispatch(
      mutualGroups({
        userId,
        myId,
      })
    );
  }, [currentChat]);

  return (
    <div className="chat-info">
      <SimpleBar style={{ height: "100%" }} className="nicescroll-bar">
        <Button
          bsPrefix="btn-close"
          className="info-close"
          onClick={infoToggle}
        >
          <span aria-hidden="true">×</span>
        </Button>
        <div className="text-center">
          {typeof avatar === "string" && (
            <div className="avatar avatar-xxl avatar-rounded">
              <img src={avatar} alt="user" className="avatar-img" />
            </div>
          )}
          {typeof avatar === "object" && (
            <div
              className={`avatar avatar-${avatar.variant} avatar-rounded avatar-xxl`}
            >
              <span className="initial-wrap">{avatar.title}</span>
            </div>
          )}
          <div className="cp-name text-truncate mt-2">{userName}</div>
          <p className="text-truncate">No phone calls Always busy</p>
        </div>
        <Tab.Container defaultActiveKey="info">
          <Nav
            justify
            className="nav-light nav-tabs nav-segmented-tabs active-theme mt-4"
          >
            <Nav.Item>
              <Nav.Link eventKey="info">
                <span className="nav-link-text">Info</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="files">
                <span className="nav-link-text">Files</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="mt-4">
            <Tab.Pane eventKey="info">
              <Form role="search">
                <Form.Control
                  type="text"
                  placeholder="Search in conversation"
                />
              </Form>
              <div className="collapse-simple mt-3">
                {currentChat?.isGroupChat ? (
                  <>
                    <p className="fw-medium">Group Admin</p>
                    <div className="avatar avatar-sm avatar-primary avatar-rounded mt-3">
                      <HkTooltip
                        placement="top"
                        title={currentChat?.admin?.first_name}
                      >
                        <span className="initial-wrap">
                          {currentChat?.admin?.first_name[0]}
                        </span>
                      </HkTooltip>
                    </div>
                  </>
                ) : (
                  <>
                    {mutualGroupsList && mutualGroupsList.length > 0 && (
                      <>
                        <p className="fw-medium">Mutual Groups</p>
                        {mutualGroupsList.map((group, index) => (
                          <div
                            className="avatar avatar-sm avatar-primary avatar-rounded mt-3"
                            key={index}
                            onClick={() => {
                              dispatch(
                                handleCurrentChat({
                                  _id: group?._id,
                                  name: group?.chatName,
                                  image:
                                    group?.groupImage ||
                                    "https://random.imagecdn.app/500/500",
                                  isGroupChat: group?.isGroupChat,
                                  members: group?.users,
                                  unreadMessages: group?.unreadMessages,
                                })
                              );
                            }}
                          >
                            <HkTooltip placement="top" title={group?.chatName}>
                              <span className="initial-wrap">
                                {group?.chatName[0]}
                              </span>
                            </HkTooltip>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                {currentChat?.isGroupChat && (
                  <Card>
                    <Card.Header>
                      <Link
                        role="button"
                        data-bs-toggle="collapse"
                        to="#members"
                        aria-expanded="true"
                      >
                        Members
                      </Link>
                    </Card.Header>

                    <div id="members" className="collapse show">
                      <Card.Body>
                        <ul className="hk-list">
                          {currentChat?.members?.map((member, index) => (
                            <li key={index}>
                              <div className="avatar avatar-sm avatar-primary avatar-rounded">
                                <HkTooltip
                                  placement="top"
                                  title={member?.first_name}
                                >
                                  <span className="initial-wrap">
                                    {member?.first_name[0]}
                                  </span>
                                </HkTooltip>
                              </div>
                            </li>
                          ))}

                          <li onClick={() => addToGroup()}>
                            <div className="avatar avatar-sm avatar-primary avatar-rounded">
                              <HkTooltip placement="top" title="Morgan">
                                <span className="initial-wrap">
                                  <i className="ri-add-line" />
                                </span>
                              </HkTooltip>
                            </div>
                          </li>
                        </ul>
                      </Card.Body>
                    </div>
                  </Card>
                )}
                <Card>
                  <Card.Header>
                    <Link
                      role="button"
                      data-bs-toggle="collapse"
                      to="#gn_info"
                      aria-expanded="true"
                    >
                      General Info
                    </Link>
                  </Card.Header>
                  <div id="gn_info" className="collapse show">
                    <Card.Body>
                      <ul className="cp-info">
                        <li>
                          <Link to="#">
                            <span className="cp-icon-wrap">
                              <span className="feather-icon">
                                <Briefcase />
                              </span>
                            </span>
                            Co-Founder
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <span className="cp-icon-wrap">
                              <span className="feather-icon">
                                <Mail />
                              </span>
                            </span>
                            <span className="text-primary">
                              contact@hencework.com
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <span className="cp-icon-wrap">
                              <span className="feather-icon">
                                <Phone />
                              </span>
                            </span>
                            +91-25-4125-2365
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <span className="cp-icon-wrap">
                              <span className="feather-icon">
                                <MapPin />
                              </span>
                            </span>
                            Oslo, Canada
                          </Link>
                        </li>
                      </ul>
                    </Card.Body>
                  </div>
                </Card>
                <Card>
                  <Card.Header>
                    <Link
                      role="button"
                      data-bs-toggle="collapse"
                      to="#social_profile"
                      aria-expanded="true"
                    >
                      Social Profile{" "}
                    </Link>
                  </Card.Header>
                  <div id="social_profile" className="collapse show">
                    <Card.Body>
                      <ul className="hk-list hk-list-sm">
                        <li>
                          <Button
                            variant="primary"
                            className="btn-icon btn-rounded"
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faFacebook} />
                            </span>
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="warning"
                            className="btn-icon btn-rounded"
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faGoogleDrive} />
                            </span>
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="info"
                            className="btn-icon btn-rounded"
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faDropbox} />
                            </span>
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="dark"
                            className="btn-icon btn-rounded"
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faGithub} />
                            </span>
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="danger"
                            className="btn-icon btn-rounded"
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faGoogle} />
                            </span>
                          </Button>
                        </li>
                      </ul>
                    </Card.Body>
                  </div>
                </Card>
                <Card>
                  <Card.Header>
                    <Link
                      role="button"
                      data-bs-toggle="collapse"
                      to="#biography"
                      aria-expanded="true"
                    >
                      Biography{" "}
                    </Link>
                  </Card.Header>
                  <div id="biography" className="collapse show">
                    <Card.Body>
                      <p>
                        Hello there, Huma Therman is a brilliant co-founder and
                        a copy writer working for almost a decade for fortune
                        500 companies. I am well verse with multiple foreign
                        languages and I love to produce good quality stuff.{" "}
                      </p>
                    </Card.Body>
                  </div>
                </Card>
                <Card>
                  <Card.Header>
                    <Link
                      role="button"
                      data-bs-toggle="collapse"
                      to="#settings"
                      aria-expanded="true"
                    >
                      Settings{" "}
                    </Link>
                  </Card.Header>
                  <div id="settings" className="collapse show">
                    <Card.Body>
                      <ul className="cp-action">
                        <li>
                          <Link to="#">Clear Chat</Link>
                        </li>
                        <li>
                          <Link to="#">
                            <span className="text-danger">Block Contact</span>
                          </Link>
                        </li>
                        <li>
                          <Link to="#">Somthing's Wrong</Link>
                        </li>
                      </ul>
                      <Link to="#" className="d-block text-dark fs-7 mb-10">
                        Give feedback and report conversation
                      </Link>
                    </Card.Body>
                  </div>
                </Card>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="files">
              <Form role="search">
                <Form.Control
                  type="text"
                  className="search-files"
                  placeholder="Search files"
                />
              </Form>
              <div className="collapse-simple mt-3">
                <Card>
                  <Card.Header>
                    <Link
                      role="button"
                      data-bs-toggle="collapse"
                      to="#files_collapse"
                      aria-expanded="true"
                    >
                      Yesterday
                    </Link>
                  </Card.Header>
                  <div id="files_collapse" className="collapse show">
                    <Card.Body>
                      <ul className="cp-files">
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-icon avatar-sm avatar-soft-blue">
                                <span className="initial-wrap fs-3">
                                  <i className="ri-file-excel-2-fill" />
                                </span>
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">website_content.exl</p>
                                <p className="file-size">2,635 KB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-icon avatar-sm avatar-soft-light">
                                <span className="initial-wrap fs-3">
                                  <i className="ri-file-text-fill" />
                                </span>
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">jampack.pdf</p>
                                <p className="file-size">1.3 GB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-icon avatar-sm avatar-soft-warning">
                                <span className="initial-wrap fs-3">
                                  <i className="ri-file-zip-fill" />
                                </span>
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">
                                  themeforest-pack.zip
                                </p>
                                <p className="file-size">2.45 GB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-logo avatar-sm">
                                <span className="initial-wrap">
                                  <img src={avatar1} alt="user" />
                                </span>
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">
                                  bruce-mars-fiEG-Pk6ZASFPk6ZASF
                                </p>
                                <p className="file-size">4,178 KB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-logo avatar-sm">
                                <span className="initial-wrap">
                                  <img src={avatar2} alt="user" />
                                </span>
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">
                                  jonas-kakaroto-KIPqvvTKIPqvvT
                                </p>
                                <p className="file-size">951 KB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </Card.Body>
                  </div>
                </Card>
                <Card>
                  <Card.Header>
                    <Link
                      role="button"
                      data-bs-toggle="collapse"
                      to="#files_collapse_1"
                      aria-expanded="true"
                    >
                      23 April
                    </Link>
                  </Card.Header>
                  <div id="files_collapse_1" className="collapse show">
                    <Card.Body>
                      <ul className="cp-files">
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-icon avatar-sm avatar-soft-light">
                                <span className="initial-wrap fs-3">
                                  <i className="ri-keynote-fill" />
                                </span>
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">
                                  presentation.keynote
                                </p>
                                <p className="file-size">20 KB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-icon avatar-sm avatar-soft-warning">
                                <span className="initial-wrap fs-3">
                                  <i className="ri-file-zip-fill" />
                                </span>
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">PACK-TRIAL.zip</p>
                                <p className="file-size">2.45 GB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="media">
                            <div className="media-head">
                              <div className="avatar avatar-sm">
                                <img
                                  src={thumbImg}
                                  alt="user"
                                  className="avatar-img"
                                />
                              </div>
                            </div>
                            <div className="media-body">
                              <div>
                                <p className="file-name">
                                  joel-mott-LaK153ghdigaghdi
                                </p>
                                <p className="file-size">3,028 KB</p>
                              </div>
                              <div>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="flush-dark"
                                    size="sm"
                                    className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                  >
                                    <span className="icon">
                                      <span className="feather-icon">
                                        <MoreVertical />
                                      </span>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                    <Dropdown.Item className="link-danger">
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </Card.Body>
                  </div>
                </Card>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </SimpleBar>
    </div>
  );
};

export default ChatInfo;
