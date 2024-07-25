import React from "react";
import NavBar from "./NavBar";
import UserList from "./UserList";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendList";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import ActivityList from './ActivityList'

export default function FriendsPage() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <NavBar />
      
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <TabContext value={value}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Friends" value="1"/>
            <Tab label="Friend's Activity List" value="2"/>
            <Tab label="Friend Requests" value="3"/>
            <Tab label="Search for Users" value="4"/>
          </Tabs>
          <TabPanel value="1"> <FriendsList/> </TabPanel>
          <TabPanel value="2"><ActivityList/> </TabPanel>
          <TabPanel value="3"><FriendRequests/> </TabPanel>
          <TabPanel value="4"> <UserList/></TabPanel>
        </TabContext>
      </Box>
      
        
       
    </div>
  );
}

/*
 <div>
          <UserList />
        </div>
        <div>
          <FriendRequests />
        </div>
        <div>
          <FriendsList />
        </div>
      </div>
*/