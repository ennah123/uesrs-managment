import { CreateUserModal } from "@/components/ui/AddUser"
import { UserTableClient } from "@/components/UserTable"

type User = {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

async function getUsers(): Promise<User[]> {
  const res = await fetch('http://localhost:3000/api/users', {
    next: { tags: ['users'] }
  })
  
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export default async function Home() {
  const users = await getUsers()

  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Users</h1>
          <CreateUserModal />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <UserTableClient initialUsers={users} />
        </div>
      </div>
    </div>
  )
}