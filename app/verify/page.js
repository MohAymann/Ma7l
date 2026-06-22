"use client"
import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Store, Loader2, CheckCircle, XCircle } from "lucide-react"

function VerifyContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")
    const [status, setStatus] = useState("loading")

    const hasFetched = useRef(false)

    useEffect(() => {
        if (!token) {
            setStatus("error")
            return
        }

        if (hasFetched.current) return
        hasFetched.current = true

        fetch(`/api/auth/verify?token=${token}`)
            .then(res => {
                if (res.ok) {
                    setStatus("success")
                    setTimeout(() => router.push("/dashboard"), 3000)
                } else {
                    setStatus("error")
                }
            })
            .catch(() => setStatus("error"))
    }, [token, router])

    return (
        <Card className="w-full max-w-md p-8 text-center flex flex-col items-center justify-center gap-4">
            {status === "loading" && (
                <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <h2 className="text-xl font-semibold">جاري التحقق من حسابك...</h2>
                    <p className="text-muted-foreground text-sm">يرجى الانتظار قليلاً</p>
                </>
            )}
            {status === "success" && (
                <>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <h2 className="text-xl font-semibold">تم تفعيل حسابك بنجاح!</h2>
                    <p className="text-muted-foreground text-sm">سيتم تحويلك إلى لوحة التحكم...</p>
                </>
            )}
            {status === "error" && (
                <>
                    <XCircle className="h-12 w-12 text-destructive" />
                    <h2 className="text-xl font-semibold">رابط التحقق غير صالح أو منتهي الصلاحية</h2>
                    <p className="text-muted-foreground text-sm">الرجاء التأكد من الرابط أو طلب رابط جديد.</p>
                </>
            )}
        </Card>
    )
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4 gap-6">
            <div className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Store className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight"><span className="text-primary font-extrabold">M</span>a7l<span className="text-primary font-bold text-4xl">.</span></h1>
            </div>
            <Suspense fallback={<Card className="w-full max-w-md p-8 text-center"><Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" /></Card>}>
                <VerifyContent />
            </Suspense>
        </div>
    )
}
