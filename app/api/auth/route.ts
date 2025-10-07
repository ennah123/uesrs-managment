import { verifyPassword } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import { generateToken } from "@/lib/token";
import User from "@/models/User";


export async function POST(req: Request){
    try {
    await dbConnect()

    const data = await req.json()

    if (!data.email || !data.password) {
      return Response.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      )
    }

    const user:any = await User.findOne({email: data.email})
    if (!user) return Response.json(
        { success: false, message: "invalid data" },
        { status: 400 }
    )

    const correctPassword = await verifyPassword(data.password, user.password)
    if(!correctPassword) return Response.json(
        { success: false, message: "invalid email or password" },
        { status: 400 }
    )

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    })
    return Response.json(
        { success: true, message: "Logged in successfully", token },
        { status: 200 }
    )
    
  } catch (err: any) {
    console.error("Error creating user:", err)
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}