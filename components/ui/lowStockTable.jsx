import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export default function LowStockTable({ products }) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead className="text-start w-16">الصورة</TableHead>
                        <TableHead className="text-start">اسم المنتج</TableHead>
                        <TableHead className="text-start">الكمية الحالية</TableHead>
                        <TableHead className="text-start">حد الأمان</TableHead>
                        <TableHead className="text-start">الحالة</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                لا توجد نواقص لعرضها
                            </TableCell>
                        </TableRow>
                    ) : products.map(product => {
                        const isOutOfStock = product.stock_quantity === 0;
                        return (
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
                                <span className="font-medium text-foreground">{product.name}</span>
                            </TableCell>
                            <TableCell className={cn(
                                "font-medium tabular-nums",
                                isOutOfStock ? "text-destructive" : "text-orange-500"
                            )}>
                                {product.stock_quantity}
                            </TableCell>
                            <TableCell className="font-medium tabular-nums text-muted-foreground">
                                {product.min_stock_limit}
                            </TableCell>
                            <TableCell>
                                {isOutOfStock ? (
                                    <Badge variant="destructive">نفد تماماً</Badge>
                                ) : (
                                    <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-transparent">منخفض</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
        </div>
    )
}
