"use client"

import {
	FiUpload,
	FiEdit2,
	FiShare2,
	FiEye,
	FiDownload,
} from "react-icons/fi"
import Image from "next/image"

export default function TopBar() {
	return (
		<div className="flex flex-col px-6 py-4 bg-white border-b p-4">
			<div className="ml-6 flex items-center gap-2 justify-end mb-5">
				<div className=" flex flex-col items-end">
					<span className="text-sm font-bold text-black">
						Omar Hassan Osman
					</span>
					<span className="text-sm font-medium text-gray-700">
						(General User)
					</span>
				</div>
				<Image
					src="/avatar.jpg"
					alt="User Avatar"
					width={42}
					height={42}
					className="rounded-full"
				/>
			</div>
			<div className="flex items-baseline gap-4 text-gray-600 justify-between">
				<h1 className="text-2xl font-semibold text-gray-800">
					Digital Archiving System
				</h1>
        <div className=" flex gap-3">
        <FiUpload className="cursor-pointer hover:text-violet-600" />
				<FiEdit2 className="cursor-pointer hover:text-violet-600" />
				<FiShare2 className="cursor-pointer hover:text-violet-600" />
				<FiEye className="cursor-pointer hover:text-violet-600" />
				<FiDownload className="cursor-pointer hover:text-violet-600" />
        </div>
			
			</div>
		</div>
	)
}
