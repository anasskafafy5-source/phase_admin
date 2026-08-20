import Button from './Button.jsx'
import Modal from './Modal.jsx'

function ConfirmDialog({ confirmLabel = 'Confirm', isOpen, isPending, message, onClose, onConfirm, title }) {
  return (
    <Modal isOpen={isOpen} isPending={isPending} onClose={onClose}>
      <ConfirmMessage
        confirmLabel={confirmLabel}
        isPending={isPending}
        message={message}
        onConfirm={onConfirm}
        title={title}
      />
    </Modal>
  )
}

function ConfirmMessage({ confirmLabel, isPending, message, onClose, onConfirm, title }) {
  return (
    <div className="space-y-5 p-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{message}</p>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" disabled={isPending} onClick={onClose}>Cancel</Button>
        <Button disabled={isPending} onClick={onConfirm}>{isPending ? 'Deleting...' : confirmLabel}</Button>
      </div>
    </div>
  )
}

export default ConfirmDialog
