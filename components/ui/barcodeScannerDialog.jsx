"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
} from "./dialog";

const SCANNER_ID = "barcode-scanner-dialog";

function ScannerView({ onResult }) {
    const onResultRef = useRef(onResult);
    onResultRef.current = onResult;

    useEffect(() => {
        if (typeof window !== "undefined" && !window.isSecureContext) {
            toast.error("الكاميرا تتطلب اتصال آمن (HTTPS)");
            onResultRef.current?.(null);
            return;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
            toast.error("المتصفح لا يدعم الوصول إلى الكاميرا");
            onResultRef.current?.(null);
            return;
        }
        if (!document.getElementById(SCANNER_ID)) return;

        let cancelled = false;
        const scanner = new Html5Qrcode(SCANNER_ID);
        const starting = scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            decoded => {
                if (cancelled) return;
                cancelled = true;
                onResultRef.current?.(decoded);
            },
            () => { }
        ).catch(err => {
            const name = err?.name || "";
            const msg = name === "NotAllowedError" ? "تم رفض إذن الكاميرا"
                : name === "NotFoundError" ? "لم يتم العثور على كاميرا"
                    : `تعذر فتح الكاميرا: ${err?.message || name || "خطأ غير معروف"}`;
            toast.error(msg);
            onResultRef.current?.(null);
        });

        return () => {
            cancelled = true;
            starting
                .then(() => scanner.stop())
                .then(() => scanner.clear())
                .catch(() => { });
        };
    }, []);

    return (
        <div
            id={SCANNER_ID}
            className="w-full min-h-64 overflow-hidden rounded-md border border-border bg-black"
        />
    );
}

export default function BarcodeScannerDialog({ children, onScan }) {
    const [open, setOpen] = useState(false);

    const handleResult = value => {
        setOpen(false);
        if (value) onScan?.(value);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>مسح الباركود</DialogTitle>
                    <DialogDescription>وجّه الكاميرا إلى الباركود</DialogDescription>
                </DialogHeader>
                {open && <ScannerView onResult={handleResult} />}
            </DialogContent>
        </Dialog>
    );
}
