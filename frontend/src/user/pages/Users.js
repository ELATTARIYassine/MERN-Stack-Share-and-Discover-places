import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "1",
      name: "Yassine",
      image:
        "https://cdn.fastly.picmonkey.com/contentful/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=800&q=70",
      places: 3,
    },
    {
      id: "2",
      name: "Ahmed",
      image:
        "https://img-cdn.tid.al/o/4858a4b2723b7d0c7d05584ff57701f7b0c54ce3.jpg",
      places: 1,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
