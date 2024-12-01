import Swal from 'sweetalert2';
export const showToastNotification = (type: 'success' | 'error', message: string) => {
    const color = type === 'success' ? 'success' : 'danger';

    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
        customClass: {
            popup: `color-${color}`,
        },
    });

    toast.fire({
        title: message,
    });
};
