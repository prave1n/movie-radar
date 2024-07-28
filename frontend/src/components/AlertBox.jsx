import React from 'react'
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar"


function AlertBox(msg, variant) {

    const [popup, setPopUp] = React.useState({
        show: false,
        vertical: "top",
        horizontal: "right",
      });
      const {vertical, horizontal } = popup;
    
      const popupAlert = () => {
        setPopUp({
          show: true,
          vertical: "top",
          horizontal: "right",
        });
      };
    
      const popupAlertClose = () => {
        setPopUp({
          show: false,
          vertical: "top",
          horizontal: "right",
        });
      };
    
      const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert severity="error" elevation={6} ref={ref} variant="filled" {...props} />;
      });
    
  return (
    <Snackbar
          open={popup.show}
          autoHideDuration={6000}
          onClose={popupAlertClose}
          anchorOrigin={{ vertical, horizontal }}
        >
        <Alert
          onClose={popupAlertClose}
          severity={variant}
          sx={{ width: "100%" }}
        >
          
          {msg}
        </Alert>
      </Snackbar>
  )
}

export default AlertBox