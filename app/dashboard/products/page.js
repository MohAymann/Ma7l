"use client";

import { Input } from "@/components/ui/input";
import ProductsTable from "@/components/ui/productsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const { user, loading: userLoading } = useAuth()
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [query, setQuery] = useState("")

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data.products)
            } catch (err) {
                console.log(err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        getProducts();
    }, []);

    useEffect(() => {
        const searchWord = query.toLowerCase();

        const result = products.filter(item => {
            const inName = item.name.toLowerCase().includes(searchWord);
            const inDescription = item.description.toLowerCase().includes(searchWord);
            const inCategory = item.category.some(i =>
                i.toLowerCase().includes(searchWord)
            );
            // const inBarcode = item.barcode.includes(searchWord)

            return inName || inDescription || inCategory;
        });

        setFilteredProducts(result);
        console.log("query:",result)
    }, [query, products]);

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight truncate">
                    {userLoading ? <Skeleton className="h-7 w-40" /> : (user?.store_name || "متجري")}
                </h1>
                <div />
            </header>

            <div className="relative">
                <Search className="absolute top-1/2 -translate-y-1/2 inset-e-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="pe-9"
                />
            </div>
            <div>
                <ProductsTable products={filteredProducts} />
            </div>
            <section />
        </div>
    )
}