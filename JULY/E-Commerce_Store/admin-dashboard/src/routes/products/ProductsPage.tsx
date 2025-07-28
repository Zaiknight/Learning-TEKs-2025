import * as React from "react";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ProductAPI } from "@/api/products.api";
import { CategoryAPI } from "@/api/categories.api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Product = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  active: boolean;
  image: string;
  price: number;
  stock: number;
};

type Category = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  image: string;
};

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [priceFilter, setPriceFilter] = React.useState<string>("all");

  const [form, setForm] = React.useState({
    category_id: 0,
    name: "",
    description: "",
    image: "" as File | string,
    price: 0,
    stock: 0 as number,
  });

  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Category modal state
  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
  const [categoryForm, setCategoryForm] = React.useState({
    name: "",
    description: "",
    active: true,
    image: "" as File | string,
  });

  React.useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  React.useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, priceFilter]);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await ProductAPI.fetchProduct();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await CategoryAPI.fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  function filterProducts() {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category_id === Number.parseInt(categoryFilter)
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter((product) => {
        if (priceFilter === "0-100") return product.price >= 0 && product.price <= 1000;
        if (priceFilter === "100-500") return product.price > 1000 && product.price <= 5000;
        if (priceFilter === "500000+") return product.price > 5000;
        return true;
      });
    }

    setFilteredProducts(filtered);
  }

  function handleOpen() {
    setForm({
      category_id: categories[0]?.id || 0,
      name: "",
      description: "",
      image: "",
      price: 0,
      stock: 0,
    });
    setIsEdit(false);
    setEditingId(null);
    setOpen(true);
  }

  function handleEdit(product: Product) {
    setForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description,
      image: "",
      price: product.price,
      stock: product.stock,
    });
    setIsEdit(true);
    setEditingId(product.id);
    setOpen(true);
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type, checked, files } = e.target as any;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else if (name === "price") {
      setForm((prev) => ({ ...prev, price: Number(value) }));
    } else if (name === "stock") {
      setForm((prev) => ({ ...prev, stock: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleCategorySelect(value: string) {
    if (value === "create-new-category") {
      setCategoryModalOpen(true);
    } else {
      setForm((prev) => ({ ...prev, category_id: Number(value) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isEdit && editingId) {
      // For updating, handle file upload if needed
      let imageFileName = form.image;
      if (form.image && typeof form.image !== "string") {
        // If a new file is selected, upload first
        const uploadData = new FormData();
        uploadData.append("image", form.image);
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: uploadData,
        });
        const json = await res.json();
        imageFileName = json.filename;
      }
      await ProductAPI.update(editingId, {
        category_id: form.category_id,
        name: form.name,
        description: form.description,
        img_name: form.image as File,
        price: form.price,
        stock: form.stock,
      });
    } else {
      await ProductAPI.create({
        id: 0,
        category_id: form.category_id,
        name: form.name,
        description: form.description,
        img_name: form.image as File,
        price: form.price,
        stock: form.stock,
      });
    }
    setOpen(false);
    setIsEdit(false);
    setEditingId(null);
    loadProducts();
  }

  function handleDeleteClick(id: number) {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (deletingId) {
      setDeleteDialogOpen(false);
      await ProductAPI.delete(deletingId);
      setDeletingId(null);
      loadProducts();
    }
  }

  function handleDialogClose() {
    setOpen(false);
    setIsEdit(false);
    setEditingId(null);
    setForm({
      category_id: categories[0]?.id || 0,
      name: "",
      description: "",
      image: "",
      price: 0,
      stock: 0,
    });
  }

  function handleCategoryModalClose() {
    setCategoryModalOpen(false);
    setCategoryForm({
      name: "",
      description: "",
      active: true,
      image: "",
    });
  }

  function handleCategoryFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type, checked, files } = e.target as any;
    if (type === "checkbox") {
      setCategoryForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setCategoryForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setCategoryForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();

    let imageFileName = form.image as File;
      if (form.image && typeof form.image !== "string") {
        const uploadData = new FormData();
        uploadData.append("image", form.image);
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: uploadData,
        });
        const json = await res.json();
        imageFileName = json.filename;
      }
    const newCat = await CategoryAPI.createCategory({
      ...categoryForm,
      img_name: imageFileName,
    });

    await loadCategories();
    setCategoryModalOpen(false);
    setCategoryForm({
      name: "",
      description: "",
      active: true,
      image: "",
    });

    if (newCat && newCat.id) {
      setForm((prev) => ({ ...prev, category_id: newCat.id }));
    }
  }

  function getCategoryName(category_id: number) {
    const category = categories.find((cat) => cat.id === category_id);
    return category ? category.name : "";
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

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
                <h1 className="text-2xl font-bold">Products</h1>
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
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-100">Rs.0 - Rs.1000</SelectItem>
                    <SelectItem value="100-500">Rs.1000 - Rs.5000</SelectItem>
                    <SelectItem value="500000+">Rs.5000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="px-4 lg:px-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div>Loading...</div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div>No products found.</div>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                selectedProducts.length === filteredProducts.length &&
                                filteredProducts.length > 0
                              }
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={(checked) =>
                                  handleSelectProduct(product.id, checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      product.image
                                        ? product.image.startsWith("/productUploads/")
                                          ? `http://localhost:5000/upload/${product.image.replace("/productUploads/", "")}`
                                          : `http://localhost:5000/upload/${product.image}`
                                        : "/placeholder.svg?height=40&width=40"
                                    }
                                    alt={product.name}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                  </div>
                                </div>
                              </TableCell>
                            <TableCell className="font-medium">
                              Rs.{product.price.toFixed(2)}
                            </TableCell>
                            <TableCell>{getCategoryName(product.category_id)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(product)}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteClick(product.id)}
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

        {/* Add/Edit Product Modal */}
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category_id" className="text-sm font-medium">
                  Category
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Select
                    value={form.category_id ? String(form.category_id) : ""}
                    onValueChange={handleCategorySelect}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="create-new-category">+ Create new category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="mt-1"
                />
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

              <div>
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleFormChange}
                  required
                  min={0}
                  step={0.01}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock
                </label>
                <Input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleFormChange}
                  required
                  min={0}
                  step={0.01}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="image" className="text-sm font-medium">
                  Image
                </label>
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFormChange}
                  className="mt-1"
                />
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

        {/* Add New Category Modal */}
        <Dialog open={categoryModalOpen} onOpenChange={handleCategoryModalClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label htmlFor="c_name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryFormChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="c_description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={categoryForm.description}
                  onChange={handleCategoryFormChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={categoryForm.active}
                  onCheckedChange={(checked) =>
                    setCategoryForm((prev) => ({ ...prev, active: checked }))
                  }
                  name="active"
                  id="active"
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div>
                <label htmlFor="c_image" className="text-sm font-medium">
                  Image
                </label>
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryFormChange}
                  className="mt-1"
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleCategoryModalClose}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this product? This action cannot be undone.</div>
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
  );
}