import React from "react";
import { useSelector } from "react-redux";
import FriendCard from "./FriendCard";
import { Typography} from "@mui/material";
import Box from '@mui/material/Box';
import WarningIcon from '@mui/icons-material/Warning';

function FriendList() {
  const friendList = useSelector((state) => state.user.friendList);
  let count = friendList.length === 0 ?
  
  <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 165, 0, 0.1)', // Light orange background
        padding: 2,
        borderRadius: 1,
        m:2,
        border: '1px solid rgba(255, 165, 0, 0.5)', // Border color
      }}
    >
      <WarningIcon sx={{ color: 'orange', mr: 1 }} />
      <Typography variant="body1" sx={{ color: 'orange', fontWeight: 'bold' }}>
       Currently you have no friends
      </Typography>
    </Box>
  
  
  : <></>;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3">Friends</Typography>
      <div
        style={{
          display: "flex",
          maxWidth: "1500px"
        }}
      >
        {friendList.map((user) => {
          return <FriendCard userId={user} />;
        })}
        {count}
      </div>
    </div>
  );
}

export default FriendList;
