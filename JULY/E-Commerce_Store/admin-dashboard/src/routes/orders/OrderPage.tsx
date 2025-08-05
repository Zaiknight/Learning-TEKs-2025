import * as React from "react"
import { Search, MoreHorizontal } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { OrderApi } from "@/api/orders.api"
import { Select} from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Order = {
  id: number;
  user_id?: number;
  user_email: string;
  status?: string;
  payment_method?: string;
  payment_status?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [isEdit, setIsEdit] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [selectedOrders, setSelectedOrders] = React.useState<number[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  // Form state for editing order
  const [form, setForm] = React.useState({
    status: "",
    payment_status: "",
    payment_method: '',
  })

  React.useEffect(() => {
    loadOrders()
  }, [])

  React.useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  async function loadOrders() {
    setLoading(true)
    try {
      const data = await OrderApi.fetchOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function filterOrders() {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchQuery) ||
          order.user_email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) =>
        statusFilter === "active"
          ? order.status === "completed" || order.status === "active"
          : order.status !== "completed" && order.status !== "active"
      )
    }

    setFilteredOrders(filtered)
  }

  function handleEdit(order: Order) {
    setForm({
      status: order.status || "",
      payment_status: order.payment_status || "",
      payment_method: order.payment_method || "",
    })
    setIsEdit(true)
    setEditingId(order.id)
    setOpen(true)
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isEdit && editingId) {
      await OrderApi.update(editingId, {
        status: form.status,
        payment_status: form.payment_status,
        payment_method: form.payment_method,
      })
      loadOrders()
    }
    setOpen(false)
    setIsEdit(false)
    setEditingId(null)
  }

  function handleDeleteClick(id: number) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (deletingId) {
      setDeleteDialogOpen(false)
      setDeletingId(null)
      loadOrders()
    }
  }

  function handleDialogClose() {
    setOpen(false)
    setIsEdit(false)
    setEditingId(null)
    setForm({
      status: "",
      payment_status: "",
      payment_method: "",
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((o) => o.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    }
  }

  function getStatusBadge(status?: string) {
    if (status === "completed" || status === "active" || status === "Delivered") {
      return (
        <Badge className="bg-green-600 hover:bg-green-700 text-white">
          {status || "Active"}
        </Badge>
      )
    }
    if (status?.toLocaleLowerCase() === "pending" || status?.toLocaleLowerCase() === "in-process") {
      return (
        <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
            Pending
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-600 hover:bg-red-900 text-white">
        {status || "Inactive"}
      </Badge>
    )
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="flex justify-between items-center px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Orders</h1>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 px-4 lg:px-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search Orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                
                </Select>
              </div>

              {/* Table */}
              <div className="px-4 lg:px-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div>Loading...</div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div>No orders found.</div>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Order ID</TableHead>
                          <TableHead>User Email</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Payment Status</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedOrders.includes(order.id)}
                                onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.user_email}</TableCell>
                            <TableCell>{order.payment_method}</TableCell>
                            <TableCell>{order.payment_status}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="text-neutral-300" onClick={() => handleEdit(order)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-neutral-100"
                                    onClick={() => handleDeleteClick(order.id)}>
                                      Details
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

        {/* Edit Order Modal */}
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{"Update Order"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Input name="status" value={form.status} onChange={handleFormChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="payment_status" className="text-sm font-medium">
                  Payment Status
                </label>
                <Input name="payment_status" value={form.payment_status} onChange={handleFormChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="payment_method" className="text-sm font-medium">
                  Payment Method
                </label>
                <Input name="payment_method" value={form.payment_method} onChange={handleFormChange} required className="mt-1" />
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
              <DialogTitle>Delete Order</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this order? This action cannot be undone.</div>
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