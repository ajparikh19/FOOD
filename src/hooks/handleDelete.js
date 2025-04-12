import { confirmAction } from "../components/utils/confirmAction";
import API from "../http/api";
import { toast } from "react-toastify";


const handleDelete = async (id, endpoint, setEntityList) => {
    const deleteEntity = async () => {
        try {
            // Make the DELETE request to the API for the given endpoint
            const response = await API.delete(`${endpoint}/${id}`);

            if (response.status === 200) {
                // Update the entity list in state after deletion
                setEntityList((prevEntities) => prevEntities.filter((entity) => entity.id !== id));

                // Notify success using React Toastify
                toast.success(`${endpoint} deleted successfully.`);
            } else {
                // Notify failure using React Toastify
                toast.error(`Failed to delete ${endpoint}.`);
            }
        } catch (err) {
            console.error("Error during deletion:", err);

            // Notify error using React Toastify
            toast.error(`There was an error deleting ${endpoint}.`);
        }
    };

    // Use confirmAction to show the confirmation dialog
    confirmAction({ id }, deleteEntity);
};

export default handleDelete;
