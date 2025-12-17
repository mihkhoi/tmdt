import React from "react";
import { Snackbar, Alert, AlertColor, Slide, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";

interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  duration?: number;
  onClose: () => void;
  action?: React.ReactNode;
}

function SlideTransition(
  props: TransitionProps & { children: React.ReactElement }
) {
  return <Slide {...props} direction="up" />;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  open,
  message,
  severity = "info",
  duration = 4000,
  onClose,
  action,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        "& .MuiSnackbarContent-root": {
          borderRadius: 2,
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          "& .MuiAlert-icon": {
            fontSize: 24,
          },
          "& .MuiAlert-message": {
            fontSize: "0.95rem",
            fontWeight: 500,
          },
        }}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={onClose}
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
