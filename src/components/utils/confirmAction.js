import { confirmAlert } from "react-confirm-alert"; // Import confirmAlert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import styles for the confirm alert

export const confirmAction = (data, apiFunctionCall) => {
    confirmAlert({
        title: "Confirm Action",
        message: "Are you sure about this?",
        buttons: [
            {
                label: "Yes",
                onClick: () => apiFunctionCall(data),
            },
            {
                label: "No",
            },
        ],
    });
};
