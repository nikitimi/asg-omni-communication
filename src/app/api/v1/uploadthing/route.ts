import { NextResponse, type NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("No user signed in.");
    }

    const { id } = user;

    const utapi = new UTApi();
    const formdata = await req.formData();
    const files = formdata.getAll("files");

    const isFilesEmpty = files[0] instanceof File && files[0].size === 0;
    let uploadedFiles: Record<string, string | undefined>[] = [];
    if (isFilesEmpty) {
      console.error(`User ID[${id}] uploaded nothing.`);
    } else {
      console.log(`User ID[${id}] uploaded ${files.length} files`);
      const response = await utapi.uploadFiles(files as File[]);
      uploadedFiles = response.map(({ data }) => ({
        key: data?.key,
        url: data?.url,
      }));
    }
    return NextResponse.json({
      success: true,
      message: uploadedFiles,
    });
  } catch (err) {
    console.error(`Error in /api/v1/uploadthing: ${(err as Error).message}`);
    return NextResponse.json(
      {
        success: false,
        message: err,
      },
      { status: 400 }
    );
  }
}
