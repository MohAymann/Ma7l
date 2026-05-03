"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
} from "./dialog";

const SCANNER_ID = "barcode-scanner-dialog";

export default function BarcodeScannerDialog({ children, onScan }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (typeof window !== "undefined" && !window.isSecureContext) {
            toast.error("الكاميرا تتطلب اتصال آمن (HTTPS)");
            setOpen(false);
            return;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
            toast.error("المتصفح لا يدعم الوصول إلى الكاميرا");
            setOpen(false);
            return;
        }
        const scanner = new Html5Qrcode(SCANNER_ID);
        const starting = scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            decoded => {
                onScan?.(decoded);
                setOpen(false);
            },
            () => { }
        ).catch(err => {
            const name = err?.name || "";
            const msg = name === "NotAllowedError" ? "تم رفض إذن الكاميرا"
                : name === "NotFoundError" ? "لم يتم العثور على كاميرا"
                    : `تعذر فتح الكاميرا: ${err?.message || name || "خطأ غير معروف"}`;
            toast.error(msg);
            setOpen(false);
            throw err;
        });
        return () => {
            starting
                .then(() => scanner.stop())
                .then(() => scanner.clear())
                .catch(() => { });
        };
    }, [open, onScan]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>مسح الباركود</DialogTitle>
                    <DialogDescription>وجّه الكاميرا إلى الباركود</DialogDescription>
                </DialogHeader>
                <div
                    id={SCANNER_ID}
                    className="w-full min-h-64 overflow-hidden rounded-md border border-border bg-black"
                />
            </DialogContent>
        </Dialog>
    );
}
