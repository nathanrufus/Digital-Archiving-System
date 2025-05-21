"use client"

import {
	useEffect,
	useState,
} from "react"
import axios from "axios"
import {
	FiCheckCircle,
	FiAlertCircle,
	FiSmartphone,
	FiTablet,
	FiMonitor,
	FiDownload,
	FiInfo,
	FiEdit,
	FiTrash,
} from "react-icons/fi"
import toast from "react-hot-toast"

interface DocumentItem {
	_id: string;     
	name: string
	size: number
	status: string
	device?: string
	tags?: string[]
}

const formatBytes = (bytes: number) => {
	if (bytes === 0) return "0 Bytes"
	const k = 1024
	const sizes = [
		"Bytes",
		"KB",
		"MB",
		"GB",
	]
	const i = Math.floor(
		Math.log(bytes) / Math.log(k)
	)
	return (
		parseFloat(
			(bytes / Math.pow(k, i)).toFixed(2)
		) +
		" " +
		sizes[i]
	)
}

const tagColor = (tag: string) => {
	switch (tag) {
		case "media":
			return "bg-orange-100 text-orange-600"
		case "document":
			return "bg-blue-100 text-blue-600"
		case "illustration":
			return "bg-purple-100 text-purple-600"
		case "mail":
			return "bg-green-100 text-green-600"
		case "audio":
			return "bg-indigo-100 text-indigo-600"
		default:
			return "bg-gray-100 text-gray-600"
	}
}

