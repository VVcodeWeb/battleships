import React, { memo } from "react";

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <>{children}</>;
};

export default memo(Wrapper);
