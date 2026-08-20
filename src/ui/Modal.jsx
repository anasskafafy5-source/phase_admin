import { cloneElement } from 'react'
import { createPortal } from 'react-dom'

function Modal({ children, isOpen, isPending = false, onClose }) {
  if (!isOpen) return null

  function handleClose(event) {
    if (isPending && event) return
    onClose()
  }

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-2xl"
      >
        {cloneElement(children, { onClose: handleClose })}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
