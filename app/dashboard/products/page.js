"use client";

import BarcodeScannerDialog from "@/components/ui/barcodeScannerDialog";
import CreateProductDialog from "@/components/ui/createProductDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductsTable from "@/components/ui/productsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, Camera, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DeleteProductDialog from "@/components/ui/deleteProductDialog";
import UpdateProductDialog from "@/components/ui/updateProductDialog";

export default function ProductsPage() {
    const { user, loading: userLoading } = useAuth()
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [query, setQuery] = useState("")
    const [deleteProductOpen, setDeleteProductOpen] = useState(false)
    const [deleteProductId, setDeleteProductId] = useState(null)
    const [updateProductOpen, setUpdateProductOpen] = useState(false)
    const [updateProduct, setUpdateProduct] = useState(null)

    const getProducts = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/products");
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? "تعذر تحميل المنتجات")
            setProducts(data.products ?? [])
        } catch (err) {
            console.log(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        const searchWord = query.toLowerCase();

        const result = products.filter(item => {
            const inName = item.name.toLowerCase().includes(searchWord);
            const inDescription = item.description.toLowerCase().includes(searchWord);
            const inBarcode = item.barcode?.toString().includes(searchWord)
            const inCategory = item.category.some(i =>
                i.toLowerCase().includes(searchWord)
            );

            return inName || inDescription || inCategory || inBarcode;
        });

        setFilteredProducts(result);
        console.log("query:", result)
    }, [query, products]);

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight truncate">
                    {userLoading ? <Skeleton className="h-7 w-40" /> : (user?.store_name || "متجري")}
                </h1>
                <CreateProductDialog onCreated={getProducts}>
                    <Button>
                        <Plus className="h-4 w-4" />
                        إضافة منتج
                    </Button>
                </CreateProductDialog>
            </header>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 -translate-y-1/2 inset-e-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="ابحث بالاسم أو الوصف أو التصنيف أو الباركود..."
                        className="pe-9"
                    />
                </div>
                <BarcodeScannerDialog onScan={setQuery}>
                    <Button variant="outline" size="icon" aria-label="مسح الباركود">
                        <Camera className="h-4 w-4" />
                    </Button>
                </BarcodeScannerDialog>
            </div>
            <div>
                {loading ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-16 text-muted-foreground">
                        <Spinner />
                        <span>جارٍ تحميل المنتجات...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        <p className="text-sm text-destructive">{error}</p>
                        <Button variant="outline" size="sm" onClick={getProducts}>
                            إعادة المحاولة
                        </Button>
                    </div>
                ) : (
                    <ProductsTable products={filteredProducts} setDeleteProductId={setDeleteProductId} setDeleteProductOpen={setDeleteProductOpen} setUpdateProduct={setUpdateProduct} setUpdateProductOpen={setUpdateProductOpen}/>
                )}
            </div>
            <DeleteProductDialog open={deleteProductOpen} setOpen={setDeleteProductOpen} id={deleteProductId} />
            <UpdateProductDialog open={updateProductOpen} setOpen={setUpdateProductOpen} product={updateProduct} />
        </div>
    )
}