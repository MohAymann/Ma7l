import { Package, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

function StockStatus({ stock, min }) {
    if (stock === 0) return <Badge variant="destructive">نفد</Badge>
    if (stock <= min) return <Badge variant="destructive">منخفض</Badge>
    return <Badge className="bg-primary/10 text-primary">متوفر</Badge>
}

export default function ProductsTable({ products, setDeleteProductOpen, setDeleteProductId }) {

    const handleDeleteClick = (id) => {
        setDeleteProductId(id)
        setDeleteProductOpen(true)
    }
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead className="text-start w-16">الصورة</TableHead>
                        <TableHead className="text-start">اسم المنتج</TableHead>
                        <TableHead className="text-start">التصنيف</TableHead>
                        <TableHead className="text-start">السعر</TableHead>
                        <TableHead className="text-start">الكمية</TableHead>
                        <TableHead className="text-start">الحالة</TableHead>
                        <TableHead className="text-end w-24">إجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                لا توجد منتجات لعرضها
                            </TableCell>
                        </TableRow>
                    ) : products.map(product => (
                        <TableRow key={product._id}>
                            <TableCell>
                                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex max-w-xs flex-col gap-0.5">
                                    <span className="font-medium text-foreground">{product.name}</span>
                                    {product.description && (
                                        <span className="line-clamp-1 text-xs text-muted-foreground">
                                            {product.description}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {product.category.map(cat => (
                                        <Badge key={cat} variant="secondary">{cat}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                {product.sell_price} <span className="text-xs text-muted-foreground">ج.م</span>
                            </TableCell>
                            <TableCell className={cn(
                                "font-medium tabular-nums",
                                product.stock_quantity <= product.min_stock_limit && "text-destructive"
                            )}>
                                {product.stock_quantity}
                            </TableCell>
                            <TableCell>
                                <StockStatus stock={product.stock_quantity} min={product.min_stock_limit} />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon-sm" aria-label="تعديل">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteClick(product._id)}
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label="حذف"
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}