"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Plus, Upload, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "./dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Badge } from "./badge";
import { Spinner } from "./spinner";

const SCANNER_ID = "create-product-scanner";

const initialForm = {
    barcode: "", image: "", name: "", description: "",
    stock_quantity: "", min_stock_limit: "",
    buy_price: "", sell_price: "",
};

export default function CreateProductDialog({ children, onCreated }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState("");
    const [scanning, setScanning] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);

    const reset = () => {
        setForm(initialForm); setCategories([]); setCategoryInput("");
        setError(null); setScanning(false);
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true); setError(null);
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok || !data.url) throw new Error(data?.error || "فشل رفع الصورة");
            setForm(prev => ({ ...prev, image: data.url }));
        } catch (err) { setError(err.message); }
        finally { setUploading(false); }
    };

    useEffect(() => {
        if (open) {
            fetch("/api/categories")
                .then(res => res.json())
                .then(data => {
                    if (data.categories) setAvailableCategories(data.categories);
                })
                .catch(() => {});
        }
    }, [open]);

    const addCategory = async () => {
        const val = categoryInput.trim();
        if (!val) return;
        
        if (categories.some(c => (typeof c === 'string' ? c : c.name) === val)) {
            setCategoryInput("");
            return;
        }

        const existing = availableCategories.find(c => c.name === val);
        if (existing) {
            setCategories(prev => [...prev, { id: existing._id, name: existing.name }]);
            setCategoryInput("");
        } else {
            try {
                const res = await fetch("/api/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: val })
                });
                const data = await res.json();
                if (res.ok) {
                    setCategories(prev => [...prev, { id: data.category._id, name: data.category.name }]);
                    setAvailableCategories(prev => [...prev, data.category]);
                    setCategoryInput("");
                } else {
                    toast.error(data.message || "تعذر إنشاء التصنيف");
                }
            } catch (err) {
                toast.error("تعذر إنشاء التصنيف");
            }
        }
    };

    useEffect(() => {
        if (!scanning) return;
        if (typeof window !== "undefined" && !window.isSecureContext) {
            setError("الكاميرا تتطلب اتصال آمن (HTTPS). شغّل الخادم عبر next dev --experimental-https");
            setScanning(false);
            return;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
            setError("المتصفح لا يدعم الوصول إلى الكاميرا");
            setScanning(false);
            return;
        }
        const scanner = new Html5Qrcode(SCANNER_ID);
        scannerRef.current = scanner;
        const starting = scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            decoded => {
                setForm(prev => ({ ...prev, barcode: decoded }));
                setScanning(false);
            },
            () => { }
        ).catch(err => {
            const name = err?.name || "";
            const msg = name === "NotAllowedError" ? "تم رفض إذن الكاميرا"
                : name === "NotFoundError" ? "لم يتم العثور على كاميرا"
                    : `تعذر فتح الكاميرا: ${err?.message || name || "خطأ غير معروف"}`;
            setError(msg);
            setScanning(false);
            throw err;
        });
        return () => {
            scannerRef.current = null;
            starting
                .then(() => scanner.stop())
                .then(() => scanner.clear())
                .catch(() => { });
        };
    }, [scanning]);

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        const payload = {
            barcode: form.barcode,
            image: form.image,
            name: form.name,
            description: form.description,
            stock_quantity: Number(form.stock_quantity),
            min_stock_limit: Number(form.min_stock_limit),
            buy_price: Number(form.buy_price),
            sell_price: Number(form.sell_price),
            category: categories,
        };
        if (!payload.name || !payload.description || !payload.barcode || !payload.image
            || !payload.stock_quantity || !payload.min_stock_limit
            || !payload.buy_price || !payload.sell_price) {
            setError("يرجى ملئ جميع البيانات");
            return;
        }
        try {
            setSubmitting(true);
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? "تعذرت إضافة المنتج");
            reset(); setOpen(false);
            toast.success("تمت إضافة المنتج بنجاح");
            onCreated?.();
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
        finally { setSubmitting(false); }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false} dir="rtl">
                <DialogHeader>
                    <DialogTitle>إضافة منتج جديد</DialogTitle>
                    <DialogDescription>املأ بيانات المنتج لإضافته إلى المخزن</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldGroup className="gap-4">
                        {error && <FieldError>{error}</FieldError>}

                        <Field>
                            <FieldLabel htmlFor="image">الصورة (رابط أو رفع من الجهاز)</FieldLabel>
                            <div className="flex gap-2">
                                <Input 
                                    id="image" 
                                    name="image" 
                                    value={form.image} 
                                    onChange={handleChange} 
                                    placeholder="أدخل رابط الصورة..." 
                                />
                                <div className="relative shrink-0">
                                    <Button type="button" variant="outline" size="icon" disabled={uploading} aria-label="رفع صورة من الجهاز" tabIndex={-1}>
                                        {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                                    </Button>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        title="اختر صورة من الجهاز"
                                    />
                                </div>
                            </div>
                            {form.image && (
                                <div className="mt-2 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                                    <img src={form.image} alt="معاينة الصورة" className="size-full object-cover" />
                                </div>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="barcode">الباركود</FieldLabel>
                            <div className="flex gap-2">
                                <Input id="barcode" name="barcode" value={form.barcode} onChange={handleChange} inputMode="numeric" />
                                <Button type="button" variant="outline" size="icon" onClick={() => setScanning(s => !s)} aria-label="مسح الباركود">
                                    {scanning ? <X className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                                </Button>
                            </div>
                            {scanning && (
                                <div
                                    id={SCANNER_ID}
                                    className="mt-2 w-full min-h-64 overflow-hidden rounded-md border border-border bg-black"
                                />
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">اسم المنتج</FieldLabel>
                            <Input id="name" name="name" value={form.name} onChange={handleChange} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">الوصف</FieldLabel>
                            <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={2} />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel htmlFor="stock_quantity">الكمية</FieldLabel>
                                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" value={form.stock_quantity} onChange={handleChange} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="min_stock_limit">الحد الأدنى</FieldLabel>
                                <Input id="min_stock_limit" name="min_stock_limit" type="number" min="0" value={form.min_stock_limit} onChange={handleChange} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel htmlFor="buy_price">سعر الشراء</FieldLabel>
                                <Input id="buy_price" name="buy_price" type="number" min="0" value={form.buy_price} onChange={handleChange} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="sell_price">سعر البيع</FieldLabel>
                                <Input id="sell_price" name="sell_price" type="number" min="0" value={form.sell_price} onChange={handleChange} />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>التصنيفات</FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    list="existing-categories"
                                    value={categoryInput}
                                    onChange={e => setCategoryInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
                                    placeholder="اختر أو أضف تصنيف جديد ثم Enter"
                                />
                                <datalist id="existing-categories">
                                    {availableCategories.map(cat => (
                                        <option key={cat._id} value={cat.name} />
                                    ))}
                                </datalist>
                                <Button type="button" variant="outline" size="icon" onClick={addCategory} aria-label="إضافة">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {categories.map((c, i) => {
                                        const name = typeof c === 'string' ? c : c.name;
                                        const id = typeof c === 'string' ? name : c.id;
                                        return (
                                        <Badge key={i} variant="secondary" className="gap-1">
                                            {name}
                                            <button
                                                type="button"
                                                onClick={() => setCategories(prev => prev.filter((_, index) => index !== i))}
                                                aria-label="إزالة"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )})}
                                </div>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={submitting || uploading}>
                            {submitting && <Spinner />} إضافة
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}