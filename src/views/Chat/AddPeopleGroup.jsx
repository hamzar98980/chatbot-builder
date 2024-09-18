import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import SimpleBar from "simplebar-react";
//Images
import avatar2 from "../../assets/dist/img/avatar2.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/reducer/Users";
import {
  NewChat,
  getAllConv,
  handleCurrentChat,
} from "../../redux/reducer/Chat";
import axios from "axios";
import Cookies from "js-cookie";
import { clearMessages } from "../../redux/reducer/Message";

const AddPeopleGroup = ({ show, onClose }) => {
  const dispatch = useDispatch();

  const [Search, setSearch] = useState("");

  const { data } = useSelector((state) => state.usersReducer);

  const { currentChat } = useSelector((state) => state.chatReducer);

  useEffect(() => {
    dispatch(
      getUsers({
        search: Search,
      })
    );
  }, [dispatch, Search]);

  useEffect(() => {
    setMemberList(data);
  }, [data]);

  const handleNewChat = (user) => {
    const a = dispatch(
      NewChat({
        userId: user._id,
      })
    ).then((res) => {
      dispatch(
        getAllConv({
          search: Search,
        })
      );

      dispatch(
        handleCurrentChat({
          currentChat: res.payload.data,
        })
      );

      dispatch(clearMessages());
    });

    onClose();
  };

  const [memberList, setMemberList] = useState(data);
  const [group, setGroup] = useState(true);
  const [groupName, setGroupName] = useState("");

  const handleGroup = (newId) => {
    const list = memberList.map((user) => {
      if (user._id === newId._id) {
        return {
          ...user,
          inGroup: !user.inGroup,
        };
      }
      return user;
    });

    setMemberList(list);
  };

  const handleCreateGroup = async () => {
    const newMembers = memberList.filter((user) => user.inGroup);
    const members = newMembers.map((user) => user._id);

    await axios
      .post("http://localhost:3001/api/v1/users/add-member", {
        chatId: currentChat._id,
        myId: Cookies.get("refreshToken"),
        userIds: members,
      })
      .then((res) => {
        dispatch(
          getAllConv({
            search: Search,
          })
        );
      });

    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered dialogClassName="mw-400p">
      <Modal.Header className="header-wth-bg-inv">
        <Modal.Title as="h5">Invite People</Modal.Title>
        <Button bsPrefix="btn-close" className="text-white" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </Button>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Form className="m-3" role="search">
          <Form.Control
            type="text"
            className="rounded-input user-search"
            placeholder="Search People"
            value={Search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <>
            <Button
              className="btn btn-primary btn-block mt-3"
              type="button"
              onClick={() => handleCreateGroup()}
            >
              Add to Group
            </Button>
          </>
        </Form>
        <div className="h-350p">
          <SimpleBar style={{ height: "100%" }} className="nicescroll-bar">
            <ul className="invite-user-list">
              {memberList?.map((user) => (
                <li
                  key={user._id}
                  onClick={() => {
                    !group && handleNewChat(user);
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="media d-flex align-items-center">
                    {group && (
                      <div className="ms-auto">
                        <Form.Check
                          value={user.inGroup}
                          onChange={(e) => handleGroup(user)}
                        />
                      </div>
                    )}
                    <div className={`media-head ${group ? "mx-3" : "me-3"}`}>
                      <div className="avatar avatar-sm avatar-rounded">
                        <img
                          src={user?.image}
                          alt="user"
                          className="avatar-img"
                        />
                      </div>
                    </div>
                    <div className="media-body">
                      <div className="user-name">
                        {user?.first_name + " " + user?.last_name}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </SimpleBar>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddPeopleGroup;
