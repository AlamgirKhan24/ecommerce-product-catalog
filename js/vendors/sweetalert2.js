// ---------------------------------------------
// SweetAlert2 — confirmation dialogs
// Requires the SweetAlert2 UMD bundle + CSS loaded globally before this runs
// Styled to match the site's rounded, low-contrast aesthetic
// ---------------------------------------------

function getSwal() {
  return typeof window.Swal !== 'undefined' ? window.Swal : null;
}

const baseStyle = {
  buttonsStyling: false,
  customClass: {
    popup: 'swal-popup',
    confirmButton: 'btn btn-secondary',
    cancelButton: 'btn btn-outline',
  },
};

/**
 * Generic confirmation dialog. Returns a Promise<boolean> — true if confirmed.
 * Usage: const ok = await confirmDialog({ title: 'Remove item?', text: '...' });
 */
export async function confirmDialog({
  title = 'Are you sure?',
  text = '',
  confirmText = 'Yes, confirm',
  cancelText = 'Cancel',
  icon = 'warning',
} = {}) {
  const Swal = getSwal();
  if (!Swal) return window.confirm(title); // graceful fallback if lib fails to load

  const result = await Swal.fire({
    ...baseStyle,
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });

  return result.isConfirmed;
}

/** Shortcut for "remove item from cart/wishlist" confirmations */
export function confirmRemoveItem(itemName = 'this item') {
  return confirmDialog({
    title: 'Remove item?',
    text: `${itemName} will be removed.`,
    confirmText: 'Remove',
    icon: 'warning',
  });
}

/** Shortcut for "clear entire cart/wishlist" confirmations */
export function confirmClearAll(label = 'cart') {
  return confirmDialog({
    title: `Clear your ${label}?`,
    text: 'This action can\u2019t be undone.',
    confirmText: `Yes, clear ${label}`,
    icon: 'warning',
  });
}

/** Simple success dialog (e.g. order placed) */
export function showSuccessDialog({ title = 'Success!', text = '' } = {}) {
  const Swal = getSwal();
  if (!Swal) return window.alert(title);

  return Swal.fire({
    ...baseStyle,
    title,
    text,
    icon: 'success',
    confirmButtonText: 'Great',
    customClass: { ...baseStyle.customClass, confirmButton: 'btn btn-primary' },
  });
}