"use client"

import { useState } from "react"
import { Button } from "./button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"

export default function DeleteProductDialog({ open, setOpen, id }) {
    const [error, setError] = useState(null)


    const handleDeleteProduct = async () => {
        try{    
            const res = await fetch("/api/products",{
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetId: id
                })
            })
            if(!res.ok) throw new Error("حدث خطأ أثناء حذف المنتج")
            setOpen(false)
        }catch(err){
            setError(err)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent dir="rtl" className="p-5 m-5" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>حذف المنتج</DialogTitle>
                    <DialogDescription>
                        هل أنت متأكد من رغبتك في حذف المنتج؟
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDeleteProduct}>حذف</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}