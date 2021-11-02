import { toast, ToastPosition } from "react-toastify";

const toastOptions = {
    ERROR: {
        position: 'top-left' as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    },
    SUCCESS: {
        position: 'top-left' as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    }
}

export class Toaster {
    public static readonly error = (msg: string) => toast.error(msg, toastOptions.ERROR)
    public static readonly success = (msg: string) => toast.success(msg, toastOptions.SUCCESS) 
}

export default toastOptions;