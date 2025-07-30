import * as React from "react"
import { Search, MoreHorizontal, Plus } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CategoryAPI } from "@/api/categories.api"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Category = {
  id: number
  name: string
  description: string
  active: boolean
  image: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [isEdit, setIsEdit] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  //file object or string (for File input)
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    active: true,
    image: "" as File | string,
  })

  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  React.useEffect(() => {
    loadCategories()
  }, [])

  React.useEffect(() => {
    filterCategories()
  }, [categories, searchQuery, statusFilter])

  async function loadCategories() {
    setLoading(true)
    try {
      const data = await CategoryAPI.fetchCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function filterCategories() {
    let filtered = categories

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((category) => {
        if (statusFilter === "active") return category.active
        if (statusFilter === "inactive") return !category.active
        return true
      })
    }

    setFilteredCategories(filtered)
  }

  function handleOpen() {
    setForm({
      name: "",
      description: "",
      active: true,
      image: "",
    })
    setIsEdit(false)
    setEditingId(null)
    setOpen(true)
  }

  function handleEdit(category: Category) {
    setForm({
      name: category.name,
      description: category.description,
      active: category.active,
      image: "", // Always clear on edit
    })
    setIsEdit(true)
    setEditingId(category.id)
    setOpen(true)
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type, checked, files } = e.target as any
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let fileToSend = typeof form.image === "string" ? undefined : form.image

    if (isEdit && editingId) {
      if (fileToSend) {
        // If editing and uploading new image, handle as create (FormData)
        await CategoryAPI.createCategory({
          name: form.name,
          description: form.description,
          active: form.active,
          img_name: fileToSend,
        })
      } else {
        // If editing and no new image, just update info
        await CategoryAPI.updateCategory(editingId, {
          name: form.name,
          description: form.description,
          active: form.active,
        })
      }
    } else {
      if (fileToSend) {
        await CategoryAPI.createCategory({
          name: form.name,
          description: form.description,
          active: form.active,
          img_name: fileToSend,
        })
      } else {
        // Should not happen, but for safety:
        await CategoryAPI.createCategory({
          name: form.name,
          description: form.description,
          active: form.active,
          img_name: "" as any,
        })
      }
    }

    setOpen(false)
    setIsEdit(false)
    setEditingId(null)
    loadCategories()
  }

  function handleDeleteClick(id: number) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (deletingId) {
      setDeleteDialogOpen(false)
      await CategoryAPI.deleteCategory(deletingId)
      setDeletingId(null)
    }
    loadCategories()
  }

  function handleDialogClose() {
    setOpen(false)
    setIsEdit(false)
    setEditingId(null)
    setForm({
      name: "",
      description: "",
      active: true,
      image: "",
    })
  }

  function getStatusBadge(active: boolean) {
    return active ? (
      <Badge className="bg-green-600 hover:bg-green-700 text-white">Active</Badge>
    ) : (
      <Badge className="bg-red-600 hover:bg-red-700 text-white">Inactive</Badge>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(filteredCategories.map((c) => c.id))
    } else {
      setSelectedCategories([])
    }
  }

  const handleSelectCategory = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  // Helper: build image URL from filename or show placeholder
  function getCategoryImageUrl(img: string) {
    if (!img) return "/placeholder.svg?height=40&width=40"
  const filename = img.startsWith("/productUploads/") ? img.replace("/productUploads/", "") : img
    return `http://localhost:5000/upload/${filename}`
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="flex justify-between items-center px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button onClick={handleOpen}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 px-4 lg:px-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="px-4 lg:px-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div>Loading...</div>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div>No categories found.</div>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedCategories.length === filteredCategories.length}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Category Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={(checked) => handleSelectCategory(category.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={getCategoryImageUrl(category.image)}
                                  alt={category.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate text-gray-600">{category.description}</div>
                            </TableCell>
                            <TableCell>{getStatusBadge(category.active)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteClick(category.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Category Modal */}
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input name="name" value={form.name} onChange={handleFormChange} required className="mt-1" />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.active}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
                  name="active"
                  id="active"
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div>
                <label htmlFor="image" className="text-sm font-medium">
                  Image
                </label>
                <Input name="image" type="file" accept="image/*" onChange={handleFormChange} className="mt-1" />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this category? This action cannot be undone.</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="destructive" type="button" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}