import API from "../http/api";
import { toast } from "react-toastify";

const toggleStatus = async ({
    id,
    currentStatus,
    moduleName,
    columnName = "status",
    entityList,
    setEntityList,
    endpoint = "statusChangeAction",
    successMessage = "Status updated successfully",
    errorMessage = "Error updating status",
}) => {
    const newStatus = currentStatus === "1" ? "0" : "1"; // Toggle status

    const payload = {
        module_name: moduleName,
        id: id,
        column_names: columnName,
        status: newStatus,
    };

    try {
        // Optimistically update the status in the frontend
        const updatedEntities = entityList.map((entity) =>
            entity.id === id
                ? { ...entity, [columnName]: newStatus } // Update only the status column
                : entity
        );

        setEntityList(updatedEntities); // Update the state

        const response = await API.post(endpoint, payload); // Send the API request
        const { message, status } = response; // Destructure message and status from response

        if (status !== 200) {
            throw new Error(message || "Unexpected API response status.");
        }

        // Notify success using React Toastify
        toast.success(successMessage);

        // Return the updated entities if needed elsewhere
        return updatedEntities;

    } catch (error) {
        console.error("Error updating status:", error);

        // Rollback the optimistic update on error
        const revertedEntities = entityList.map((entity) =>
            entity.id === id
                ? { ...entity, [columnName]: currentStatus } // Revert to previous status
                : entity
        );

        setEntityList(revertedEntities);

        // Notify error using React Toastify
        toast.error(`${errorMessage}: ${error.message}`);
    }
};

export default toggleStatus;
