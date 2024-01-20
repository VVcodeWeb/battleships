import configuration from "config/configuration";
import { USER_ID } from "shared/constants";
import { memo, useEffect, useState } from "react";
import React from "react";

export const UserContext = React.createContext({
  userId: "",
});

const UserIdWrapper = ({ children }: { children: JSX.Element }) => {
  const [userId, setUserId] = useState<string>(
    localStorage.getItem(USER_ID) ?? ""
  );
  useEffect(() => {
    if (!userId) {
      console.log("call");
      fetch(`${configuration.apiUrl}/generate-user-id`)
        .then(async (res) => {
          const newId = (await res.json()).userId;
          localStorage.setItem(USER_ID, newId);
          setUserId(newId);
        })
        .catch((error) => console.error(error));
    }
  }, [userId]);
  return (
    <UserContext.Provider value={{ userId }}>
      {userId ? children : null}
    </UserContext.Provider>
  );
};

export default memo(UserIdWrapper);
