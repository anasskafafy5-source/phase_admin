import { useState } from 'react'
import Button from '../../ui/Button.jsx'
import Modal from '../../ui/Modal.jsx'
import Spinner from '../../ui/Spinner.jsx'
import AccountForm from './AccountForm.jsx'
import AddUserModal from './AddUserModal.jsx'
import { useSignup } from './useSignup.js'
import { useUpdateAccount } from './useUpdateAccount.js'
import useUser from './useUser.js'

function AccountsContainer() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const { isLoading, user } = useUser()
  const { isPending, updateAccount } = useUpdateAccount()
  const { isPending: isAddingUser, signup } = useSignup({ onSuccess: () => setIsAddUserOpen(false) })

  function handleAddUser({ email, name, password }) {
    signup({ email, fullName: name, password })
  }

  if (isLoading) return <Spinner label="Loading account" />
  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddUserOpen(true)}>Add user</Button>
      </div>
      <AccountForm user={user} isPending={isPending} onSubmit={updateAccount} />
      <Modal isOpen={isAddUserOpen} isPending={isAddingUser} onClose={() => setIsAddUserOpen(false)}>
        <AddUserModal isPending={isAddingUser} onSubmit={handleAddUser} />
      </Modal>
    </div>
  )
}

export default AccountsContainer
