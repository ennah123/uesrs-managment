"use client"
import { useState } from 'react'
import { DeleteUserModal } from "./ui/DeleteUser"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { EditUserModal } from "./ui/UpdateUser"

type User = {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface UserTableClientProps {
  initialUsers: User[]
}

export function UserTableClient({ initialUsers }: UserTableClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = initialUsers.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(initialUsers.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="lg:col-span-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date Registered</TableHead>
            <TableHead className="text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((user) => ( 
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
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
      <br />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
                onClick={handlePrevious}
                />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                <PaginationLink 
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                >
                    {i + 1}
                </PaginationLink>
                </PaginationItem>
            ))}
            
            <PaginationItem>
                <PaginationNext 
                onClick={handleNext}
                />
            </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}