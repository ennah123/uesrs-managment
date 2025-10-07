'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Trash2 } from 'lucide-react'

type User = {
  _id: string
  name: string
  email: string
  role: string
}

interface DeleteUserModalProps {
  user: User
}

export function DeleteUserModal({ user }: DeleteUserModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/users?id=${user._id}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (result.success) {
          router.refresh()
          setOpen(false)
          resolve(result)
        } else {
          reject(new Error(result.message || 'Error deleting user'))
        }
      } catch (error) {
        reject(error)
      } finally {
        setLoading(false)
      }
    })

    toast.promise(promise, {
      loading: 'Deleting user...',
      success: () => {
        return 'User deleted successfully!'
      },
      error: (error) => {
        return error.message || 'Failed to delete user'
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">Role: {user.role}</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}