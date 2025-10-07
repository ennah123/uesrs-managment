import { CreateUserModal } from "@/components/ui/AddUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteUserModal } from "@/components/ui/DeleteUser";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditUserModal } from "@/components/ui/UpdateUser";



type User = {
  _id: string
  name: string
  email: string
  role: string
  createdAt: String
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
          
          {/* Table */}
          <div className="lg:col-span-2">
            <Table>
              <TableCaption>A list of all registered users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Regeistered</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => ( 
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-gray-100 text-gray-800' 
                          : user.role === 'moderator'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.createdAt.slice(0,10)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <EditUserModal user={user} />
                        <DeleteUserModal user={user} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}