import React from 'react'
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {  popupClose } from '../store/popupSlice';

export default function AlertBox() {
  const {show, vertical, horizontal, variant, message } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert severity="error" elevation={6} ref={ref} variant="filled" {...props} />;
  });
    
  const closeHandler = () => {
    dispatch(popupClose())
  }
  return (
    <Snackbar
          open={show}
          autoHideDuration={6000}
          onClose={closeHandler}
          anchorOrigin={{ vertical, horizontal }}
        >
        <Alert
          onClose={closeHandler}
          severity={variant}
          sx={{ width: "100%" }}
        >
          
          {message}
        </Alert>
      </Snackbar>
  )
}

