import { hashPassword } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await dbConnect()
    const users = await User.find()
    const response = Response.json(users)
    
    return response
  } catch (err: any) {
    console.error("Error fetching users:", err)
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect()

    const data = await req.json()

    if (!data.name || !data.email || !data.role || !data.password) {
      return Response.json(
        { success: false, message: "Name, email, role and password are required" },
        { status: 400 }
      )
    }

    const hashed = await hashPassword(data.password)

    const user = await User.create({
      name: data.name,
      email: data.email,
      role: data.role,
      password: hashed,
    })

    revalidateTag('users')

    return Response.json({ success: true, user })
  } catch (err: any) {
    console.error("Error creating user:", err)
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect()

    const data = await req.json()

    if (!data._id || !data.name || !data.email || !data.role) {
      return Response.json(
        { success: false, message: "User ID, name, email, and role are required" },
        { status: 400 }
      )
    }

    const existingUser = await User.findById(data._id)
    if (!existingUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
    }

    if (data.password) {
      updateData.password = await hashPassword(data.password)
    }

    const user = await User.findByIdAndUpdate(
      data._id,
      updateData,
      { new: true } 
    )

    revalidateTag('users')

    return Response.json({ 
      success: true, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err: any) {
    console.error("Error updating user:", err)
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    const existingUser = await User.findById(id)
    if (!existingUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    await User.findByIdAndDelete(id)

    revalidateTag('users')

    return Response.json({ 
      success: true, 
      message: "User deleted successfully" 
    })
  } catch (err: any) {
    console.error("Error deleting user:", err)
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}