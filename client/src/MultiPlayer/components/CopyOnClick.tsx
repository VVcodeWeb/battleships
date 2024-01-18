import { Tooltip, Typography } from "@mui/material";
import useStyles from "hooks/useStyle";

const CopyOnClick = ({ text }: { text: string }) => {
  const styles = useStyles();
  const onClick = () => navigator.clipboard.writeText(text);
  return (
    <Tooltip title="Copy to the clipboard" placement="top">
      <Typography
        onClick={onClick}
        style={{
          cursor: "copy",
          textAlign: "center",
          width: "60%",
          margin: "0 auto",
          background: styles.mainColor,
          padding: 5,
          borderRadius: 15,
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default CopyOnClick;
