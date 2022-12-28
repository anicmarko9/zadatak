import { AxiosError } from "axios";
import { toast } from "react-toastify";

const catchError = (error: AxiosError): void => {
  if (error.code === "ERR_NETWORK")
    toast.error(error.message, {
      position: "bottom-left",
    });
  else
    toast.error(error.response.data["message"], {
      position: "bottom-left",
    });
};

export default catchError;
