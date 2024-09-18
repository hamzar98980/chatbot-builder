import * as Icons from "tabler-icons-react";

export const SidebarMenu = [
  // {
  //     group: '',
  //     contents: [
  //         {
  //             name: 'Dashboard',
  //             icon: <Icons.Template />,
  //             path: '/dashboard',
  //             badge: <HkBadge size="sm" bg="pink" soft className="ms-auto" >hot</HkBadge>
  //         },
  //     ]
  // },
  {
    group: "Apps",
    contents: [
      {
        id: "dash_chat",
        name: "Chat",
        icon: <Icons.MessageDots />,
        path: "/apps/chat",
        childrens: [
          {
            name: "Chats",
            path: "/apps/chat/chats",
            grp_name: "apps",
          },
          {
            name: "Groups",
            path: "/apps/chat/chat-groups",
            grp_name: "apps",
          },
          {
            name: "Contacts",
            path: "/apps/chat/chat-contact",
            grp_name: "apps",
          },
        ],
      },
    ],
  },
];