export default function RetrieveDocumentsPage() {
	const [documents, setDocuments] =
		useState<DocumentItem[]>([])
	const [
		showEditModal,
		setShowEditModal,
	] = useState(false)
	const [selectedDoc, setSelectedDoc] =
		useState<DocumentItem | null>(null)
	const [editFields, setEditFields] =
		useState({
			tags: "",
			device: "",
			status: "",
		})

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const token =
					localStorage.getItem("token")

				const res = await axios.get(
					"/api/documents",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)

				setDocuments(res.data)
			} catch (err) {
				console.error(
					"Failed to load documents:",
					err
				)
				toast.error(
					"Failed to load documents."
				)
			}
		}

		fetchDocuments()
	}, [])

	const handleDownload = (
		docId: string
	) => {
		const token =
			localStorage.getItem("token")
		window.open(
			`/api/documents/download/${docId}?token=${token}`,
			"_blank"
		)
	}

	const handleInfo = (
		doc: DocumentItem
	) => {
		toast.custom(() => (
			<div className="bg-white p-4 rounded shadow-md border text-sm">
				<p>
					<strong>File:</strong> {doc.name}
				</p>
				<p>
					<strong>Size:</strong>{" "}
					{formatBytes(doc.size)}
				</p>
				<p>
					<strong>Status:</strong>{" "}
					{doc.status}
				</p>
				<p>
					<strong>Device:</strong>{" "}
					{doc.device}
				</p>
			</div>
		))
	}
	const handleEdit = (
		doc: DocumentItem
	) => {
		setSelectedDoc(doc)
		setEditFields({
			tags: doc.tags?.join(", ") || "",
			device: doc.device || "",
			status: doc.status || "",
		})
		setShowEditModal(true)
	}
	const handleSaveEdit = async () => {
		if (!selectedDoc) return;
		try {
		  const token = localStorage.getItem("token");
		  await axios.patch(
			`/api/documents/${selectedDoc._id}`, // ✅ use _id
			{
			  tags: editFields.tags.split(",").map((t) => t.trim()),
			  device: editFields.device,
			  status: editFields.status,
			},
			{
			  headers: {
				Authorization: `Bearer ${token}`,
			  },
			}
		  );
	  
		  toast.success("Document updated");
		  setDocuments((prev) =>
			prev.map((doc) =>
			  doc._id === selectedDoc._id
				? {
					...doc,
					...editFields,
					tags: editFields.tags.split(",").map((t) => t.trim()),
				  }
				: doc
			)
		  );
		  setShowEditModal(false);
		} catch (err) {
		  toast.error("Failed to update document");
		  console.error(err);
		}
	  };
	  
	const handleDelete = async (docId: string) => {
		if (!confirm(`Are you sure you want to delete this document?`)) return;
	  
		try {
		  const token = localStorage.getItem("token");
		  await axios.delete(`/api/documents/${docId}`, {
			headers: {
			  Authorization: `Bearer ${token}`,
			},
		  });
		  toast.success("File deleted");
		  setDocuments((prev) => prev.filter((doc) => doc._id !== docId));
		} catch (err) {
		  toast.error("Failed to delete file");
		  console.error(err);
		}
	  };
	  

	return (
		<div className="p-6">
			<div className="mb-6">
				<input
					type="text"
					placeholder="Search Documents"
					className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>
			</div>

			<div className="bg-white rounded-xl shadow p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="text-yellow-500 text-3xl">
						📁
					</div>
					<div>
						<p className="text-lg font-semibold">
							Retrieve Documents
						</p>
						<p className="text-sm text-gray-500">
							Last Manage: 22 hours ago
						</p>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-sm text-left">
						<thead>
							<tr className="border-b text-gray-600">
								<th className="py-2 pr-4">
									File
								</th>
								<th className="py-2 pr-4">
									Size
								</th>
								<th className="py-2 pr-4">
									Status
								</th>
								<th className="py-2 pr-4">
									Devices
								</th>
								<th className="py-2 pr-4">
									Tags
								</th>
								<th className="py-2 pr-4">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{documents.map((docRaw, idx) => {
								const doc = {
									...docRaw,
									tags: docRaw.tags || [],
								}
								return (
									<tr
										key={idx}
										className="border-b last:border-none"
									>
										<td className="py-2 pr-4 text-gray-800">
											{doc.name}
										</td>
										<td className="py-2 pr-4 text-gray-600">
											{formatBytes(doc.size)}
										</td>
										<td className="py-2 pr-4">
											{doc.status === "done" ? (
												<FiCheckCircle className="text-green-500" />
											) : (
												<FiAlertCircle className="text-yellow-500" />
											)}
										</td>
										<td className="py-2 pr-4 text-center text-gray-500">
											{doc.device === "mobile" && (
												<FiSmartphone className="inline-block" />
											)}
											{doc.device === "tablet" && (
												<FiTablet className="inline-block" />
											)}
											{doc.device ===
												"desktop" && (
												<FiMonitor className="inline-block" />
											)}
										</td>

										<td className="py-2 pr-4 flex gap-2 flex-wrap">
											{doc.tags.map(
												(tag, tIdx) => (
													<span
														key={tIdx}
														className={`px-2 py-1 rounded-full text-xs font-medium ${tagColor(
															tag
														)}`}
													>
														#{tag}
													</span>
												)
											)}
										</td>
										<td className="py-2 pr-4 text-right">
											<div className="flex justify-end gap-3 text-purple-600">
												<FiDownload
													className="cursor-pointer hover:text-purple-800"
													onClick={() =>
														handleDownload(doc.name)
													}
												/>
												<FiInfo
													className="cursor-pointer hover:text-purple-800"
													onClick={() =>
														handleInfo(doc)
													}
												/>

												<FiEdit
													className="cursor-pointer hover:text-purple-800"
													onClick={() =>
														handleEdit(doc)
													}
												/>

												<FiTrash
													className="cursor-pointer hover:text-red-600"
													onClick={() => handleDelete(doc._id)} 
												/>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
					{showEditModal && selectedDoc && (
						<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
							<div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
								<h2 className="text-lg font-semibold mb-4">
									Edit Document
								</h2>

								<div className="mb-3">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Tags (comma-separated)
									</label>
									<input
										type="text"
										className="w-full border p-2 rounded"
										value={editFields.tags}
										onChange={(e) =>
											setEditFields({
												...editFields,
												tags: e.target.value,
											})
										}
									/>
								</div>

								<div className="mb-3">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Device
									</label>
									<select
										className="w-full border p-2 rounded"
										value={editFields.device}
										onChange={(e) =>
											setEditFields({
												...editFields,
												device: e.target.value,
											})
										}
									>
										<option value="">
											Select...
										</option>
										<option value="mobile">
											Mobile
										</option>
										<option value="tablet">
											Tablet
										</option>
										<option value="desktop">
											Desktop
										</option>
									</select>
								</div>

								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Status
									</label>
									<select
										className="w-full border p-2 rounded"
										value={editFields.status}
										onChange={(e) =>
											setEditFields({
												...editFields,
												status: e.target.value,
											})
										}
									>
										<option value="">
											Select...
										</option>
										<option value="done">
											Done
										</option>
										<option value="processing">
											Processing
										</option>
									</select>
								</div>

								<div className="flex justify-end gap-2">
									<button
										className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
										onClick={() =>
											setShowEditModal(false)
										}
									>
										Cancel
									</button>
									<button
										className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
										onClick={handleSaveEdit}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
